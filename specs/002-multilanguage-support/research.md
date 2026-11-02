# Research: Multilanguage Portfolio Support

**Date**: 2026-11-02

## Static locale routing and shared layout

**Decision**: Keep Next.js static export and generate the root path plus the two
locale-prefixed paths from one optional catch-all route segment. Use a single root
layout that receives the optional locale and sets the document language for
`/en` and `/pt-BR`.

**Rationale**: Next.js supports optional catch-all dynamic segments and build-time
route generation with `generateStaticParams`. A shared layout avoids duplicating
the portfolio shell for each language. The root route remains available as a
language-selection entry point.

**Alternatives considered**:

- Separate `/en` and `/pt-BR` page/layout trees duplicate shared UI and metadata
  logic.
- Request-time locale routing through Proxy, request headers, or server redirects
  is incompatible with the project's `output: "export"` deployment.

**Sources**:

- [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)
- [Next.js Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)

## Default browser-language selection

**Decision**: At `/` only, a small client component reads the browser's primary
preferred language and navigates to `/pt-BR` for a language tag beginning with
`pt`, otherwise to `/en`. Keep visible direct links as a no-JavaScript fallback.
Do not persist a separate locale preference; the explicit URL is the selection.

**Rationale**: Static export cannot read the incoming `Accept-Language` header.
Next.js documents using browser APIs only in the browser, which allows locale
selection without adding a server or third-party dependency. Explicit locale URLs
are already unambiguous and therefore do not run the chooser.

**Alternatives considered**:

- Request-header negotiation and server redirects would require a runtime server
  or hosting-specific behavior.
- A general locale-matching library is unnecessary when the only choice is whether
  the primary language tag begins with `pt`.

**Sources**:

- [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)
- [Next.js Static Exports: Browser APIs and unsupported features](https://nextjs.org/docs/app/guides/static-exports)

## Translation content and validation

**Decision**: Keep complete, same-shape portfolio JSON for English and Brazilian
Portuguese at `app/data/portfolio.en.json` and
`app/data/portfolio.pt-BR.json`. Reuse and extend the current portfolio validator
to validate both datasets and reject missing localized visitor-facing strings.

**Rationale**: The repository already renders and validates local JSON at build
time. Locale-specific JSON keeps all user-facing copy explicit, makes untranslated
content reviewable, and avoids silent English fallbacks in the Portuguese version.
Server-side page rendering keeps data in generated HTML rather than requiring
client-side requests.

**Alternatives considered**:

- A runtime translation service or client-side fetching adds external dependencies
  and is not appropriate for fixed public portfolio copy.
- A general-purpose i18n library is not justified for two locales, one page, and no
  stated pluralization or interpolation needs.

**Sources**:

- [Next.js Internationalization: dictionaries](https://nextjs.org/docs/app/guides/internationalization)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)

## Localized SEO, sharing, and unsupported paths

**Decision**: Generate metadata for each locale from its own validated JSON,
including canonical URL, reciprocal `en`/`pt-BR` alternates, localized Open Graph
and Twitter/X titles/descriptions, and sitemap entries. Render an English recovery
experience in the static 404 document for paths that are not among the generated
locale routes. Use Next.js's global 404 convention because the shared root layout
is defined under an optional dynamic segment.

**Rationale**: Build-time metadata is included in the exported HTML and can remain
accurate for both language URLs. Static export only serves paths generated at
build time; an English recovery page is a host-agnostic static fallback and does
not pretend to redirect or return a successful language route. The global 404
convention supports applications whose root layout has a top-level dynamic
segment; it requires enabling the corresponding Next.js configuration option.

**Alternatives considered**:

- Client-side metadata updates are too late for crawlers and social preview bots.
- Host-specific rewrites or redirects for unsupported locales require a hosting
  provider decision and configuration that is outside this feature.

**Sources**:

- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js not-found conventions](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)

## Resolved technical unknowns

- Static deployment remains enabled; locale paths are enumerated during the build.
- Only the root chooser reads browser language; explicit locale URLs always win.
- A single shared layout and existing page components serve both languages.
- Locale content stays in validated local JSON; no i18n package is needed.
- Unknown locale paths display the static English recovery page and retain 404
  semantics; no runtime redirect is required.
- Next.js global 404 support is enabled to provide the recovery UI independently
  from the top-level optional locale segment.
- No external interface contracts are needed.
