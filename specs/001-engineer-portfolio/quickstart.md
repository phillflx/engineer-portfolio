# Quickstart: Software Engineer Portfolio Homepage

This guide describes how to validate the homepage after implementation. The repository
does not yet contain an application manifest or test scripts; implementation must add
the standard development, test, and static build commands before these steps can run.

## Prerequisites

- Node.js version supported by the selected Next.js release.
- npm and dependencies installed from the project manifest.
- Chromium installed for Playwright with `npx playwright install chromium`.
- Portfolio JSON populated with the required fields in [data-model.md](data-model.md).

## Run locally

1. Install dependencies with `npm ci`.
2. Start the development server with `npm run dev`.
3. Open the local site in a browser and verify:
   - The hero, fixed menu, services carousel, projects carousel, and contact footer
     render from the supplied JSON.
   - Menu links reach each section while the menu remains available during scrolling.
   - Both carousels expose every card through their controls, keyboard input, and touch.
   - The page remains usable at narrow and wide viewport widths and with reduced motion
     enabled.
   - No unavailable contact channel or project link is displayed as a broken link.

## Run automated checks

1. Run the project test command, `npm test`, to validate required JSON content and
   carousel behavior.
2. Run `npm run test:e2e` to validate the homepage on desktop and mobile Chromium.
3. Run the production static build with `npm run build`.
4. Inspect the exported output directory (`out/`) and verify that the generated
   homepage contains the primary page content, descriptive metadata, canonical URL,
   Open Graph metadata, and Twitter/X card metadata without requiring a browser-side
   JSON request.
5. Verify the exported site can be served as static files over HTTPS by the target
   hosting environment.

## Expected outcome

The build succeeds with valid portfolio JSON, emits a self-contained static homepage,
and includes accessible, manually controlled carousels and SEO metadata. Invalid
required content fails validation with an actionable error.
