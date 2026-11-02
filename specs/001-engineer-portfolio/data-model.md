# Data Model: Software Engineer Portfolio Homepage

Portfolio data in `app/data/portfolio.json` is public, version-controlled JSON
consumed at build time. There is no database, user-generated content, runtime
persistence, or authentication.

## Portfolio Profile

Represents the site owner and homepage identity.

| Field | Type | Required | Validation |
|---|---|---:|---|
| name | string | Yes | Non-empty after trimming. |
| role | string | Yes | Non-empty after trimming; describes the engineer's professional role. |
| introduction | string | Yes | Non-empty, concise summary for the hero. |
| primaryAction | object | Yes | Contains a non-empty label and a destination that matches a homepage section or configured contact channel. |
| pageTitle | string | Yes | Descriptive title for the homepage. |
| metaDescription | string | Yes | Relevant, non-empty page summary. |
| canonicalUrl | absolute URL string | Yes | Valid HTTPS URL for the public homepage. |
| socialImage | site-relative path or absolute URL string | Conditional | Must identify a valid public preview image when supplied. |

The page title, description, canonical URL, and optional social image provide the
values for both Open Graph and Twitter/X card metadata.

## Service Offering

Represents one service card in the services carousel.

| Field | Type | Required | Validation |
|---|---|---:|---|
| title | string | Yes | Non-empty after trimming. |
| description | string | Yes | Non-empty and understandable without additional context. |

The services collection MUST contain at least one item for the carousel to be shown.

## Sample Project

Represents one project card in the projects carousel.

| Field | Type | Required | Validation |
|---|---|---:|---|
| title | string | Yes | Non-empty after trimming. |
| summary | string | Yes | Non-empty and accurately describes the example. |
| link | absolute HTTPS URL string | No | If supplied, must be valid and lead to related project information. |
| image | site-relative path or absolute URL string | No | If supplied, must identify a valid public image with appropriate alternative text. |
| imageAlt | string | Conditional | Required and meaningful when an image is supplied; decorative images may use an empty alternative. |

The projects collection MUST contain at least one item for the carousel to be shown.

## Contact Channel

Represents one available way to contact the engineer.

| Field | Type | Required | Validation |
|---|---|---:|---|
| label | string | Yes | Non-empty human-readable channel name. |
| value | string | Yes | Non-empty contact address or profile URL. |
| href | valid contact URI or absolute HTTPS URL string | Yes | Must match the channel and value; do not emit a link when absent. |

The footer MUST render only configured contact channels.

## Relationships and rendering

- One Portfolio Profile supplies the hero identity and page metadata.
- A portfolio contains an ordered collection of Service Offerings and Sample Projects.
- A portfolio contains zero or more Contact Channels.
- Collection order in JSON is the initial display order in each carousel.
- All content is public. Do not put credentials, private contact data, or other secrets
  in these files.
- The static build MUST fail clearly for invalid required content rather than silently
  rendering incomplete cards or metadata.
