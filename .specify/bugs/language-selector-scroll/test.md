# Bug Verification: Language Selector Scrolls the Page

- **Slug**: language-selector-scroll
- **Tested**: 2026-11-02
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The reported scroll-on-open behavior no longer reproduces in desktop or mobile Chromium: opening the replacement language popover at a nonzero scroll position leaves the scroll position and URL unchanged. Keyboard opening/closing and locale switching with section preservation also pass.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Automated equivalent: open the language popover at `scrollY = 1500` using a pointer click | pass | Scroll position and URL remain unchanged in desktop and mobile Chromium. |
| New / updated tests | `npx playwright test tests/e2e/language-preference.spec.ts` | pass | 12 passed across desktop and mobile Chromium; includes keyboard open/close and locale switching. |
| Regression suite | `npm test` | pass | 14 tests passed. |
| Lint / type-check | `npm run lint`; `npm run typecheck` | pass | Both commands passed. |
| Diff integrity | `git diff --check` | pass | No whitespace errors. |

## Output Excerpts

```text
12 passed (7.5s)
Test Files  2 passed (2)
Tests       14 passed (14)
```

The regression test was observed failing with the native selector before the fix, where opening it moved scroll from 1539 to 799 in desktop Chromium and from 1275 to 409 in mobile Chromium.

## Residual Risks

- Verification covers desktop and mobile Chromium, not the originally reported browser/device, which remains unspecified.
- A custom popover cannot exactly replicate every platform's native select behavior; its keyboard interaction and section-preserving navigation are covered by automated tests.

## Recommendation

Close the bug — the reported open-menu scroll was reproduced in Chromium before the fix and no longer reproduces with the popover in desktop or mobile Chromium. Verify on the originally reported browser/device if its details become available.
