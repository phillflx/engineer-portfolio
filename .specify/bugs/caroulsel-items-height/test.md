# Bug Verification: Carousel Items Have Different Heights

- **Slug**: caroulsel-items-height
- **Tested**: 2026-11-02
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

Service and project cards render at equal heights within each carousel for both English and Brazilian Portuguese at 320px and 1440px widths. The existing carousel browsing controls pass in desktop and mobile Chromium.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Browser assertions comparing each card's rendered height across `/en` and `/pt-BR`, at 320px and 1440px | pass | Height variance per carousel is at most 1 CSS pixel. |
| New / updated tests | `npx playwright test tests/e2e/services-carousel.spec.ts tests/e2e/projects-carousel.spec.ts` | pass | 8 passed across desktop and mobile Chromium. |
| Regression suite | `npm test` | pass | 14 tests passed. |
| Lint / type-check | `npm run lint`; `npm run typecheck` | pass | Both commands passed. |

## Output Excerpts

```text
8 passed (6.3s)
Test Files  2 passed (2)
Tests       14 passed (14)
```

## Residual Risks

- Verification covers Chromium desktop/mobile configurations at the specified 320px and 1440px widths; other browser engines were not tested.
- Equalizing cards to the tallest content in each carousel can increase the overall carousel row height, as requested.

## Recommendation

Close the bug — equal card heights are verified in both carousels, both locales, and narrow/wide viewport sizes, with existing carousel controls intact.
