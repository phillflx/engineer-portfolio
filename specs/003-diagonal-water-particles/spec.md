# Feature Specification: Diagonal Water Particle Simulation

**Feature Branch**: `003-diagonal-water-particles`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "a grid of diagonal dash particles animated as water simulation. mouse movement should cause disturbances on the particles and when the mouse stays still it must send round pulses through the particle simulation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explore the Animated Intro Background (Priority: P1)

A visitor sees a grid of diagonal dash particles in the portfolio intro, moving
like a calm water surface. Moving the mouse through the grid creates a localized
disturbance that spreads through nearby particles and then settles.

**Why this priority**: The interactive water-like field is the feature's primary
visual experience and makes the intro feel responsive to visitors.

**Independent Test**: Open the intro and move the mouse across several parts of
the particle field; verify the field animates continuously, nearby particles react
to the pointer, and the reaction settles without obscuring intro content.

**Acceptance Scenarios**:

1. **Given** a visitor opens the intro, **When** the particle field is visible,
   **Then** diagonal dash particles move in a continuous, water-like pattern.
2. **Given** the particle field is animating, **When** the visitor moves the mouse
   over it, **Then** nearby particles visibly ripple or deflect and gradually
   return to the surrounding motion.
3. **Given** a visitor moves the mouse across different areas, **When** each
   movement occurs, **Then** the disturbance follows the pointer's location
   without blocking normal page interaction.

### User Story 2 - See Autonomous Round Pulses (Priority: P2)

A visitor who pauses their mouse movement sees round pulses travel across the
particle field, keeping the simulation visibly alive without requiring ongoing
input.

**Why this priority**: Autonomous pulses fulfill the requested idle behavior and
ensure the field remains engaging when a visitor is reading or not using a mouse.

**Independent Test**: Leave the mouse still over the intro, then move it and leave
it still again; verify that circular waves appear after each pause and that mouse
movement restarts the idle wait.

**Acceptance Scenarios**:

1. **Given** the intro is visible and the mouse has not moved for the idle delay,
   **When** the delay expires, **Then** a circular pulse begins and travels across
   the particle field.
2. **Given** the mouse remains still, **When** a pulse has passed, **Then**
   additional round pulses occur at spaced intervals.
3. **Given** an idle pulse is due, **When** the visitor moves the mouse,
   **Then** the idle wait restarts and the pointer disturbance takes precedence
   until the mouse is still again.

### User Story 3 - Use the Intro with Motion Preferences and Different Screens (Priority: P3)

A visitor can read and navigate the intro regardless of screen size or motion
preference; the particle effect remains decorative and does not interfere with
content or controls.

**Why this priority**: The visual effect must preserve the portfolio's accessible,
responsive experience for all visitors.

**Independent Test**: Review the intro at narrow and wide viewport sizes, with a
keyboard, and with reduced motion enabled; verify that content remains usable and
the effect does not introduce unwanted movement.

**Acceptance Scenarios**:

1. **Given** a visitor has requested reduced motion, **When** they view the intro,
   **Then** the particle field remains static and does not emit animated pulses or
   pointer-driven motion.
2. **Given** a visitor views the intro on a narrow or wide screen, **When** the
   page is displayed, **Then** the particle field stays within its visual area and
   does not cause horizontal page scrolling.
3. **Given** a visitor navigates with a keyboard, **When** focus moves through
   intro controls, **Then** the decorative field does not capture focus or block
   any control.

### Edge Cases

- When the intro loads without any mouse movement, autonomous pulses MUST still
  begin after the idle delay.
- When the pointer leaves the particle field, its last disturbance MUST settle
  naturally and MUST NOT remain frozen.
- When the pointer moves repeatedly before an idle pulse is due, the idle timer
  MUST restart rather than producing overlapping scheduled pulses.
- When the viewport is resized, the particle field MUST remain contained within
  the intro and retain a balanced visual density.
- When reduced motion is enabled before or during a visit, animated movement,
  pointer disturbances, and autonomous pulses MUST remain disabled.
- When the page is opened on a device without a mouse, autonomous pulses MUST
  still provide the idle visual behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The intro MUST display a decorative field made of a grid of
  individually visible diagonal dash particles.
- **FR-002**: The particles MUST move continuously in a coordinated, water-like
  pattern while motion is allowed.
- **FR-003**: Mouse movement over the field MUST create a visible, localized
  disturbance that affects nearby particles and gradually settles.
- **FR-004**: When there has been no mouse movement for one second, the field MUST
  emit a circular pulse that propagates across the particles. While the mouse
  remains still, further pulses MUST be emitted at intervals of approximately
  four seconds.
- **FR-005**: Mouse movement MUST restart the idle wait; a scheduled autonomous
  pulse MUST NOT interrupt an active pointer disturbance.
- **FR-006**: Visitors without a mouse MUST still see autonomous pulses after the
  intro becomes visible.
- **FR-007**: The particle field MUST remain decorative, MUST NOT capture keyboard
  focus, and MUST NOT interfere with page scrolling, links, or other controls.
- **FR-008**: When reduced motion is requested, the field MUST be static and MUST
  NOT show animated pulses or pointer-driven particle motion.
- **FR-009**: The field MUST remain visually contained and must not cause
  horizontal page scrolling at narrow or wide viewport sizes.
- **FR-010**: The feature MUST preserve the portfolio's static delivery and MUST
  NOT require a server-side application runtime or an external service.

### Key Entities

- **Particle field**: The decorative grid of diagonal dashes displayed in the
  intro, including its visible density and water-like motion.
- **Pointer disturbance**: A temporary localized change in particle movement
  caused by mouse activity over the field.
- **Autonomous pulse**: A round wave that travels through the particle field
  after a period without mouse movement.
- **Motion preference**: The visitor's preference that determines whether
  animated movement is shown or replaced by a static field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a 10-second interaction test, moving the mouse through at least
  three locations in the field produces a visible local disturbance each time,
  and each disturbance settles within 3 seconds after movement stops.
- **SC-002**: With no mouse movement, a visitor sees the first circular pulse
  begin within 2 seconds and subsequent pulses approximately every 4 seconds.
- **SC-003**: At viewport widths from 320 CSS pixels through 1440 CSS pixels,
  the effect remains inside the intro and the page has no horizontal scrolling.
- **SC-004**: With reduced motion enabled, no particles visibly move, and no
  pointer disturbance or autonomous pulse is shown.
- **SC-005**: In usability review, visitors can read and use every intro control
  without the particle field obscuring content or intercepting interaction.

## Assumptions

- The particle simulation is a decorative background for the existing intro
  section, not a new page or standalone interactive tool.
- A one-second idle delay and pulses spaced approximately four seconds apart are
  reasonable defaults for the unspecified timing.
- Autonomous pulses begin when the intro becomes visible, including on devices
  without a mouse; mouse movement resets the idle delay.
- The visual effect is non-essential content and therefore becomes static when
  the visitor requests reduced motion.
- Particle styling and colors follow the existing portfolio design; this feature
  does not add text, controls, or new content to the intro.
