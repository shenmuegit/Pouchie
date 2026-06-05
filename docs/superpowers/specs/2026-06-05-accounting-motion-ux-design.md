# Accounting Motion UX Design

## Goal

Make transaction entry feel like a fast utility instead of a display page: one form, clear touch feedback, non-blocking save confirmation, and consistent motion timing.

## Product Decisions

- The Add Transaction screen must have one recording flow. The previous split between "quick entry" and "complete entry" makes users decide how to enter data before entering data.
- Category selection is icon-only in the UI. Category names remain available through accessibility labels and data logic.
- Save success must not use a blocking alert. A user should be able to record another transaction immediately.
- Motion should be subtle and functional. It should confirm press, selection, save, and list updates without slowing the flow.

## Motion Direction

The project can borrow GSAP's core concepts: consistent defaults, short durations, easing, and staggered entrances. Because the app is Expo React Native, the implementation should continue through React Native `Animated` for this phase rather than adding DOM-oriented `gsap` or `@gsap/react`.

Motion tokens:

- `press`: 120ms equivalent, scale `0.96`.
- `enter`: 220-260ms, opacity plus small translateY.
- `success`: 280-320ms, inline feedback with a small icon/text transition.
- `stagger`: 16-24ms between icon buttons.

## Phase Scope

- Add shared motion tokens.
- Keep `MotionView` and `MotionPressable`, but make them read from tokens.
- Add a reusable non-blocking feedback helper for the Add Transaction screen.
- Collapse the Add Transaction screen into one form:
  - type segmented control
  - amount input
  - amount chips
  - icon-only category grid
  - name input with category-name default behavior
  - optional note
  - save button
- Remove blocking `Alert.alert("保存成功", ...)` from successful save.

## Acceptance Criteria

- The Add Transaction screen no longer renders separate "极速录入" and "完整录入" sections.
- Saving a transaction shows inline success feedback instead of a blocking success alert.
- Category buttons remain icon-only and accessible by category name.
- Mobile tests pass.
- Full TypeScript typecheck passes.
