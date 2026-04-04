# 06 - Debug Runbook

## 1) App loads but shows empty blocks

Checklist:

- Confirm backend is running.
- Confirm `VITE_API_BASE_URL` points to correct gateway.
- Check browser network tab for failing endpoints.
- Validate CORS and cookie policy on backend.

## 2) Always redirected to login

Likely causes:

- Missing/expired session cookie
- `GET /auth/session` returning `401`
- Cookie attributes not compatible with environment

What to verify:

- `Set-Cookie` includes expected flags (`HttpOnly`, `Secure`, `SameSite`).
- Domain/path match frontend URL.

## 3) Forbidden access on paid pages

- Confirm user plan in `/auth/session` payload.
- Confirm backend endpoint authorization policy.
- Confirm route guard expectations in `src/app/routes.ts`.

## 4) Save buttons fail silently

- Check `POST/PUT/PATCH` response status.
- Verify CSRF endpoint and token acceptance.
- Confirm payload shape matches backend contract.

## 5) Checkout doesn’t open

- Validate `POST /billing/checkout-session` response includes `checkoutUrl`.
- Ensure backend creates checkout session server-side.
- Confirm plan IDs and billing cycle values are accepted.

## 6) Large bundle warnings in build

- Current baseline still has large chunk warning.
- Next optimization step: route-level lazy imports.

## 7) Useful Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```
