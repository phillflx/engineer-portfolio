# Bug Assessment: Language Selector Scrolls the Page

- **Slug**: language-selector-scroll
- **Created**: 2026-11-02
- **Source**: pasted text
- **Verdict**: likely valid, needs reproduction
- **Severity**: low

## Report (verbatim or summarized)

> clicking the language selector to show available languages is scrolling the page up

## Symptom

When a visitor opens the language selector, the document reportedly scrolls upward before a language is selected. Opening the choices should leave the visitor at the current page position; changing language may navigate while preserving the current section.

## Reproduction

1. Open `/en` or `/pt-BR`.
2. Scroll down until the sticky header is at the top of the viewport.
3. Click the language selector to open its available choices without selecting one.
4. Observe whether the document scroll position changes.

[NEEDS CLARIFICATION: Browser, operating system, device/input method, and the page position where this occurs.]

## Suspected Code Paths

- `app/components/LanguageSelector.tsx` — renders a native `<select>`; the route change is attached to `onChange`, so opening the control alone should not call `router.push`.
- `app/components/SiteHeader.module.css` — the selector is inside a sticky header and uses native select styling; the header/selector positioning may interact with browser popup and focus behavior.
- `tests/e2e/language-preference.spec.ts` — currently verifies language changes and section preservation using `selectOption`, but does not check scroll position when opening the control without changing its value.

## Root Cause Hypothesis

The selector is a native HTML `<select>` inside a sticky header. Some browser/platform combinations may scroll the document while focusing or opening its native options popup. The component only navigates from its `onChange` handler, making route navigation on open less likely. This is a plausible hypothesis, not confirmed without the affected browser/device details. **Confidence: low.**

## Proposed Remediation

**Preferred**: Reproduce on the affected browser and input method while monitoring scroll position, focus, URL, and `onChange`. If opening the native control causes the scroll, adjust the selector/header interaction so opening the choices does not reposition the document. Preserve native keyboard operation and the existing behavior that retains the section when a language is selected.

If native popup behavior cannot be reliably controlled, consider an accessible custom popover/listbox that does not alter document scroll, but only after validating keyboard, screen-reader, and mobile behavior.

**Files likely to change**:
- `app/components/LanguageSelector.tsx`
- `app/components/SiteHeader.module.css`
- `tests/e2e/language-preference.spec.ts`

**Tests to add or update**:
- At a nonzero scroll position, open/focus the language control without changing its value and assert that the URL and document scroll position remain unchanged.
- Verify that choosing the other locale still changes the route and preserves the current section.
- Manually verify the native popup or replacement interaction in the affected browser/device, since automated `selectOption` does not exercise every native popup behavior.

## Risks & Considerations

- Replacing a native select with a custom control can regress keyboard navigation, screen-reader announcements, or mobile usability.
- Browser-native select popups are not fully controllable by page CSS; any fix should be verified in the specific environment where the issue occurs.
- Do not remove sticky-header behavior or fragment-preserving language navigation as a workaround.

## Open Questions

- [NEEDS CLARIFICATION: Which browser, operating system, and device/input method reproduce the scroll?]
- [NEEDS CLARIFICATION: Does the page move as soon as the selector opens, or only after a language option is chosen?]
