import { expect, test } from "@playwright/test";

async function expectedActiveSection(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const sections = ["hero", "services", "projects", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
      .map((section) => {
        const bounds = section.getBoundingClientRect();
        const top = Math.max(0, bounds.top);
        const bottom = Math.min(window.innerHeight, bounds.bottom);
        const left = Math.max(0, bounds.left);
        const right = Math.min(window.innerWidth, bounds.right);

        return {
          id: section.id,
          area: Math.max(0, bottom - top) * Math.max(0, right - left),
          top,
        };
      })
      .filter((section) => section.area > 0);

    if (sections.length === 0) return window.location.hash.slice(1);

    const greatestArea = Math.max(...sections.map((section) => section.area));
    const tiedSections = sections.filter(
      (section) => section.area === greatestArea,
    );
    const currentSection = window.location.hash.slice(1);

    if (tiedSections.some((section) => section.id === currentSection)) {
      return currentSection;
    }

    return tiedSections.sort((first, second) => first.top - second.top)[0].id;
  });
}

test("scrolling synchronizes the fragment to the greatest visible area without adding history entries", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const locale of ["en", "pt-BR"]) {
    await page.goto(`/${locale}`);
    const languageLabel = locale === "en" ? "Language" : "Idioma";
    await page.getByLabel(languageLabel).click();
    await page.keyboard.press("Escape");
    const initialHistoryLength = await page.evaluate(
      () => window.history.length,
    );

    const documentHeight = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    const scrollPositions = Array.from(
      new Set([
        0,
        Math.round(documentHeight * 0.2),
        Math.round(documentHeight * 0.4),
        Math.round(documentHeight * 0.6),
        Math.round(documentHeight * 0.8),
        documentHeight,
      ]),
    );

    for (const position of scrollPositions) {
      await page.evaluate((top) => window.scrollTo(0, top), position);
      await page.evaluate(() =>
        window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1 })),
      );
      await page.waitForTimeout(50);
      const expected = await expectedActiveSection(page);
      const state = await page.evaluate(() => ({
        actual: window.location.hash.slice(1),
        scrollY: window.scrollY,
      }));
      expect(
        state.actual,
        `At scrollY ${state.scrollY}, expected #${expected} based on visible areas`,
      ).toBe(expected);
    }

    await expect
      .poll(() => page.evaluate(() => window.history.length))
      .toBe(initialHistoryLength);
  }
});

test("equal visible areas retain the active fragment or select the topmost tied section", async ({
  page,
}) => {
  await page.goto("/en#hero");
  await page.getByLabel("Language").click();
  await page.keyboard.press("Escape");

  await page.evaluate(() => {
    for (const id of ["hero", "services", "projects", "contact"]) {
      const section = document.getElementById(id)!;
      section.style.position = "fixed";
      section.style.width = "300px";
      section.style.height = "250px";
      section.style.minHeight = "250px";
      section.style.margin = "0";
      section.style.padding = "0";
      section.style.transform = "none";
      section.style.overflow = "hidden";
      section.style.top = "-1000px";
      section.style.left = "0";
    }

    document.getElementById("hero")!.style.top = "100px";
    document.getElementById("services")!.style.top = "100px";
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1 }));
  });

  await page.evaluate(() => {
    window.History.prototype.replaceState.call(
      window.history,
      window.history.state,
      "",
      "/en#projects",
    );
    document.getElementById("services")!.style.top = "50px";
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1 }));
  });

  await expect(page).toHaveURL(/\/en#services$/);
});

test("retains the fragment while no portfolio sections are visible", async ({
  page,
}) => {
  await page.goto("/en#projects");
  await expect(page.locator("#projects")).toBeInViewport();

  await page.evaluate(() => {
    for (const id of ["hero", "services", "projects", "contact"]) {
      document.getElementById(id)!.style.display = "none";
    }
    window.dispatchEvent(new Event("resize"));
  });

  await expect(page).toHaveURL(/\/en#projects$/);
});
