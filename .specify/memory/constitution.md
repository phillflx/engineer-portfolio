<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles: none
Added principles: Search Engine Optimization (SEO)
Added sections: none
Removed sections: none
Follow-up TODO: confirm the original ratification date.
-->

# Static Webapp Constitution

## Core Principles

### I. Static Delivery
The application MUST run as client-side code delivered from static files. Its core
functionality MUST NOT require server-side application execution.

### II. Accessible, Responsive UX
User-facing pages MUST use semantic structure, support keyboard operation, and remain
usable on narrow and wide screens. Accessibility and responsive behavior are required
parts of feature acceptance.

### III. Security and Privacy
The application MUST be served over HTTPS in production. Secrets MUST NOT be included
in client-delivered files, and untrusted content MUST be rendered safely. Personal data
collection MUST be limited to what the feature requires.

### IV. Verified Behavior
Changes MUST include or update tests for relevant behavior and MUST pass the
repository-defined checks before release. User-facing flows MUST be manually checked
when automated checks cannot cover their behavior.

### V. Simplicity and Maintainability
Changes MUST follow established project conventions and avoid unnecessary dependencies
or infrastructure. Any external service required by a feature MUST be documented.

### VI. Search Engine Optimization (SEO)
Public pages MUST use semantic HTML, a logical heading hierarchy, descriptive page
titles, and relevant meta descriptions. Pages intended for indexing MUST have crawlable
links and accurate indexing directives; provide a sitemap and robots.txt when
appropriate. Shareable pages MUST include Open Graph and Twitter/X card metadata with
accurate titles, descriptions, canonical URLs, and preview images. Structured data MUST
be accurate and reflect visible page content.

## Static Webapp Requirements

The project MUST remain deployable as static assets without a required application
server. Frameworks, build tools, and hosting providers are implementation choices; no
specific technology is mandated by this constitution.

## Delivery and Quality

Feature acceptance MUST account for accessibility, responsive behavior, and relevant
automated checks. Deployment MUST use HTTPS and MUST NOT expose secrets in public
assets. When a feature relies on an external service, its runtime configuration and
failure behavior MUST be documented.

## Governance

This constitution governs feature specifications, implementation, review, and release.
Amendments MUST be reviewed and recorded here. Version numbers follow semantic
versioning: MAJOR for incompatible governance changes, MINOR for new or materially
expanded requirements, and PATCH for clarifications that do not change requirements.
Every feature review MUST check applicable principles; any exception MUST be documented
with its rationale and approved by the project maintainer.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-11-02
