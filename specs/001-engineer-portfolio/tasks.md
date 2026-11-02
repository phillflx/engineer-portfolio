---
description: "Implementation tasks for the Software Engineer Portfolio Homepage"
---

# Tasks: Software Engineer Portfolio Homepage

**Input**: Design documents from `/specs/001-engineer-portfolio/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: Included because the project constitution and implementation plan require
automated verification of relevant behavior.

**Organization**: Tasks are grouped by user story so each story can be implemented
and verified as an incremental delivery.

## Phase 1: Setup

**Purpose**: Initialize the static Next.js application and validation tooling.

- [X] T001 Initialize a TypeScript Next.js App Router application at the repository root, creating `package.json`, `tsconfig.json`, and the `app/` directory.
- [X] T002 Configure `next.config.ts` with static export output and verify the production build writes static assets to `out/`.
- [X] T003 Add Vitest and Playwright dependencies and configure `npm test`, `npm run build`, and `playwright.config.ts`.

---

## Phase 2: Foundational

**Purpose**: Establish validated JSON content, shared carousel behavior, and a page shell that all stories use.

- [X] T004 [P] Add failing Vitest cases in `tests/content/portfolio.test.ts` for required profile, service, project, and contact-field validation from `data-model.md`.
- [X] T005 Implement TypeScript content types and JSON validation in `lib/portfolio.ts`; enforce each data-model constraint verbatim, including “Non-empty after trimming,” “Valid HTTPS URL for the public homepage,” and “The footer MUST render only configured contact channels.”
- [X] T006 Create valid, clearly replaceable sample portfolio content in `data/portfolio.json`; include profile, service, project, and contact entries without inventing real credentials or contact details.
- [X] T007 Implement the shared manually controlled carousel in `components/ContentCarousel.tsx`, with labelled content, semantic list items, native previous/next buttons, visible position, keyboard/touch use, boundary states, and no auto-rotation.
- [X] T008 Create the shared semantic page shell and section placeholders in `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/SiteHeader.tsx`, `components/HeroCard.tsx`, `components/ServicesSection.tsx`, `components/ProjectsSection.tsx`, and `components/SiteFooter.tsx`; include stable anchor IDs for hero, services, projects, and contact.

**Checkpoint**: JSON content validation, shared carousel, and all page section anchors are available before story implementation.

---

## Phase 3: User Story 1 - Understand the Engineer and Find Contact Details (Priority: P1) 🎯 MVP

**Goal**: Present the engineer's identity and primary action, keep section navigation available while scrolling, and show configured contact information.

**Independent Test**: Load the homepage, identify the engineer and primary action, use the fixed menu to reach sections, and find only configured contact channels in the footer.

### Tests for User Story 1

- [X] T009 [P] [US1] Add Playwright acceptance scenarios in `tests/e2e/portfolio-home.spec.ts` for the hero, fixed navigation, section anchors, contact footer, and required rendered metadata.

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement the fixed, keyboard-accessible section menu in `components/SiteHeader.tsx` and style it in `components/SiteHeader.module.css`.
- [X] T011 [P] [US1] Implement the centered hero card and primary action using profile data in `components/HeroCard.tsx` and style it in `components/HeroCard.module.css`.
- [X] T012 [P] [US1] Implement the contact footer using configured contact channels only in `components/SiteFooter.tsx` and style it in `components/SiteFooter.module.css`.
- [X] T013 [US1] Compose the profile-driven homepage and set descriptive title, meta description, canonical URL, Open Graph and Twitter/X card metadata in `app/page.tsx` and `app/layout.tsx`; add static indexing directives and sitemap generation in `app/robots.ts` and `app/sitemap.ts`.

**Checkpoint**: User Story 1 is independently usable with the service and project section anchors available for later increments.

---

## Phase 4: User Story 2 - Explore Services (Priority: P2)

**Goal**: Let visitors browse every configured service using an accessible carousel.

**Independent Test**: Navigate to Services and use keyboard, touch, previous, and next controls to visit every service card and determine the carousel position.

### Tests for User Story 2

- [X] T014 [P] [US2] Add Playwright scenarios in `tests/e2e/services-carousel.spec.ts` for service-card content, carousel position, control boundaries, keyboard use, and touch scrolling.

### Implementation for User Story 2

- [X] T015 [US2] Render validated service offerings through `components/ContentCarousel.tsx` in `components/ServicesSection.tsx` and style the section and cards in `components/ServicesSection.module.css`; preserve service constraints “Non-empty after trimming” and “Non-empty and understandable without additional context.”

**Checkpoint**: User Story 2 is independently testable through its service section and carousel.

---

## Phase 5: User Story 3 - Review Sample Projects (Priority: P3)

**Goal**: Let visitors browse sample project summaries and follow configured project links.

**Independent Test**: Navigate to Projects, visit each project card using carousel controls, and verify any configured link opens the related information.

### Tests for User Story 3

- [X] T016 [P] [US3] Add Playwright scenarios in `tests/e2e/projects-carousel.spec.ts` for project-card summaries, carousel position and boundaries, keyboard/touch use, optional images, and configured links.

### Implementation for User Story 3

- [X] T017 [US3] Render validated sample projects through `components/ContentCarousel.tsx` in `components/ProjectsSection.tsx` and style the section and cards in `components/ProjectsSection.module.css`; preserve the constraints “Non-empty after trimming,” “Non-empty and accurately describes the example,” and “If supplied, must be valid and lead to related project information.”

**Checkpoint**: User Story 3 is independently testable through its project section and carousel.

---

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Validate the complete homepage against responsive, accessible, SEO, and static-delivery requirements.

- [X] T018 [P] Add cross-cutting Playwright checks in `tests/e2e/accessibility-responsive.spec.ts` for keyboard navigation, legibility, reduced-motion behavior, and usable layouts at 320 CSS pixels and 1440 CSS pixels without horizontal page scrolling.
- [X] T019 Review and correct responsive layout, visible focus, contrast, and reduced-motion styling in `app/globals.css`, `components/SiteHeader.module.css`, `components/HeroCard.module.css`, `components/ServicesSection.module.css`, `components/ProjectsSection.module.css`, and `components/SiteFooter.module.css`.
- [X] T020 Run `npm test` and `npm run build`, inspect the generated homepage and metadata in `out/`, and complete the scenarios in `specs/001-engineer-portfolio/quickstart.md`.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; initialize the application and test commands.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Stories (Phases 3-5)**: Each depends on Foundational. User Stories 1, 2, and 3 can proceed in parallel after Phase 2 because they own separate components and tests; T013 integrates only the P1 profile components and stable section anchors.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Begins after Phase 2; no dependency on another story.
- **User Story 2 (P2)**: Begins after Phase 2; uses the shared carousel from T007 and service section anchor from T008.
- **User Story 3 (P3)**: Begins after Phase 2; uses the shared carousel from T007 and project section anchor from T008.

### Parallel Opportunities

- T004 can run in parallel with other independent setup work after test tooling exists; T005 follows T004.
- T010, T011, and T012 can be implemented in parallel because they use separate component and stylesheet files; T013 integrates them afterward.
- After Phase 2, implementation of T010-T012, T015, and T017 can proceed in parallel, subject to each story's acceptance tests.
- T014 and T016 can be authored in parallel because they cover distinct user-story test files.
- T018 can be authored independently of component implementation, then executed after all stories are complete.

## Parallel Example: User Story 1

```text
Task: T010 Implement the fixed section menu in components/SiteHeader.tsx and components/SiteHeader.module.css
Task: T011 Implement the hero card in components/HeroCard.tsx and components/HeroCard.module.css
Task: T012 Implement the contact footer in components/SiteFooter.tsx and components/SiteFooter.module.css
```

## Parallel Example: User Stories 2 and 3

```text
Task: T015 Implement the services section in components/ServicesSection.tsx and components/ServicesSection.module.css
Task: T017 Implement the projects section in components/ProjectsSection.tsx and components/ProjectsSection.module.css
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and Foundational phases.
2. Complete User Story 1, including its acceptance checks.
3. Validate the hero, navigation, contact details, and rendered metadata independently.
4. Deliver the P1 homepage increment before adding service and project carousel content.

### Incremental Delivery

1. Add User Story 2 and verify every service card.
2. Add User Story 3 and verify every project card and optional link.
3. Complete cross-cutting responsive, accessibility, static-export, and quickstart validation.
