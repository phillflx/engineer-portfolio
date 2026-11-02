# Bug Assessment: Carousel Items Have Different Heights

- **Slug**: caroulsel-items-height
- **Created**: 2026-11-02
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: low

## Report (verbatim or summarized)

> carousel items with different heights. caroulsel items height must match the height of the tallest item.

## Symptom

Cards in the services and/or projects carousels can appear at different heights because their content lengths differ. All cards in a carousel should fill the tallest item's height so the row has a consistent bottom edge.

## Reproduction

1. Open `/en` or `/pt-BR`.
2. View the Services and Projects carousels and compare the visible card heights.
3. Observe that cards with shorter content do not necessarily extend to the height of the tallest card.

[NEEDS CLARIFICATION: Browser and viewport where the difference is most visible; the report does not identify a particular carousel.]

## Suspected Code Paths

- `app/globals.css:81` — `.carousel__track` is a horizontal flex container, and `:95` defines flex items, but does not set the inner card height.
- `app/components/ContentCarousel.tsx:131` — each carousel child is wrapped in a `<li className="carousel__item">`; the flex item may stretch while its nested card remains at its intrinsic height.
- `app/components/ServicesSection.module.css:28` — service cards use `min-height: 258px`, which establishes only a minimum and allows content to produce taller cards.
- `app/components/ProjectsSection.module.css:28` — project cards have content-driven height with no shared height rule; summaries vary in length.

## Root Cause Hypothesis

The carousel track's flex layout can stretch its `<li>` items to the row's cross-axis size, but the nested service/project card elements do not fill those stretched wrappers. Their own heights therefore remain content-dependent; the service card's minimum height does not equalize cards when one item's content needs more space. **Confidence: high.**

## Proposed Remediation

**Preferred**: Add a shared carousel item rule so the direct card child fills the stretched list-item height (for example, `height: 100%` on `.carousel__item > *`). This keeps the layout and scroll-snap behavior intact while making each card match the tallest item in the carousel row.

Add browser assertions that compare the rendered card heights within both the Services and Projects carousels, including the longer translated copy, at narrow and wide viewport sizes.

**Files likely to change**:
- `app/globals.css`
- `tests/e2e/services-carousel.spec.ts`
- `tests/e2e/projects-carousel.spec.ts`

**Tests to add or update**:
- Assert that all service cards in a carousel have equal rendered heights.
- Assert that all project cards in a carousel have equal rendered heights.
- Exercise both locales and responsive viewport widths so translated wrapping does not regress equal-height behavior.

## Risks & Considerations

- A card height matching the tallest item's content can increase the height of every card in that carousel, especially on narrow screens or with longer translations; this is the requested behavior.
- Keep horizontal scrolling, scroll snapping, and the existing carousel controls unchanged.

## Open Questions

- [NEEDS CLARIFICATION: Does the report refer to both Services and Projects, or only one of those carousels?]
