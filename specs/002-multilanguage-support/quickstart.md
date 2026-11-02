# Quickstart: Multilanguage Portfolio Support

This guide validates the static English and Brazilian Portuguese portfolio routes.

## Prerequisites

- Node.js version supported by the configured Next.js release.
- npm dependencies installed from `package-lock.json`.
- Chromium installed for Playwright using `npx playwright install chromium`.
- Both `app/data/portfolio.en.json` and `app/data/portfolio.pt-BR.json` populated
  with the required fields in [data-model.md](data-model.md).

## Run locally

1. Install dependencies with `npm ci`.
2. Start the development server with `npm run dev`.
3. Open `/` in browser contexts configured with primary languages `pt-BR` and `en`;
   verify each navigates to the matching locale and that direct links remain
   available.
4. Open `/en` and `/pt-BR` under both browser-language preferences; each explicit
   locale URL must render the URL's language.
5. Switch languages from the header while positioned at Services, Projects, and
   Contact; verify the equivalent section remains targeted.
6. Confirm every visible string, accessible label, and contact-channel label is in
   the selected language, with contact values and hrefs unchanged.
7. Open an unsupported locale path and verify the host's static 404 shows the
   English recovery content and a working `/en` link.

## Run automated checks

1. Run `npm test` for both-locale content validation.
2. Run `npm run test:e2e` for default selection, explicit routes, language
   switching, section preservation, fallback, and responsive behavior.
3. Run `npm run typecheck` and `npm run lint`.
4. Run `npm run build` and inspect `out/` to verify static files exist for `/`,
   `/en`, and `/pt-BR`, along with the English 404 document.
5. Inspect each locale's generated HTML for the correct `lang`, localized title
   and description, canonical URL, reciprocal alternate-language links, Open
   Graph, and Twitter/X metadata. Confirm the page content is present without
   client-side JSON requests.

## Expected outcome

The static build emits a language-selection entry, two complete locale pages, and
an English-language recovery page for unsupported paths. Both locale pages retain
the existing portfolio interactions, accessible responsive behavior, and accurate
localized SEO/share metadata.
