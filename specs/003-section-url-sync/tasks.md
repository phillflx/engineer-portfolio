---
description: "Implementation tasks for section URL synchronization"
---

# Tasks: Section URL Synchronization

**Input**: Design documents from `specs/003-section-url-sync/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `contracts/`

**Tests**: Browser tests are included because the project constitution requires tests for relevant behavior and the plan calls for Playwright coverage.

**Organization**: Tasks are grouped by the three prioritized user stories in `spec.md`.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]** marks tasks that can proceed in parallel because they edit different files and have no incomplete-task dependency.
- **[Story]** maps a task to its user story; setup, foundational, and polish tasks have no story label.
- Every task includes the file path it creates, changes, or validates.

## Phase 1: Setup

**Purpose**: Prepare project infrastructure.

The existing project already has the required dependencies, static export, and Playwright configuration in `package.json`, `next.config.ts`, and `playwright.config.ts`. No setup changes are required.

## Phase 2: Foundational

**Purpose**: Resolve blocking prerequisites before story work.

No foundational changes are required. The four section IDs, localized routes, and browser-test tooling already exist.

## Phase 3: User Story 1 - Track the Visible Section in the URL (Priority: P1) 🎯 MVP

**Goal**: Keep the URL fragment aligned with the section occupying the greatest visible area, without adding history entries while scrolling.

**Independent Test**: On either locale route, scroll through sections with differing visible areas and verify the winning section fragment, tie behavior, no-visible-section retention, and unchanged browser history length.

### Tests for User Story 1

- [X] T001 [P] [US1] Add Playwright coverage for greatest-visible-area selection, current-section and topmost tie resolution, fragment retention when no section is visible, and unchanged history length during scrolling in `tests/e2e/section-url-sync.spec.ts`.

### Implementation for User Story 1

- [X] T002 [US1] Create `SectionUrlTracker` in `app/components/SectionUrlTracker.tsx` to track the visible viewport area of `#hero`, `#services`, `#projects`, and `#contact`; resolve ties by retaining the current tied section or selecting the tied section nearest the viewport top; retain the fragment when no section is visible; coalesce scroll and resize measurements to at most one per animation frame; replace the current URL entry only when a scroll-driven active section changes; and clean up listeners and pending animation frames.
- [X] T003 [US1] Mount `SectionUrlTracker` on localized portfolio pages in `app/[[...locale]]/page.tsx` without changing the existing section components, their IDs, or the `/en` and `/pt-BR` routes.

**Checkpoint**: Scrolling independently updates the fragment to the greatest-visible-area section and creates no additional history entries.

## Phase 4: User Story 2 - Navigate to Sections as Before (Priority: P2)

**Goal**: Preserve native section navigation and direct fragment links, including graceful loading for an unknown fragment.

**Independent Test**: Activate each existing header section link, open a valid fragment directly, and load an unknown fragment; verify destinations and page availability remain correct.

### Tests for User Story 2

- [X] T004 [P] [US2] Add Playwright regression tests for header navigation to `#services`, `#projects`, and `#contact`, direct loading of a valid section fragment, and successful locale-page loading with an unknown fragment in `tests/e2e/section-navigation.spec.ts`.

**Checkpoint**: Existing section links and direct fragments continue to work after scroll tracking is enabled.

## Phase 5: User Story 3 - Keep Language Switching Intact (Priority: P2)

**Goal**: Preserve the selected locale and corresponding section fragment when switching languages after scroll tracking updates the URL.

**Independent Test**: Scroll to a different section until its fragment is active, switch to the other locale, and verify both the new locale and equivalent section.

### Tests for User Story 3

- [X] T005 [P] [US3] Add Playwright regression tests that scroll from the initial section until another section fragment becomes active, switch between `/en` and `/pt-BR`, and verify the locale and matching section fragment are preserved in `tests/e2e/section-language.spec.ts`.

**Checkpoint**: A scroll-synchronized fragment remains usable by existing locale switching in both directions.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the completed stories and documented validation path.

- [X] T006 Run the focused Playwright scenarios and repository typecheck, lint, and unit-test commands listed in `specs/003-section-url-sync/quickstart.md`; resolve failures in `app/components/SectionUrlTracker.tsx`, `app/[[...locale]]/page.tsx`, or the three feature tests in `tests/e2e/section-url-sync.spec.ts`, `tests/e2e/section-navigation.spec.ts`, and `tests/e2e/section-language.spec.ts`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No changes needed; existing tooling is ready.
- **Foundational (Phase 2)**: No changes needed; existing section IDs and locale routes are the prerequisites.
- **User Story 1 (Phase 3)**: Can begin immediately; delivers the MVP.
- **User Stories 2 and 3 (Phases 4 and 5)**: Regression coverage should be run after T003 so it validates the integrated tracker. Their test files are independent of each other and can be authored in parallel with the tracker work.
- **Polish (Phase 6)**: Depends on the implementation and regression tests for all stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: No story dependency.
- **US2 (P2)**: Depends on the tracker integration from US1 only for regression verification; native links and targets already exist.
- **US3 (P2)**: Depends on the tracker integration from US1 only for regression verification; locale routing and fragment preservation already exist.
- **US2 and US3**: Independent of each other.

### Parallel Opportunities

- T001 can be authored in `tests/e2e/section-url-sync.spec.ts` in parallel with T004 in `tests/e2e/section-navigation.spec.ts` and T005 in `tests/e2e/section-language.spec.ts`.
- T004 and T005 can be authored in parallel because they modify different test files.
- T002 must complete before T003 can integrate the tracker.
- Run all three focused Playwright files together after T003 to validate interactions.

## Parallel Example: Browser Test Authoring

```text
Task: T001 — tests/e2e/section-url-sync.spec.ts
Task: T004 — tests/e2e/section-navigation.spec.ts
Task: T005 — tests/e2e/section-language.spec.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001 to define the active-section and history acceptance behavior.
2. Implement and integrate the tracker with T002 and T003.
3. Validate US1 independently with `npm run test:e2e -- tests/e2e/section-url-sync.spec.ts`.

### Incremental Delivery

1. Deliver US1 to synchronize fragments during scrolling without new history entries.
2. Add and run US2 regression coverage for section navigation and direct fragments.
3. Add and run US3 regression coverage for language switching after scrolling.
4. Run all validation commands in the quickstart guide.

## Task Summary

- **Total tasks**: 6
- **US1**: 3 tasks (T001-T003)
- **US2**: 1 task (T004)
- **US3**: 1 task (T005)
- **Polish**: 1 task (T006)
- **Parallel opportunities**: T001, T004, and T005 target separate test files; T004 and T005 can be authored concurrently.
- **Suggested MVP**: US1 only.
- **Format validation**: All six tasks use the `- [ ] T###` checklist format; each story task includes its `[US#]` label, parallelizable tasks include `[P]`, and each task names its relevant file path.
