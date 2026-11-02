# Browser URL Contract: Section Fragments

## Scope

This contract describes the public URL and navigation behavior for the
localized single-page portfolio. It does not add routes or change section
content.

## Section identifiers

| Section | Fragment |
|---|---|
| Hero | `#hero` |
| Services | `#services` |
| Projects | `#projects` |
| Contact | `#contact` |

The existing localized page paths remain `/en` and `/pt-BR`.

## Required behavior

1. A valid fragment opened directly continues to reach its section.
2. Existing section links continue to navigate to their matching fragments.
3. During scrolling, the active section is the one with the greatest visible
   area in the viewport. The URL fragment is synchronized when the active
   section changes.
4. Scroll-driven synchronization replaces the current history entry; it does
   not append an entry. Scrolling alone therefore does not add browser Back
   steps.
5. If no section is visible, the current fragment is retained.
6. If the greatest visible area is tied, the current section wins when tied;
   otherwise, the tied section nearest the top of the viewport wins.
7. Language selection continues to navigate to the selected locale and preserve
   the equivalent section fragment when available. Existing fallback behavior
   remains in effect when a counterpart is unavailable.
8. An unknown fragment does not prevent the page or locale from loading.

## Observable outcomes

- The browser address displays the fragment of the active section after scroll
  synchronization.
- Scrolling across multiple sections does not increase browser history length.
- Activating a section link and changing locale retain their established
  navigation behavior.
