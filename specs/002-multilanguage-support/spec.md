# Feature Specification: Multilanguage Portfolio Support

**Feature Branch**: `002-multilanguage-support`

**Created**: 2026-11-02

**Status**: Draft

**Input**: User description: "multilanguage support starting with en and pt-BR"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the Portfolio in a Preferred Language (Priority: P1)

A visitor can use the portfolio in English or Brazilian Portuguese and can switch
languages while exploring the page.

**Why this priority**: Making the existing portfolio understandable to both
English-speaking and Brazilian Portuguese-speaking visitors is the central value of
this feature.

**Independent Test**: Open the portfolio in each supported language and review all
visible sections and controls; switch languages and confirm the equivalent content
appears in the selected language.

**Acceptance Scenarios**:

1. **Given** a visitor opens the default homepage `/` without choosing a language and their
   browser's primary preferred language is Portuguese, **When** the page loads,
   **Then** they are shown the Brazilian Portuguese portfolio at `/pt-BR`.
2. **Given** a visitor opens the default homepage `/` without choosing a language and their
   browser's primary preferred language is not Portuguese, **When** the page loads,
   **Then** they are shown the English portfolio at `/en`.
3. **Given** a visitor is viewing the portfolio in English, **When** they select
   Brazilian Portuguese, **Then** all user-facing page content and controls appear
   in Brazilian Portuguese.
4. **Given** a visitor is viewing the portfolio in Brazilian Portuguese, **When**
   they select English, **Then** all user-facing page content and controls appear
   in English.
5. **Given** a visitor switches languages while viewing a page section, **When**
   the other language is selected, **Then** the visitor remains at the equivalent
   section in the selected language.

---

### User Story 2 - Open and Share a Specific Language (Priority: P2)

A visitor can open or share a link that consistently displays the portfolio in the
chosen language.

**Why this priority**: Stable language-specific links let visitors share the
appropriate version and return to it without making the same selection again.

**Independent Test**: Copy each language's URL, open it in a fresh browser session,
and verify that it renders in the specified language.

**Acceptance Scenarios**:

1. **Given** a visitor opens the explicit English URL `/en`, **When** the page loads,
   **Then** it displays in English regardless of the browser's preferred language.
2. **Given** a visitor opens the explicit Brazilian Portuguese URL `/pt-BR`, **When** the page loads,
   **Then** it displays in Brazilian Portuguese without requiring a prior selection.
3. **Given** a visitor copies a language-specific URL and shares it, **When** another
   visitor opens that URL, **Then** the same language version is shown.
4. **Given** a visitor opens an unsupported locale URL, **When** the static host
   serves the 404 document, **Then** it shows an English-language recovery page
   with a direct link to `/en`.

---

### User Story 3 - Find the Correct Language Version in Search and Previews (Priority: P3)

Search engines and social platforms can identify the language of each version and
present an appropriate title and description when it is shared.

**Why this priority**: Correct language metadata improves discovery and ensures
shared links accurately describe the content visitors will see.

**Independent Test**: Inspect each rendered language version's document language,
search metadata, canonical URL, alternate-language references, and social preview
metadata.

**Acceptance Scenarios**:

1. **Given** a search engine inspects either language version, **When** it reads
   page metadata, **Then** the document language and page title and description
   match that version.
2. **Given** a visitor shares either language URL, **When** a social platform reads
   its preview metadata, **Then** the title and description correspond to the
   selected language.
3. **Given** a search engine inspects either version, **When** it checks alternate
   language references, **Then** it can identify the corresponding English and
   Brazilian Portuguese pages.

### Edge Cases

- When a visitor opens an unsupported language URL, the site MUST present the
  English-language recovery page from the static 404 document and MUST NOT show
  untranslated or blank content.
- When a visitor changes language from a section with no exact counterpart, the
  selected language's homepage MUST be shown without an error.
- When translated text is longer than its English equivalent, page sections,
  navigation, buttons, and carousel controls MUST remain readable and usable on
  narrow and wide screens.
- When a visitor opens the default homepage `/` without an explicit locale URL, the
  browser's primary preferred language MUST determine the default: Portuguese
  selects Brazilian Portuguese; all other languages select English.
- When a visitor opens `/en` or `/pt-BR`, or selects a language manually, that
  explicit choice MUST take precedence over browser language preferences.
- When a translation is unavailable for any required user-facing content, the
  English version MUST NOT be mixed into the Brazilian Portuguese version; the
  incomplete translation MUST be treated as a release-blocking content issue.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The portfolio MUST support English (`en`) and Brazilian Portuguese
  (`pt-BR`) as complete visitor-facing languages.
- **FR-002**: When a visitor opens the default homepage without an explicit locale
  URL or prior language selection, the site MUST select Brazilian Portuguese if
  the browser's primary preferred language is Portuguese; otherwise, it MUST select
  English.
- **FR-003**: The site MUST provide a clearly labeled, keyboard-operable language
  selector that lets visitors change between English and Brazilian Portuguese.
- **FR-004**: The selector MUST identify languages by their recognizable names,
  such as “English” and “Português (Brasil)”.
- **FR-005**: The selected language MUST apply to all visitor-facing content,
  including navigation, headings, biography, services, project descriptions,
  contact labels, buttons, carousel controls, accessible labels, and footer text.
- **FR-006**: Each supported language MUST have a stable, directly accessible URL
  (`/en` for English and `/pt-BR` for Brazilian Portuguese) that renders that
  language without relying on stored browser state; explicit language URLs MUST
  take precedence over browser preferences.
- **FR-007**: Switching languages MUST preserve the visitor's equivalent page
  section when possible and MUST provide a safe destination when no equivalent
  section exists.
- **FR-008**: Each language version MUST declare the correct document language and
  provide localized page titles and meta descriptions.
- **FR-009**: Each language version MUST provide accurate canonical, alternate
  language, Open Graph, and Twitter/X metadata for the matching content and URL.
- **FR-010**: Unsupported language URLs MUST display an English-language recovery
  page from the static 404 document, including a direct link to `/en`, without
  displaying a broken or partially translated page.
- **FR-011**: Both versions MUST retain the existing portfolio's responsive,
  keyboard-accessible, and reduced-motion behavior.

### Key Entities

- **Supported language**: A language option with a recognizable name and a stable
  identifier (`en` or `pt-BR`).
- **Localized portfolio content**: The visitor-facing text and accessible labels
  associated with one supported language.
- **Language-specific page metadata**: The document language, title, description,
  canonical URL, alternate language references, and social preview values for a
  language version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can change from either supported language to the other in one
  language-selector action.
- **SC-002**: 100% of visitor-facing text and accessible labels are available in
  both English and Brazilian Portuguese, with no mixed-language interface.
- **SC-003**: 100% of direct visits to `/en` and `/pt-BR` display the matching
  language without requiring a previous visit or saved preference; visits to `/`
  select Portuguese when the browser's primary preferred language is Portuguese
  and English otherwise.
- **SC-004**: Every supported language version has correct document language,
  localized title and description, canonical URL, alternate language references,
  and matching social preview text.
- **SC-005**: Both language versions remain usable at viewport widths from 320 CSS
  pixels through 1440 CSS pixels without horizontal page scrolling.

## Assumptions

- English is selected when the browser does not indicate a Portuguese preference;
  `/en` is the explicit English URL and `/pt-BR` is the explicit Brazilian
  Portuguese URL.
- The default homepage `/` chooses the initial locale based on the browser's
  primary preferred language; each locale also has a distinct, stable
  language-specific URL.
- On the default homepage only, a primary preferred language beginning with the
  Portuguese language code `pt` selects Brazilian Portuguese; otherwise English
  is selected. Explicit language URLs and manual selections override this default.
  The selection is not persisted separately from the URL.
- The profile owner supplies or approves the Brazilian Portuguese translations,
  including the biography, services, project descriptions, and contact labels;
  personal names, contact values, and external profile URLs remain unchanged.
- Both language versions represent the same single-page portfolio. New languages,
  translated project detail pages, and automatic machine translation are outside
  this feature's scope.
