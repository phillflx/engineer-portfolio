# Implementation Plan: Multilanguage Portfolio Support

**Branch**: `002-multilanguage-support` | **Date**: 2026-11-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-multilanguage-support/spec.md`

## Summary

Add English and Brazilian Portuguese versions of the existing portfolio at `/en`
and `/pt-BR`, with a browser-preference chooser at `/`, a language selector that
preserves the current section, and localized SEO and social metadata. Keep Next.js
static export and use one shared optional-locale root layout for all three paths;
store complete, validated portfolio content in locale-specific JSON files. No i18n
dependency or request-time server behavior is needed.

## Technical Context

**Language/Version**: TypeScript; use the Node.js version supported by the configured Next.js release.

**Primary Dependencies**: Existing Next.js App Router and React dependencies; no i18n library is justified for two static locales and one page.

**Storage**: Two public, version-controlled JSON portfolio documents under `app/data/`, validated at build time; no database or runtime persistence.

**Testing**: Existing Vitest and Playwright suites, plus `npm run typecheck`, `npm run lint`, and `npm run build`.

**Target Platform**: Static hosting over HTTPS; current desktop and mobile browsers.

**Project Type**: Single-page static web application.

**Performance Goals**: Locale content and metadata are present in generated HTML; language choice at `/` adds no third-party runtime dependency or request-time service.

**Constraints**: Preserve `output: "export"`; do not use request headers, Proxy, middleware, or server redirects. Generate only `/`, `/en`, and `/pt-BR`. A client-side chooser at `/` reads the browser's primary language, while explicit locale paths always render their named language. Unsupported paths are handled by an English-language static 404 document.

**Scale/Scope**: One portfolio page, two fully translated locales, one locale selector, and localized metadata; no translated detail routes or additional locales.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / requirement | Assessment |
|---|---|
| Static Delivery | Pass. Build-time locale routes and a browser-only root chooser preserve static hosting; request-time language negotiation is excluded. |
| Accessible, Responsive UX | Pass. The selector uses a keyboard-operable control, translated content retains existing semantic/responsive behavior, and language changes keep section anchors where possible. |
| Security and Privacy | Pass. Locale selection reads browser language only; no personal data, secrets, or preference storage is introduced. |
| Verified Behavior | Pass. Add targeted content validation and browser scenarios for locale selection, switching, direct URLs, metadata, fallback, and responsive behavior. |
| Simplicity and Maintainability | Pass. Reuse the current page components and validation; no external i18n package or per-language component tree is needed. |
| Search Engine Optimization | Pass. Generate localized document language, titles, descriptions, canonical and alternate-language links, Open Graph/Twitter metadata, and sitemap entries in static output. |
| Static Webapp Requirements | Pass. The supported pages and recovery document are generated static assets. |
| Delivery and Quality | Pass. Build and inspect all locale artifacts; retain HTTPS-only deployment and existing accessibility checks. |

No constitution violations or exceptions are required. The root chooser uses browser
JavaScript because request-header negotiation is incompatible with static export.

## Project Structure

### Documentation (this feature)

```text
specs/002-multilanguage-support/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── [[...locale]]/
│   ├── layout.tsx       # One root layout; sets html lang for explicit locales
│   └── page.tsx         # Root chooser and localized portfolio routes
├── components/
│   ├── LanguageSelector.tsx
│   ├── LocaleChooser.tsx
│   └── existing portfolio components
├── data/
│   ├── portfolio.en.json
│   └── portfolio.pt-BR.json
├── lib/
│   ├── portfolio.ts     # Existing content validation, extended for locales
│   └── locales.ts       # Supported locale definitions and lookup
├── global-not-found.tsx # English recovery UI for unknown paths
├── globals.css
├── robots.ts
└── sitemap.ts
tests/
├── content/
└── e2e/
next.config.ts          # Enable the global 404 convention
```

**Structure Decision**: Use one optional catch-all route segment (`[[...locale]]`)
for the root chooser and both locale URLs. Its single shared root layout receives
the route parameters, sets the correct `html lang` for `/en` and `/pt-BR`, and
avoids separate layouts or duplicated page trees for each language. Generate only
the empty root path and the two supported locale values at build time. The root
page is a small client-assisted chooser that checks `navigator.languages[0]`
(falling back to `navigator.language`) and navigates to `/pt-BR` when it starts
with `pt`, otherwise `/en`; it also includes ordinary links for users without
JavaScript. Locale-specific pages use the same existing portfolio components and
validated JSON shape. Enable Next.js's `globalNotFound` option for the English
recovery page because the root layout contains an optional dynamic segment; the
404 document provides a link to `/en`. No external interface contracts are
introduced.

## Complexity Tracking

No constitution violations.
