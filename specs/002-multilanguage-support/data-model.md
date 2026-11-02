# Data Model: Multilanguage Portfolio Support

All localized content is public JSON committed with the site and consumed during
static generation. There is no database, user-generated content, runtime
translation service, authentication, or persisted locale preference.

## Supported Locale

Represents one language offered by the portfolio.

| Field | Type | Required | Validation |
|---|---|---:|---|
| identifier | string | Yes | Exactly `en` or `pt-BR`; used as the locale URL segment. |
| displayName | string | Yes | Non-empty recognizable language name, such as “English” or “Português (Brasil)”. |
| documentLanguage | string | Yes | Correct language tag for the rendered document (`en` or `pt-BR`). |

The root locale chooser recognizes Portuguese when the browser's primary preferred
language tag begins with `pt`; all other values select English.

## Localized Portfolio

Represents the complete visitor-facing portfolio content for one supported locale.
The English and Brazilian Portuguese JSON documents MUST have the same schema.

| Field | Type | Required | Validation |
|---|---|---:|---|
| locale | supported locale identifier | Yes | Must match the locale route and corresponding file. |
| profile | object | Yes | Contains the localized role, introduction, primary-action label, page title, and meta description; all visitor-facing strings are non-empty and in the selected language. |
| ui | object | Yes | Contains all fixed visible copy and accessible labels for branding, navigation, hero, section headings and indexes, project links, carousel controls/status, language selector, and footer; required strings are non-empty and localized. |
| services | ordered list | Yes | At least one service; each title and description is non-empty and in the selected language. |
| projects | ordered list | Yes | At least one project; each title and summary is non-empty and in the selected language. |
| contacts | ordered list | Yes | Contains the localized label for each contact channel; contact values and hrefs remain identical between locales. |

Profile identity, contact values, and external profile URLs remain unchanged.
Project/service ordering and optional media/link fields remain consistent across
the two documents. The validator MUST reject a missing locale document, a locale
identifier mismatch, invalid existing portfolio fields, or missing localized
strings; it MUST NOT silently substitute English strings into the Portuguese page.
The `ui` object also supplies the localized hero greeting and headline fragments,
carousel position format, link labels, and recovery-safe navigation copy so
components do not retain hard-coded English text.

## Language-specific page metadata

Represents crawler and social-sharing metadata generated for one locale.

| Field | Type | Required | Validation |
|---|---|---:|---|
| document language | string | Yes | Matches the supported locale and rendered HTML `lang`. |
| title | string | Yes | Localized, descriptive page title from that locale's profile. |
| description | string | Yes | Localized, relevant page summary from that locale's profile. |
| canonical URL | absolute HTTPS URL | Yes | Public site origin plus the locale path (`/en` or `/pt-BR`). |
| alternate language URLs | mapping | Yes | Reciprocal `en` and `pt-BR` URLs identify the corresponding versions. |
| Open Graph / Twitter-X fields | localized metadata | Yes | Title and description match visible content; preview image remains the configured site image. |

## Relationships and rendering

- Each supported locale maps to exactly one complete Localized Portfolio.
- Each Localized Portfolio produces one language-specific page and one set of
  language-specific metadata.
- The root path selects one locale in the browser and navigates to its explicit URL;
  locale selection is not stored separately from that URL.
- Language-selector links preserve matching section fragments when available and
  otherwise navigate to the selected locale's homepage.
- Unsupported routes use the English recovery UI in the static 404 document.
- All content is public. Do not put credentials, private contact data, or other
  secrets in either JSON file.
- Static generation MUST fail clearly if either locale's required content is
  invalid or incomplete.
