# Bug Fix: Language Selector Scrolls the Page

- **Slug**: language-selector-scroll
- **Fixed**: 2026-11-02
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Replaced the native language `<select>` with a button-triggered language popover to avoid browser-native popup scrolling. The new control remains keyboard-operable, closes on Escape or outside pointer input, and keeps language navigation and section-fragment preservation.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `app/components/LanguageSelector.tsx` | modified | Added an accessible popover with locale choices, outside-click dismissal, Escape handling, and focus restoration. |
| `app/components/SiteHeader.module.css` | modified | Styled the trigger and absolutely positioned options without affecting document layout. |
| `tests/e2e/language-preference.spec.ts` | modified | Added scroll-stability and keyboard open/close assertions; updated locale-switching interactions for the popover. |

## Diff Highlights

- The regression test opens the language control using a direct pointer click at a scrolled position, then verifies `scrollY` and the URL are unchanged.
- Escape closes the popover and returns focus to its trigger without scrolling.

## Tests Added or Updated

- `tests/e2e/language-preference.spec.ts` — opening the control does not scroll or navigate.
- `tests/e2e/language-preference.spec.ts` — the control opens with Enter and closes with Escape while restoring focus.
- `tests/e2e/language-preference.spec.ts` — language changes still preserve the current section fragment.

## Local Verification

- Commands run: `npm test` → 14 passed.
- Commands run: `npm run lint` → passed.
- Commands run: `npm run typecheck` → passed.
- Commands run: `npm run test:e2e` → 32 passed across desktop and mobile Chromium.
- Commands run: `npm run build` → static build passed.
- Manual checks: Direct pointer interaction and keyboard open/close behavior were exercised in desktop and mobile Chromium. The reporting browser/device was not specified, so its native popup behavior was not manually verified.

## Deviations from Assessment

- The assessment recommended reproducing in the affected browser before choosing a fix. The user confirmed the scroll happens when opening the menu and chose to proceed without specifying browser/device. A custom popover was used as the assessment's stated alternative to avoid native select popup behavior. The affected browser remains unverified.

## Follow-ups

- Verify the popover on the browser and device where the issue was reported when those details are available.
