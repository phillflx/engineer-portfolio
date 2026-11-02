"use client";

import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ContentCarouselProps = {
  label: string;
  positionLabel: string;
  showPosition?: boolean;
  previousLabel: string;
  nextLabel: string;
  children: ReactNode;
};

export function ContentCarousel({
  label,
  positionLabel,
  showPosition = true,
  previousLabel,
  nextLabel,
  children,
}: ContentCarouselProps) {
  const viewportRef = useRef<HTMLUListElement>(null);
  const itemCount = Children.count(children);
  const [position, setPosition] = useState({
    currentIndex: 0,
    atStart: true,
    atEnd: itemCount <= 1,
  });
  const [itemsFit, setItemsFit] = useState(false);

  const updatePosition = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    setItemsFit(viewport.scrollWidth <= viewport.clientWidth + 1);

    const items = Array.from(viewport.children);
    const currentScroll = viewport.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    const viewportLeft = viewport.getBoundingClientRect().left;

    items.forEach((item, index) => {
      const itemLeft =
        (item as HTMLElement).getBoundingClientRect().left -
        viewportLeft +
        currentScroll;
      const distance = Math.abs(itemLeft - currentScroll);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    setPosition({
      currentIndex: closestIndex,
      atStart: currentScroll <= 2,
      atEnd: currentScroll + viewport.clientWidth >= viewport.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  const move = useCallback((direction: -1 | 1) => {
    const viewport = viewportRef.current;
    const firstItem = viewport?.firstElementChild;
    if (!viewport || !firstItem) return;

    const gap = Number.parseFloat(window.getComputedStyle(viewport).columnGap) || 0;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
    viewport.scrollBy({
      left: (firstItem.getBoundingClientRect().width + gap) * direction,
      behavior,
    });
  }, []);

  const previous = useCallback(() => {
    if (position.atStart) return;
    move(-1);
  }, [move, position.atStart]);

  const next = useCallback(() => {
    if (position.atEnd) return;
    move(1);
  }, [move, position.atEnd]);

  return (
    <div className="carousel">
      <div className="carousel__controls">
        {showPosition ? (
          <p className="carousel__position" aria-live="polite">
            {positionLabel
              .replace("{current}", String(position.currentIndex + 1))
              .replace("{total}", String(itemCount))}
          </p>
        ) : null}
        {!itemsFit ? (
          <div className="carousel__buttons">
            <button
              type="button"
              className="carousel__button"
              aria-label={previousLabel}
              onClick={previous}
              disabled={position.atStart}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="carousel__button"
              aria-label={nextLabel}
              onClick={next}
              disabled={position.atEnd}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}
      </div>
      <ul
        ref={viewportRef}
        className={`carousel__track${itemsFit ? " carousel__track--justified" : ""}`}
        aria-label={label}
        onScroll={updatePosition}
      >
        {Children.map(children, (child, index) => (
          <li className="carousel__item" key={index}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}
