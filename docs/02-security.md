# 02 - Security Baseline

## Security Objectives

- Protect customer account and subscription data.
- Prevent unauthorized feature and plan access.
- Avoid frontend exposure of secrets and payment-sensitive logic.
- Keep backend as the policy enforcement authority.

## Implemented on Frontend

## 1) Session-Based Auth (No hardcoded credentials)

- Removed all demo users and plaintext passwords from frontend.
- Authentication is API-driven through `/auth/login` and `/auth/session`.
- Frontend does not persist auth tokens in storage.

## 2) Route-Level Authorization

- `/app/*` requires authenticated session.
- `/app/analytics` requires Professional+.
- `/app/admin` requires Enterprise.
- This closes the previous gap where restricted pages were only hidden in nav.

## 3) Secure HTTP Client

`src/lib/http.ts` enforces:

- request timeout
- `credentials: include`
- centralized error parsing
- CSRF token injection for mutating requests

## 4) Payment Security Model

Frontend only requests server-generated checkout sessions:

- `POST /billing/checkout-session`
- `POST /billing/customer-portal`

No payment amount calculation or payment key handling is trusted on frontend.

## 5) Data Exposure Reduction

- Removed static customer account datasets and fake billing history.
- All sensitive views now depend on backend responses.

## Backend Requirements (Mandatory)

## Session Cookies

- `HttpOnly`
- `Secure`
- `SameSite=Lax` or stricter
- short TTL + rotation policy

## CSRF

- All mutating endpoints validate CSRF token.
- CSRF token endpoint should be authenticated and rate-limited.

## Authorization

- Enforce role/plan checks server-side on every protected endpoint.
- Never trust frontend plan guard as source of truth.

## Payment

- Create checkout sessions server-side only.
- Validate product/price IDs server-side.
- Verify webhook signatures before mutating subscription state.

## Input Validation

- Validate and sanitize all request payloads server-side.
- Reject unknown fields where possible.

## Logging & Privacy

- Never log passwords, session tokens, or full card details.
- Mask PII in error logs.

## Recommended Security Headers (at gateway/backend)

- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security`

## Secure SDLC Checklist

- [ ] Threat model updated for auth + billing
- [ ] API schema validation in place
- [ ] Authz tests for all protected endpoints
- [ ] CSRF tests for mutating routes
- [ ] Webhook signature validation for payment provider
- [ ] Dependency audit in CI
