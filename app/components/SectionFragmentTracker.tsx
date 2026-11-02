"use client";

import { useEffect } from "react";

const sectionIds = ["hero", "services", "projects", "contact"] as const;

function isSectionId(id: string): id is (typeof sectionIds)[number] {
  return sectionIds.some((sectionId) => sectionId === id);
}

export function SectionFragmentTracker() {
  useEffect(() => {
    let currentSectionId: (typeof sectionIds)[number] | undefined;
    const initialHash = window.location.hash.slice(1);
    if (isSectionId(initialHash)) currentSectionId = initialHash;

    let animationFrame = 0;
    let hasUserScrollIntent = false;

    const updateCurrentSection = (updateFragment: boolean) => {
      const header = document.querySelector("header");
      const headerRect = header?.getBoundingClientRect();
      const viewportTop =
        headerRect && headerRect.top <= 0
          ? Math.max(0, headerRect.bottom)
          : 0;
      const areas = sectionIds.map((id) => {
        const section = document.getElementById(id);
        if (!section) return { id, area: 0 };

        const rect = section.getBoundingClientRect();
        const visibleWidth = Math.max(
          0,
          Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
        );
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, window.innerHeight) -
            Math.max(rect.top, viewportTop),
        );

        return { id, area: visibleWidth * visibleHeight };
      });
      const largestArea = Math.max(...areas.map(({ area }) => area));
      const tiedSections = areas.filter(({ area }) => area === largestArea);
      const selectedSection =
        tiedSections.find(({ id }) => id === currentSectionId) ??
        tiedSections[0];

      if (!selectedSection) return;

      currentSectionId = selectedSection.id;
      if (!updateFragment || window.location.hash === `#${selectedSection.id}`)
        return;

      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}#${selectedSection.id}`,
      );
    };

    let shouldUpdateFragment = false;
    const scheduleUpdate = (updateFragment: boolean) => {
      if (updateFragment) shouldUpdateFragment = true;
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateCurrentSection(shouldUpdateFragment);
        shouldUpdateFragment = false;
      });
    };

    const handleScroll = () => scheduleUpdate(true);
    const handleResize = () => scheduleUpdate(true);
    const handleScrollIntent = () => {
      hasUserScrollIntent = true;
      scheduleUpdate(true);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest("a, button, input, select, textarea, [role='button']"))
      ) {
        return;
      }

      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          event.key,
        )
      ) {
        handleScrollIntent();
      }
    };
    const handleViewportScroll = () => {
      if (hasUserScrollIntent) handleScroll();
    };
    window.addEventListener("scroll", handleViewportScroll, { passive: true });
    window.addEventListener("wheel", handleScrollIntent, { passive: true });
    window.addEventListener("touchmove", handleScrollIntent, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    scheduleUpdate(false);

    return () => {
      window.removeEventListener("scroll", handleViewportScroll);
      window.removeEventListener("wheel", handleScrollIntent);
      window.removeEventListener("touchmove", handleScrollIntent);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
