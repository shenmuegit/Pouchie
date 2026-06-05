# Accounting Motion UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert transaction entry into a single fast form with subtle motion and non-blocking save feedback.

**Architecture:** Keep this phase inside the mobile app. Shared motion constants live in `src/lib/motion.ts`; pure save-feedback state lives in `src/lib/save-feedback.ts`; UI wiring stays in `app/(tabs)/add.tsx`.

**Tech Stack:** Expo SDK 54, React Native `Animated`, React Hook Form, TanStack Query, Vitest, TypeScript.

---

### Task 1: Motion Tokens

**Files:**
- Create: `apps/mobile/src/lib/motion.ts`
- Modify: `apps/mobile/src/components/Motion.tsx`

- [ ] Create `motion.ts` with `motionDurations`, `motionScale`, and `motionStagger`.
- [ ] Update `MotionView` and `MotionPressable` defaults to use the shared tokens.

### Task 2: Save Feedback State

**Files:**
- Create: `apps/mobile/src/lib/save-feedback.ts`
- Create: `apps/mobile/src/lib/save-feedback.test.ts`

- [ ] Write a failing test for `nextSaveFeedback("idle", "start")`, `nextSaveFeedback("saving", "success")`, and `nextSaveFeedback("saving", "error")`.
- [ ] Implement `nextSaveFeedback` as a pure reducer returning `{ state, message }`.
- [ ] Run `pnpm --filter @xiaohebao/mobile test -- src/lib/save-feedback.test.ts`.

### Task 3: Single Add Form

**Files:**
- Modify: `apps/mobile/app/(tabs)/add.tsx`

- [ ] Remove `quickAmount`, `quickNote`, `submitQuick`, and the second duplicate form.
- [ ] Use the existing React Hook Form values for amount, name, and note.
- [ ] Keep category icon grid once.
- [ ] When a category is selected and the name field is empty, set name to the localized category name.
- [ ] On successful create, reset the form and show inline success feedback instead of `Alert.alert("保存成功", ...)`.

### Task 4: Verification

**Files:**
- Check: mobile test suite and workspace TypeScript.

- [ ] Run `pnpm --filter @xiaohebao/mobile test`.
- [ ] Run `pnpm run typecheck`.
