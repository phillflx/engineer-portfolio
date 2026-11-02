import { expect, test, type Page } from "@playwright/test";

const sectionIds = ["hero", "services", "projects", "contact"] as const;
const sectionHeight = 1200;

async function setEqualSectionHeights(page: Page) {
  await page.addStyleTag({
    content: `
      #hero,
      #services,
      #projects,
      #contact {
        height: ${sectionHeight}px !important;
        min-height: ${sectionHeight}px !important;
        max-height: ${sectionHeight}px !important;
        margin-block: 0 !important;
        padding: 0 !important;
      }
    `,
  });
}

async function centerSection(
  page: Page,
  id: (typeof sectionIds)[number],
) {
  await page.evaluate((sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) throw new Error(`Missing section #${sectionId}`);

    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1 }));
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + section.offsetHeight / 2 - window.innerHeight / 2,
      behavior: "instant",
    });
  }, id);
}

test("scrolling tracks the largest visible section in both locales without adding history entries", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const locale of ["en", "pt-BR"]) {
    await page.goto(`/${locale}`);
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    await setEqualSectionHeights(page);

    const historyLength = await page.evaluate(() => window.history.length);

    for (const id of sectionIds) {
      await centerSection(page, id);
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect
        .poll(() => page.evaluate(() => window.history.length))
        .toBe(historyLength);
    }

    await page.locator('header a[href="#services"]').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}#services$`));
    const historyLengthAfterAnchorNavigation = await page.evaluate(
      () => window.history.length,
    );

    await centerSection(page, "projects");
    await expect(page).toHaveURL(new RegExp(`#projects$`));
    await expect
      .poll(() => page.evaluate(() => window.history.length))
      .toBe(historyLengthAfterAnchorNavigation);
  }
});

test("an exact visible-area tie retains the previously current section", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 801 });
  await page.goto("/en#hero");
  await expect(page).toHaveURL(/#hero$/);
  await setEqualSectionHeights(page);

  const areas = await page.evaluate(() => {
    const hero = document.getElementById("hero");
    const services = document.getElementById("services");
    const header = document.querySelector("header");
    if (!hero || !services || !header) {
      throw new Error("Missing section or sticky header");
    }

    const headerRect = header.getBoundingClientRect();
    const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
    const visibleTop =
      headerRect.top <= 0 ? Math.max(0, headerRect.bottom) : 0;
    const visibleHeight = window.innerHeight - visibleTop;
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1 }));
    window.scrollTo({
      top: heroBottom - visibleTop - visibleHeight / 2,
      behavior: "instant",
    });

    const visibleArea = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const width = Math.max(
        0,
        Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
      );
      const heightVisible = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) -
          Math.max(rect.top, visibleTop),
      );
      return width * heightVisible;
    };

    return {
      hero: visibleArea(hero),
      services: visibleArea(services),
    };
  });

  expect(Math.abs(areas.hero - areas.services)).toBeLessThan(1);
  await expect(page).toHaveURL(/#hero$/);
});

test("the browser Back button skips scroll-driven fragment changes", async ({
  page,
}) => {
  await page.goto("/pt-BR");
  await page.goto("/en");
  await setEqualSectionHeights(page);

  const historyLength = await page.evaluate(() => window.history.length);
  await centerSection(page, "projects");
  await expect(page).toHaveURL(/\/en#projects$/);
  await expect
    .poll(() => page.evaluate(() => window.history.length))
    .toBe(historyLength);

  await page.goBack();
  await expect(page).toHaveURL(/\/pt-BR$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});
