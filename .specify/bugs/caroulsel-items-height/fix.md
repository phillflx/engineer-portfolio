# Bug Fix: Carousel Items Have Different Heights

- **Slug**: caroulsel-items-height
- **Fixed**: 2026-11-02
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Added a shared carousel rule that makes each card fill its flex-stretched list item, aligning all cards to the height of the tallest card in that carousel. Added responsive browser assertions for both carousels and locales.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `app/globals.css` | modified | Set `.carousel__item > *` to `height: 100%`, preserving track scrolling and snap behavior. |
| `tests/e2e/services-carousel.spec.ts` | modified | Added equal-height assertions for both locales at 320px and 1440px. |
| `tests/e2e/projects-carousel.spec.ts` | modified | Added equal-height assertions for both locales at 320px and 1440px. |

## Diff Highlights

```css
.carousel__item > * {
  height: 100%;
}
```

## Tests Added or Updated

- `tests/e2e/services-carousel.spec.ts` — service-card heights match across the carousel in English and Portuguese at narrow and wide viewport widths.
- `tests/e2e/projects-carousel.spec.ts` — project-card heights match across the carousel in English and Portuguese at narrow and wide viewport widths.

## Local Verification

- Commands run: `npx playwright test tests/e2e/services-carousel.spec.ts tests/e2e/projects-carousel.spec.ts` → 8 passed across desktop and mobile Chromium.
- Commands run: `npm test` → 14 passed.
- Commands run: `npm run lint` → passed.
- Commands run: `npm run typecheck` → passed.
- Commands run: `npm run build` → static build passed.
- Commands run: `git diff --check` → passed.
- Manual checks: No separate manual browser check; rendered heights were compared by automated browser assertions at 320px and 1440px.

## Deviations from Assessment

None.

## Follow-ups

- None.
