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

**Decision**: Keep portfolio content in local JSON and read it during static
generation. Define page metadata statically or derive it from that build-time content.
Use a fixed social-preview image when supplied.

**Rationale**: The static export guide explains that build-time rendering produces
static output. Next.js metadata exports are server-side and are included in generated
HTML, which supports the SEO and sharing requirements without client-side metadata
updates. A fixed Open Graph image uses the documented metadata file convention and
does not require request-time generation.

**Alternatives considered**:

- Client-side JSON loading would require successful browser-side execution before the
  content is rendered.
- Request-dependent metadata or images are incompatible with a self-contained static
  export; a new build is the intended publishing path when portfolio data changes.
- A generated image is possible, but is unnecessary unless the supplied fixed image
  cannot meet the design needs.

**Sources**:

- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js opengraph-image convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
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

## Resolved technical unknowns

- **Static deployment model**: Next.js static export; no server or database.
- **Content source and timing**: Local JSON rendered at build time.
- **Metadata generation**: Static metadata rendered into the exported HTML.
- **Carousel motion**: Manual controls without auto-rotation; honor reduced-motion.
- **External interface contracts**: None. The site has no API or external system
  integration in the specified scope.
