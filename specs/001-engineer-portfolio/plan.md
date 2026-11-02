# Implementation Plan: Software Engineer Portfolio Homepage

**Branch**: `001-engineer-portfolio` | **Date**: 2026-11-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-engineer-portfolio/spec.md`

## Summary

Build a single-page software engineer portfolio with a dark cyberpunk visual style,
sticky section navigation, an introductory hero, services and project carousels, and
contact information. Use Next.js App Router with static export. Store portfolio content
in local JSON and render it into the generated HTML at build time so essential content
and metadata are present without client-side data fetching. No database or runtime
application server is required.

## Technical Context

**Language/Version**: TypeScript; use a Node.js version supported by the configured
Next.js release.

**Primary Dependencies**: Next.js App Router and React; no carousel dependency is
required unless implementation demonstrates a concrete need.

**Storage**: Local JSON files committed with the site and read at build time; no
database.

**Testing**: `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`, and
`npm run build` validate content, interactions, accessibility, metadata, and static
export behavior.

**Target Platform**: Static hosting over HTTPS; current desktop and mobile browsers.

**Project Type**: Single-page static web application.

**Performance Goals**: Render primary content and metadata in the generated HTML;
avoid requiring client-side data requests for portfolio content. Preserve responsive
interaction without unnecessary motion or dependencies.

**Constraints**: Next.js static export only; no request-time server features, database,
or secret data in public assets. Portfolio data is public content in JSON. Carousels
are manually controlled, keyboard and touch accessible, and respect reduced-motion
preferences.

**Scale/Scope**: One public homepage with hero, services carousel, projects carousel,
and contact footer; no authentication or content-management service.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / requirement | Assessment |
|---|---|
| Static Delivery | Pass. Next.js static export generates deployable assets; no runtime app server is needed. |
| Accessible, Responsive UX | Pass. Semantic sections, keyboard/touch carousel controls, responsive layouts, and reduced-motion behavior are in scope. |
| Security and Privacy | Pass. No database or secret-bearing client configuration is planned; contact information is explicitly public content. |
| Verified Behavior | Pass. Build/export and relevant content, interaction, accessibility, and metadata checks are planned. |
| Simplicity and Maintainability | Pass. One app and local JSON avoid unnecessary infrastructure; no carousel package is presumed. |
| Search Engine Optimization | Pass. Static HTML, semantic structure, descriptive metadata, canonical URL, and Open Graph plus Twitter/X sharing metadata are in scope. |
| Static Webapp Requirements | Pass. All required functionality is delivered as static assets. |
| Delivery and Quality | Pass. Validate build output, usability, and metadata before static deployment over HTTPS. |

No constitution violations or exceptions are required.

## Project Structure

### Documentation (this feature)

```text
specs/001-engineer-portfolio/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── spec.md
```

No `contracts/` directory is needed: the feature exposes no API or external system
interface. The JSON content shape is documented in `data-model.md`.

### Source Code (repository root)

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── components/
│   ├── SiteHeader.tsx
│   ├── HeroCard.tsx
│   ├── ContentCarousel.tsx
│   ├── ServicesSection.tsx
│   ├── ProjectsSection.tsx
│   └── SiteFooter.tsx
├── data/
│   └── portfolio.json
├── lib/
│   └── portfolio.ts
└── public/
    └── images/
        ├── social-preview.png
        └── social-preview.svg
tests/
├── content/
└── e2e/
next.config.ts
package.json
```

**Structure Decision**: Keep application code, local JSON, validation helpers, and
image source files under `app/`. Import the social preview image as a static asset so
the production build emits it with the other static files without adding a route or
moving assets back to the repository root. Keep tests and project configuration at
the repository root.
