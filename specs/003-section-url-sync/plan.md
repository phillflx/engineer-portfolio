# Implementation Plan: Section URL Synchronization

**Branch**: `section-fragment-tracker-002` | **Date**: 2026-11-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-section-url-sync/spec.md`

## Summary

Keep the URL fragment aligned with the portfolio section occupying the greatest
visible area as a visitor scrolls. A small client-side tracker will measure the
visible viewport area of the existing `#hero`, `#services`, `#projects`, and
`#contact` sections, retain the current section for equal-area ties, and replace
the current URL entry when the active section changes. Existing anchor links and
the language selector's locale navigation remain responsible for user-initiated
navigation and locale changes.

## Technical Context

**Language/Version**: TypeScript 6.0; browser code targets ES2017

**Primary Dependencies**: Next.js 16.4.4, React 19.3.1; no new dependencies

**Storage**: None; active section is derived from the current rendered page and
viewport

**Testing**: Playwright end-to-end tests for browser-visible behavior; existing
Vitest, ESLint, and TypeScript checks

**Target Platform**: Static-exported web application, modern desktop and mobile
browsers

**Project Type**: Static Next.js App Router web application

**Performance Goals**: URL state follows section changes during scrolling without
noticeable lag; viewport measurements are limited to the four portfolio sections
and performed at most once per animation frame

**Constraints**: Scroll-driven fragment updates must replace rather than append
history entries. Preserve existing anchor destinations, direct fragment loading,
locale routes, and language-switch section retention. No server runtime or
additional dependency.

**Scale/Scope**: One portfolio page with four existing sections and two locale
routes (`/en` and `/pt-BR`); no new content, routes, or persistent data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Static Delivery**: Pass. The behavior runs in the browser and does not
  introduce a server requirement; the application remains a static export.
- **Accessible, Responsive UX**: Pass. Existing semantic sections and native
  navigation links remain in place. The active section is derived from the
  viewport at the current responsive size.
- **Security and Privacy**: Pass. No user data, secrets, or external services
  are involved.
- **Verified Behavior**: Pass. Browser-level tests will cover scrolling,
  history, direct links, section navigation, and language switching.
- **Simplicity and Maintainability**: Pass. The design adds no dependency and
  confines tracking to the existing single page.
- **Search Engine Optimization (SEO)**: Pass. Crawlable links, locale routes,
  canonical URLs, and page metadata remain unchanged; URL fragments do not
  create additional indexed pages.

**Gate result**: Pass; no exceptions or complexity justification required.

## Project Structure

### Documentation (this feature)

```text
specs/003-section-url-sync/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── section-fragment.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── [[...locale]]/
│   └── page.tsx                 # Renders localized portfolio sections
├── components/
│   ├── HeroCard.tsx             # Existing #hero section
│   ├── ServicesSection.tsx      # Existing #services section
│   ├── ProjectsSection.tsx      # Existing #projects section
│   ├── SiteFooter.tsx           # Existing #contact section
│   ├── SiteHeader.tsx           # Existing anchor and locale navigation
│   └── SectionUrlTracker.tsx    # Client-side active-section URL synchronization
└── lib/
    └── locales.ts               # Existing supported locale definitions

tests/
└── e2e/
    ├── section-url-sync.spec.ts # Scroll, fragment, and history behavior
    ├── portfolio-home.spec.ts   # Existing anchor navigation regression coverage
    └── language-preference.spec.ts # Existing locale/section retention coverage
```

**Structure Decision**: Keep the behavior in the existing App Router portfolio
page and its four section anchors. Add a narrowly scoped `SectionUrlTracker`
client component to the localized page; leave the header links, section
components, locale selector, and static route structure intact. Add a focused
Playwright spec alongside existing end-to-end coverage.

## Constitution Check (Post-Design)

- **Static Delivery**: Pass; browser-only viewport tracking is compatible with
  `output: "export"`.
- **Accessible, Responsive UX**: Pass; semantic section targets and their
  accessible anchor controls are preserved, with viewport geometry re-evaluated
  when the viewport changes.
- **Security and Privacy**: Pass; no collection or transmission of visitor data.
- **Verified Behavior**: Pass; the quickstart and focused end-to-end scenarios
  verify the requirements and regression-sensitive behavior.
- **Simplicity and Maintainability**: Pass; no new dependency, service, route,
  or content model is needed.
- **Search Engine Optimization (SEO)**: Pass; existing crawlable navigation and
  metadata remain unchanged.

**Post-design gate result**: Pass; no constitution violations.
