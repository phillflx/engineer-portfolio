---
description: "Implementation tasks for Multilanguage Portfolio Support"
---

# Tasks: Multilanguage Portfolio Support

**Input**: Design documents from `/specs/002-multilanguage-support/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: Included because the project constitution requires tests for relevant behavior.

**Organization**: Tasks are grouped by user story so each story can be implemented
and verified as an incremental delivery.

## Phase 1: Setup

**Purpose**: Configure the static application for generated locale paths and a
language-independent 404 document.

- [X] T001 Enable Next.js `experimental.globalNotFound` in `next.config.ts` while preserving `output: "export"` and the existing export configuration.

---

## Phase 2: Foundational

**Purpose**: Establish the shared locale registry and one root layout before
implementing any user-facing story.

- [X] T002 Create the supported locale registry and type guards in `app/lib/locales.ts`; support exactly `en` and `pt-BR` with their display names and document-language tags.
- [X] T003 Create the shared root layout in `app/[[...locale]]/layout.tsx` and generate the empty root route and both supported locale paths in `app/[[...locale]]/page.tsx`; disable ungenerated locale parameters, set `<html lang>` from the explicit locale (English for the root chooser), and import the existing global stylesheet.

**Checkpoint**: Static route skeleton and locale identification are ready for all
user stories.

---

## Phase 3: User Story 1 - Read the Portfolio in a Preferred Language (Priority: P1) 🎯 MVP

**Goal**: Render complete English and Brazilian Portuguese content, choose a
default language from browser preferences at `/`, and allow visitors to switch
languages without losing their current section.

**Independent Test**: Open `/` in browser contexts whose primary language is
Portuguese and non-Portuguese; verify navigation to the matching locale, complete
localized visible and accessible text, and one-action language switching that
preserves the equivalent section.

### Tests for User Story 1

- [X] T004 [P] [US1] Add locale-content validation cases in `tests/content/locales.test.ts` for matching locale IDs, same required schema, complete localized UI/content strings, and unchanged contact values and hrefs.
- [X] T005 [P] [US1] Add browser scenarios in `tests/e2e/language-preference.spec.ts` for Portuguese and non-Portuguese defaults at `/`, complete translations, keyboard-operable language switching, and equivalent-section preservation.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create the English dataset in `app/data/portfolio.en.json` using the existing portfolio profile, services, projects, contacts, and media; add all required localized `ui` strings while preserving the original profile identity, values, links, and content order.
- [X] T007 [P] [US1] Create the Brazilian Portuguese dataset in `app/data/portfolio.pt-BR.json` with the same schema and ordering as `app/data/portfolio.en.json`; translate every visitor-facing profile, service, project, contact-label, UI, and accessible-label string, and keep personal names, contact values, hrefs, and media unchanged.
- [X] T008 [US1] Extend portfolio types and validation in `app/lib/portfolio.ts` to validate each supported locale and its required localized `profile`, `ui`, `services`, `projects`, and `contacts`; preserve existing field rules and reject missing strings or mismatched locale data instead of falling back to English.
- [X] T009 [P] [US1] Create the root language chooser in `app/components/LocaleChooser.tsx`; inspect `navigator.languages[0]` with `navigator.language` as fallback, choose `/pt-BR` only when the primary tag begins with `pt`, navigate client-side, and render direct language links as the no-JavaScript fallback.
- [X] T010 [P] [US1] Update `app/components/SiteHeader.tsx` and create `app/components/LanguageSelector.tsx` to use localized branding/navigation labels and recognizable language names; make the selector keyboard-operable and preserve the current section fragment when switching.
- [X] T011 [P] [US1] Update `app/components/IntroSection.tsx` to receive localized UI strings for the greeting, headline, availability, scroll hint, and accessible text while retaining profile-driven content.
- [X] T012 [P] [US1] Update `app/components/ServicesSection.tsx` to receive localized section headings and carousel labels while retaining the existing service ordering and cards.
- [X] T013 [P] [US1] Update `app/components/ProjectsSection.tsx` to receive localized section headings, project-link labels, and carousel labels while retaining the existing project ordering, optional images, and configured links.
- [X] T014 [P] [US1] Update `app/components/ContentCarousel.tsx` to receive localized previous/next accessible labels and item-position text while preserving current keyboard, touch, boundary, and reduced-motion behavior.
- [X] T015 [P] [US1] Update `app/components/SiteFooter.tsx` to receive localized footer headings, empty-contact text, and back-to-top label while rendering only configured contacts.
- [X] T016 [US1] Update `app/[[...locale]]/page.tsx` to render the locale chooser for `/` and, for `/en` or `/pt-BR`, validate and render the matching JSON through the existing header, hero, services, projects, and footer components.

**Checkpoint**: User Story 1 is independently usable in either language, including
browser-based default selection and in-page language switching.

---

## Phase 4: User Story 2 - Open and Share a Specific Language (Priority: P2)

**Goal**: Ensure locale URLs are directly accessible and unknown paths show the
English static recovery experience.

**Independent Test**: Open `/en` and `/pt-BR` in fresh browser contexts with
opposite language preferences and verify each URL controls the displayed language;
open an unsupported path and verify the static 404 recovery text and `/en` link.

### Tests for User Story 2

- [X] T017 [US2] Add browser scenarios in `tests/e2e/locale-routes.spec.ts` for direct `/en` and `/pt-BR` visits regardless of browser language, stable copied URLs, and the English recovery page and working `/en` link on an unsupported path.

### Implementation for User Story 2

- [X] T018 [US2] Create the static English recovery document in `app/global-not-found.tsx` with semantic page structure, English `lang`, a clear not-found message, and a direct link to `/en`; import the needed global styles explicitly.

**Checkpoint**: User Story 2 has predictable direct URLs and an English-language
static fallback for unsupported paths.

---

## Phase 5: User Story 3 - Find the Correct Language Version in Search and Previews (Priority: P3)

**Goal**: Provide accurate localized language, search, canonical, alternate, and
social-sharing metadata for both pages.

**Independent Test**: Inspect generated `/en` and `/pt-BR` HTML and the sitemap;
verify each language has its matching document language, localized title and
description, canonical URL, reciprocal alternate URLs, Open Graph/Twitter/X values,
and discoverable sitemap entry.

### Tests for User Story 3

- [X] T019 [US3] Add metadata and sitemap scenarios in `tests/e2e/locale-metadata.spec.ts` for each locale's document language, localized title/description, canonical URL, reciprocal alternates, Open Graph/Twitter/X preview values, and sitemap location.

### Implementation for User Story 3

- [X] T020 [P] [US3] Generate locale-specific metadata in `app/[[...locale]]/page.tsx` from the selected validated dataset, including canonical URL, reciprocal `en`/`pt-BR` alternates, localized Open Graph and Twitter/X titles/descriptions, and the configured static preview image; mark the root language chooser `noindex`.
- [X] T021 [P] [US3] Update `app/sitemap.ts` to include `/en` and `/pt-BR` with reciprocal language alternates and exclude the language-selection root from indexing.

**Checkpoint**: User Story 3 is independently verifiable through static metadata
and sitemap output for both locale URLs.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate that translated content retains existing accessibility,
responsive behavior, and static-export reliability.

- [X] T022 [P] Add or update translated-layout checks in `tests/e2e/accessibility-responsive.spec.ts` for keyboard operation, reduced motion, and no horizontal page overflow at 320 CSS pixels and 1440 CSS pixels in both locales.
- [X] T023 Run `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`, and `npm run build`; inspect generated locale pages, metadata, sitemap, and 404 document under `out/`.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; configure the static global 404 behavior.
- **Foundational (Phase 2)**: Depends on Setup; the locale registry and shared
  optional-locale root layout block all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers localized content,
  root selection, and language switching.
- **User Stories 2 and 3 (Phases 4-5)**: Depend on User Story 1's locale routes and
  content. They are otherwise independent and can proceed in parallel after US1.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Begins after Foundational; no dependency on another story.
- **US2 (P2)**: Depends on US1 locale routes and content; adds fallback behavior
  without changing locale selection.
- **US3 (P3)**: Depends on US1 locale data and routes; metadata and sitemap work
  can proceed independently from US2 after US1.

### Parallel Execution Examples

**User Story 1**

- T004 and T005 can be authored in parallel because they update separate test files.
- T006 and T007 can be prepared in parallel because each owns a separate locale
  JSON file; validate that their schemas and content order match before integration.
- After T008 defines the localized type contract, T009-T015 can be implemented in
  parallel because each task owns a separate component file (T010 also creates its
  dedicated selector component).

**User Stories 2 and 3**

- After US1 is complete, US2's static fallback work (T018) and US3 metadata/sitemap
  work (T020-T021) touch distinct files and can be implemented in parallel. Keep
  each story's acceptance tests (T017, T019) tied to its own behavior.

### Implementation Strategy

1. Complete Setup and Foundational tasks to establish the single shared locale
   layout and supported route list.
2. Deliver **MVP = User Story 1**: complete translations, browser preference at
   `/`, and language switching with section preservation.
3. Add direct URL fallback behavior (US2) and localized search/share output (US3)
   as independently testable increments.
4. Finish with translated responsive/accessibility checks and full static build
   verification.

## Phase 7: Convergence

- [X] T024 CRITICAL: Replace the reserved `portfolio.example.com` origin with the verified public HTTPS origin across locale data, robots and sitemap output, and related checks; verify generated canonical and sitemap URLs per Constitution VI and FR-009 (partial).
- [X] T025 CRITICAL: Replace the generic “Your Name” social preview asset with an accurate portfolio image and verify both locale metadata reference it per Constitution VI and FR-009 (partial).
- [X] T026 Add assertions for localized descriptions, canonical and social URLs, preview images, and card type for both locales per T019 and SC-004 (partial).
