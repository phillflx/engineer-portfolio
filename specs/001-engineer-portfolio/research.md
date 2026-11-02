# Research: Software Engineer Portfolio Homepage

**Date**: 2026-11-02

## Next.js static export

**Decision**: Configure the Next.js application for static export and deploy the
generated static assets to an HTTPS static host.

**Rationale**: The portfolio is a single public page with stable content and needs no
request-time server behavior or database. Next.js documents `output: 'export'` as
generating static HTML and assets suitable for static hosting. Server Components run
at build time, making local JSON content suitable for inclusion in the generated page.
Changes to that content require a new build and deployment.

**Alternatives considered**:

- A running Next.js server would support request-time features but is unnecessary for
  the stated scope and conflicts with static delivery.
- A separately served JSON file fetched by the browser is possible, but moves
  rendering to the client and can delay content availability; prefer build-time
  rendering for this small, stable portfolio.

**Sources**:

- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js public folder](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)

## JSON content and metadata

**Decision**: Keep English and Brazilian Portuguese portfolio content in
`app/data/portfolio.en.json` and `app/data/portfolio.pt-BR.json` and read it during
static generation. Define localized page metadata from that build-time content. Keep
the social-preview source in `app/public/images/` and import it as a static asset so
the exported pages can reference the generated image without adding an application
route.

**Rationale**: The static export guide explains that build-time rendering produces
static output. The App Router metadata export is included in generated HTML, which
supports the SEO and sharing requirements without client-side metadata updates. A
fixed Open Graph image can be imported as a static asset and does not require
request-time generation.

**Alternatives considered**:

- Client-side JSON loading would require successful browser-side execution before the
  content is rendered.
- Request-dependent metadata or images are incompatible with a self-contained static
  export; a new build is the intended publishing path when portfolio data changes.
- A generated image is possible, but is unnecessary because the site already has a
  supplied preview image.

**Sources**:

- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)

## Accessible carousel interaction

**Decision**: Keep both carousels manually controlled; use labelled sections, semantic
lists, native previous/next buttons, visible position information, and keyboard and
touch operation. Avoid auto-rotation.

**Rationale**: The W3C WAI carousel guidance calls out discoverability and interaction
concerns. Manual controls avoid introducing auto-rotation pause/resume requirements
and allow visitors to inspect content at their own pace. The specification additionally
requires reduced-motion support and clear behavior at carousel boundaries.

**Alternatives considered**:

- An auto-rotating carousel can draw attention but requires additional pause, focus,
  hover, and restart behavior; it is not needed for this portfolio.
- A static grid avoids carousel interaction entirely, but the feature specification
  explicitly requests carousels, so the plan retains them.

**Sources**:

- [WAI Carousels Tutorial](https://www.w3.org/WAI/tutorials/carousels/)
- [WAI Carousel Structure](https://www.w3.org/WAI/tutorials/carousels/structure/)
- [WAI Carousel Functionality](https://www.w3.org/WAI/tutorials/carousels/functionality/)
- [ARIA Authoring Practices carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)

## Scroll-aware URL fragments

**Decision**: Track the viewport-visible area of the existing `intro`, `services`,
`projects`, and `contact` sections. The section with the greatest visible area is
current; if two sections have equal visible area, retain the previous current section
to avoid fragment flicker. Update the URL fragment with the native History API's
`replaceState` so scroll-driven changes do not create browser-history entries. Keep
existing anchor links as the navigation mechanism for explicit section selection.

**Rationale**: The specification defines the current section by visible area, so
comparing each section's visible rectangle against the viewport is more accurate than
choosing the largest intersection ratio, which can favor a shorter section. Replacing
the current history entry matches the clarified Back-button behavior. The application
is a static export, so this interaction can run entirely in the browser without a
server or external dependency. Next.js 16.4.4 documents native `pushState` and
`replaceState` as integrated with the App Router.

**Alternatives considered**:

- Choosing the section whose top edge reaches a fixed threshold is simpler but does
  not satisfy the clarified largest-visible-area rule.
- Adding a history entry for each section reached while scrolling would make the
  browser Back button replay incidental scroll changes.
- Choosing the greatest intersection ratio is not equivalent to greatest visible
  area when section heights differ.

**Sources**:

- Next.js 16.4.4 App Router documentation, `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md` (Native History API)
- [MDN: History.replaceState()](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)

## Resolved technical unknowns

- **Static deployment model**: Next.js static export; no server or database.
- **Content source and timing**: Local JSON rendered at build time.
- **Metadata generation**: Static metadata rendered into the exported HTML.
- **Carousel motion**: Manual controls without auto-rotation; honor reduced-motion.
- **Scroll section selection**: Greatest visible viewport area; retain the previous
  section for exact ties.
- **Scroll history behavior**: Replace the current history entry for fragment updates.
- **External interface contracts**: None. The site has no API or external system
  integration in the specified scope.
