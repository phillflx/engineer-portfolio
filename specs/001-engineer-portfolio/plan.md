# Implementation Plan: Software Engineer Portfolio Homepage

**Branch**: `001-engineer-portfolio` | **Date**: 2026-11-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-engineer-portfolio/spec.md`

## Summary

Build a single-page software engineer portfolio with a dark cyberpunk visual style,
sticky section navigation, an introductory hero, services and project carousels,
contact information, and scroll-aware URL fragments. Use Next.js App Router with
static export and localized `/en` and `/pt-BR` pages. Store portfolio content in local
JSON and render it into generated HTML at build time so essential content and metadata
are present without client-side data fetching. A small client-side tracker will set the
fragment to the section with the greatest visible area and replace the current history
entry for scroll-driven changes. No database or runtime application server is required.

## Technical Context

**Language/Version**: TypeScript 6; Node.js version supported by Next.js 16.4.4.

**Primary Dependencies**: Next.js 16.4.4 App Router and React 19; no carousel
dependency is required.

**Storage**: Local English and Brazilian Portuguese JSON files committed with the site
and read at build time; no database.

**Testing**: `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`, and
`npm run build` validate content, interactions (including fragment updates and browser
history), accessibility, metadata, and static export behavior.

**Target Platform**: Static hosting over HTTPS; current desktop and mobile browsers.

**Project Type**: Single-page static web application.

**Performance Goals**: Render primary content and metadata in the generated HTML;
avoid requiring client-side data requests for portfolio content. Preserve responsive
interaction without unnecessary motion or dependencies.

**Constraints**: Next.js static export only; no request-time server features, database,
or secret data in public assets. Portfolio data is public content in JSON. Carousels
are manually controlled, keyboard and touch accessible, and respect reduced-motion
preferences.

**Scale/Scope**: One public homepage with localized static routes, hero, services
carousel, projects carousel, contact footer, and four anchored sections; no
authentication or content-management service.

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
├── globals.css
├── [[...locale]]/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SiteHeader.tsx
│   ├── HeroCard.tsx
│   ├── ContentCarousel.tsx
│   ├── ServicesSection.tsx
│   ├── ProjectsSection.tsx
│   ├── SiteFooter.tsx
│   ├── LanguageSelector.tsx
│   ├── LocaleChooser.tsx
│   └── SectionFragmentTracker.tsx
├── data/
│   ├── portfolio.en.json
│   └── portfolio.pt-BR.json
├── lib/
│   ├── locales.ts
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

**Structure Decision**: Keep the shared localized page and layout in the optional
locale route, reusable components and local content under `app/`, and tests and
configuration at the repository root. The URL-fragment tracker belongs with the
client-side page components and observes the existing stable section IDs (`hero`,
`services`, `projects`, and `contact`). Import the social preview image as a static
asset so the production build emits it with the other static files.
