# Data Model: Section URL Synchronization

This feature introduces no persisted data. Its state is derived from the
rendered page, viewport geometry, and current URL.

## Page Section

Represents one existing navigable portion of the localized portfolio.

| Field | Description | Validation |
|---|---|---|
| `id` | Stable fragment identifier for the section | Must be one of `hero`, `services`, `projects`, or `contact` |
| `visibleArea` | Area of the section intersecting the current viewport | Non-negative; zero when outside the viewport |
| `viewportTop` | Top coordinate of the visible section portion | Used to consistently resolve a tie when the current section is not tied |

### State and selection rules

- The active section is the section with the greatest positive `visibleArea`.
- If no section has positive visible area, retain the current fragment.
- On an equal greatest-area tie, retain the current section if it is tied.
- Otherwise, select the tied section whose visible portion is nearest the top of
  the viewport.

## Section Fragment

Represents the fragment portion of the current localized page URL.

| Field | Description | Validation |
|---|---|---|
| `value` | The fragment identifying the active or explicitly requested section | Valid scroll-tracked values match an existing section `id`; unknown direct fragments do not block page loading |
| `source` | Whether the URL change resulted from scrolling, explicit section navigation, direct loading, or locale switching | Scroll-derived changes replace the current entry; other sources preserve existing behavior |

## Language Version

Represents the currently selected portfolio locale.

| Field | Description | Validation |
|---|---|---|
| `locale` | Language route segment | One of the existing supported locales: `en` or `pt-BR` |
| `sectionFragment` | Section fragment carried across locale navigation when available | Preserve current language-switch behavior and its fallback for a missing counterpart |

## Relationships

- Each `Language Version` renders the same set of navigable `Page Section`
  identifiers.
- The current `Section Fragment` identifies a `Page Section` within the
  selected `Language Version` when the fragment is valid.
- The active section is derived from visible geometry; it is not separately
  persisted.
