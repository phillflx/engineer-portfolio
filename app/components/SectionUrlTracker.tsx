"use client";

import { useLayoutEffect } from "react";
import type { Locale } from "../lib/locales";

const sectionIds = ["hero", "services", "projects", "contact"] as const;

type VisibleSection = {
  id: (typeof sectionIds)[number];
  area: number;
  top: number;
};

function getVisibleSections(): VisibleSection[] {
  return sectionIds.flatMap((id) => {
    const section = document.getElementById(id);
    if (!section) return [];

    const bounds = section.getBoundingClientRect();
    const top = Math.max(0, bounds.top);
    const bottom = Math.min(window.innerHeight, bounds.bottom);
    const left = Math.max(0, bounds.left);
    const right = Math.min(window.innerWidth, bounds.right);
    const area = Math.max(0, bottom - top) * Math.max(0, right - left);

    return area > 0 ? [{ id, area, top }] : [];
  });
}

function getActiveSection(sections: VisibleSection[]) {
  if (sections.length === 0) return undefined;

  const greatestArea = Math.max(...sections.map((section) => section.area));
  const tiedSections = sections.filter(
    (section) => section.area === greatestArea,
  );
  const currentId = window.location.hash.slice(1);
  const currentSection = tiedSections.find(
    (section) => section.id === currentId,
  );

  if (currentSection) return currentSection;
  return tiedSections.reduce((topmost, section) =>
    section.top < topmost.top ? section : topmost,
  );
}

type SectionUrlTrackerProps = {
  locale: Locale;
};

export function SectionUrlTracker({ locale }: SectionUrlTrackerProps) {
  useLayoutEffect(() => {
    let animationFrame: number | undefined;
    let restoreTimer: number | undefined;
    let userInitiatedScroll = false;
    const expectedPath = `/${locale}`;
    let fragmentScrollPosition: { left: number; top: number } | undefined;

    function updateFragment() {
      animationFrame = undefined;
      if (window.location.pathname !== expectedPath) return;

      const activeSection = getActiveSection(getVisibleSections());
      if (!activeSection || window.location.hash === `#${activeSection.id}`) {
        return;
      }

      fragmentScrollPosition = {
        left: window.scrollX,
        top: window.scrollY,
      };
      window.History.prototype.replaceState.call(
        window.history,
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}#${activeSection.id}`,
      );
      restoreTimer = window.setTimeout(() => {
        fragmentScrollPosition = undefined;
        restoreTimer = undefined;
      }, 1000);
    }

    function scheduleUpdate() {
      if (
        !userInitiatedScroll ||
        window.location.pathname !== expectedPath ||
        animationFrame !== undefined
      ) {
        return;
      }
      animationFrame = window.requestAnimationFrame(updateFragment);
    }

    function handleScroll() {
      if (fragmentScrollPosition) {
        if (
          window.scrollX !== fragmentScrollPosition.left ||
          window.scrollY !== fragmentScrollPosition.top
        ) {
          window.scrollTo({
            ...fragmentScrollPosition,
            behavior: "instant",
          });
        }
        return;
      }

      scheduleUpdate();
    }

    function resumeAfterUserScroll() {
      userInitiatedScroll = true;
      fragmentScrollPosition = undefined;
      if (restoreTimer !== undefined) {
        window.clearTimeout(restoreTimer);
        restoreTimer = undefined;
      }
      scheduleUpdate();
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target === document.documentElement ||
        event.target === document.body
      ) {
        resumeAfterUserScroll();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]
          .includes(event.key)
      ) {
        resumeAfterUserScroll();
      }
    }

    function handleSectionLinkClick(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        event.target.closest('a[href^="#"]')
      ) {
        resumeAfterUserScroll();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("wheel", resumeAfterUserScroll, { passive: true });
    window.addEventListener("touchstart", resumeAfterUserScroll, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("click", handleSectionLinkClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("wheel", resumeAfterUserScroll);
      window.removeEventListener("touchstart", resumeAfterUserScroll);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("click", handleSectionLinkClick);
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
      if (restoreTimer !== undefined) {
        window.clearTimeout(restoreTimer);
      }
    };
  }, [locale]);

  return null;
}
