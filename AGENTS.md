## Project Guidance

### Constitution and Specs

- Treat [.specify/memory/constitution.md](./.specify/memory/constitution.md) as
  governing policy for feature design, implementation, review, and release. In
  particular, preserve static delivery, accessible and responsive UX, security and
  privacy, verified behavior, maintainability, and SEO. Document and obtain
  maintainer approval for any exception.
- Before changing a feature, read its documents under `specs/`: the specification,
  implementation plan, and tasks, plus relevant research, data model, and quickstart
  documents. Keep affected artifacts consistent with implementation. The portfolio
  foundation is in `specs/001-engineer-portfolio/`; localization is in
  `specs/002-multilanguage-support/`.
- Use the repository's Spec Kit workflow to specify, plan, task, and implement
  substantial feature work. Do not treat generated task checkboxes as a substitute
  for validating the implemented behavior.

### Architecture and Constraints

- This is a statically exported Next.js App Router portfolio. Preserve static
  hosting; do not introduce request-time application server behavior, a database,
  or secrets in client-delivered assets.
- The same portfolio is served at `/en` and `/pt-BR`; `/` is a browser-language
  chooser. Keep localized content in `app/data/` and validate it through the
  existing portfolio types and helpers.
- Preserve semantic HTML, keyboard and touch operation, reduced-motion support,
  responsive layouts, and accurate localized SEO metadata.
- Section fragments are `#intro`, `#services`, `#projects`, and `#contact`.
  Scroll-driven fragment changes replace the current history entry.

### Validation

- Run the checks relevant to the change: `npm run typecheck`, `npm run lint`,
  `npm test`, `npm run test:e2e`, and `npm run build`.
- See [README.md](./README.md) for setup and validation commands. Add or update
  tests for behavior changes and verify responsive or accessibility effects where
  applicable.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
