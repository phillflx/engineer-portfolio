# Quickstart: Section URL Synchronization

## Prerequisites

- Node.js and the project dependencies are installed.
- Run commands from the repository root.

## Automated validation

Run the focused browser tests (the Playwright configuration starts the
development server when needed):

```powershell
npm run test:e2e -- tests/e2e/section-url-sync.spec.ts
```

The focused checks should verify:

- The URL fragment follows the section with the greatest visible area while
  scrolling in both `/en` and `/pt-BR`.
- Scroll-driven section changes do not increase browser history length.
- Equal-area sections follow the defined tie rule and no-visible-section areas
  retain the current fragment.
- Existing section links and direct section fragments still reach their
  destinations.
- Language changes preserve the selected language and corresponding section.

Run the repository checks after focused browser validation:

```powershell
npm run typecheck
npm run lint
npm test
```

## Manual browser validation

1. Open `/en` and note the current browser history length.
2. Scroll slowly through hero, services, projects, and contact. At each stable
   position, compare the section portions visible in the viewport; the fragment
   should identify the section with the greatest visible area.
3. Scroll across several sections and verify the history length has not
   increased because of scrolling.
4. Use the header links and open a valid fragment URL directly; confirm the
   matching section remains reachable.
5. Switch language while positioned at a section; confirm the target locale and
   equivalent section are retained.
6. Repeat at a narrow viewport and on `/pt-BR`.

See [the browser URL contract](contracts/section-fragment.md) for section IDs
and expected navigation semantics, and [the data model](data-model.md) for
active-section selection rules.
