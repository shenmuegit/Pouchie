# Accounting Focus Phase 1 Design

## Goal

Make the mobile app stable enough for development testing and remove the most visible product drift from the accounting flow.

## Current Findings

- Expo Metro is reachable on `192.168.110.52:8081`, but the API server at `192.168.110.52:8787` is not currently listening. The development login error is therefore a connectivity failure, not a bad test account.
- Previous API logs show `POST /v1/auth/dev/login` returning `200 OK`, followed by normal account data requests. This confirms the dev login endpoint can work when the API is running.
- The mobile network client throws generic errors without the failing URL, status code, or network context. This makes login failures look like identity verification failures.
- The mobile app still exposes the challenge route and profile entry. Local API logs show `/v1/challenges` returning `500`, and the feature conflicts with the current goal of focusing only on accounting.
- The UI currently uses a display-oriented glass style and contains explanatory copy and placeholder settings. Those patterns are not aligned with a high-frequency accounting tool.

## Phase 1 Scope

This phase intentionally avoids a backend-wide deletion of budgets and challenges. It only changes the mobile surface and diagnostics:

- Add mobile-side network error formatting that includes method, URL, HTTP status where available, and a clear message for network failures.
- Make development login report API connectivity failures as API/connectivity issues instead of vague identity verification problems.
- Remove the mobile challenge route, profile entry, and challenge API client methods.
- Keep category selection because recording a transaction still needs categories, and category display must remain localized.

## Out Of Scope

- Removing budget tables, contracts, domain entries, and API routes.
- Redesigning all visual components.
- Rebuilding the add transaction screen.
- Adding production Apple or Google login configuration.

## Acceptance Criteria

- When API is down, dev login surfaces a clear message that points to API connectivity.
- Challenge UI is no longer reachable from the mobile app.
- Mobile API client no longer imports or exposes challenge methods.
- Existing mobile tests pass.
- Mobile typecheck passes.
