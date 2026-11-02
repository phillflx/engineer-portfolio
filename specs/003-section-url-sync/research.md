# Research: Section URL Synchronization

## Decision 1: Determine the active section from viewport geometry

- **Decision**: Compare the visible viewport-intersecting area of the four
  existing portfolio sections (`hero`, `services`, `projects`, and `contact`).
  Re-evaluate on scroll and viewport resize, coalescing repeated scroll events to
  no more than one measurement per animation frame.
- **Rationale**: The specification defines activity by greatest visible area,
  including sections of different heights. Comparing their current visible
  geometry directly implements that rule and adapts to responsive and translated
  content.
- **Alternatives considered**:
  - Treating the first section to cross a viewport boundary as active: simpler,
    but does not select the section with the greatest visible area.
  - Relying only on intersection ratio: a ratio is a proportion of the section,
    not its absolute visible area, so it can choose a smaller visible region.

## Decision 2: Replace the current history entry for scroll-driven changes

- **Decision**: Change only the current URL entry when scrolling activates a
  different section; do not create an entry for every section crossed.
- **Rationale**: This satisfies the no-new-history-entry requirement while
  keeping the shareable fragment current. Next.js 16's App Router documentation
  states that native `window.history.replaceState` integrates with its router.
- **Alternatives considered**:
  - Add a history entry for each active section: rejected because scrolling
    would pollute browser history and violate the requirement.
  - Leave the fragment unchanged during scrolling: rejected because it would no
    longer identify the active section.

## Decision 3: Preserve user-initiated section and locale navigation

- **Decision**: Keep the current semantic anchor links and locale selector
  navigation intact. Scroll tracking only synchronizes the URL for
  scroll-determined active-section changes; it does not replace link activation
  or locale routing.
- **Rationale**: The page already exposes `#hero`, `#services`, `#projects`, and
  `#contact`, and the language selector carries the current hash to the target
  locale. Separating automatic synchronization from explicit navigation
  minimizes behavior changes.
- **Alternatives considered**:
  - Route all navigation through the tracker: rejected because it would
    unnecessarily replace native anchor behavior and risk changing history,
    keyboard, or direct-link semantics.
  - Change locale navigation to a fragment-only URL update: rejected because it
    would fail to select the requested locale.

## Project Evidence

- `next.config.ts` configures static export with `output: "export"`.
- `app/[[...locale]]/page.tsx` renders the localized portfolio and existing
  section components.
- `app/components/HeroCard.tsx`, `ServicesSection.tsx`,
  `ProjectsSection.tsx`, and `SiteFooter.tsx` provide the four section IDs.
- `app/components/LanguageSelector.tsx` changes locale while carrying the
  current URL fragment.
- Existing Playwright coverage in `tests/e2e/portfolio-home.spec.ts` and
  `tests/e2e/language-preference.spec.ts` verifies the navigation behaviors to
  preserve.
- The installed Next.js guide at
  `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
  documents that native `window.history.replaceState` updates the current
  history entry and integrates with the App Router.
