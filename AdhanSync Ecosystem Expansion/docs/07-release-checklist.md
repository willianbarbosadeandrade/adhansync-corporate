# 07 - Release Checklist

## Pre-Release

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] GitHub `Frontend CI` workflow is green
- [ ] No secrets committed (`.env`, keys, tokens)
- [ ] API base URL configured per environment
- [ ] Security review of auth/billing changes completed

## API Readiness

- [ ] Backend endpoints match documented contracts
- [ ] Error contract implemented consistently
- [ ] CSRF protection active for mutating routes
- [ ] Authorization rules active for paid/admin endpoints

## Billing Readiness

- [ ] Checkout session endpoint returns valid URL
- [ ] Customer portal endpoint configured
- [ ] Webhook handling verified backend-side

## Observability

- [ ] Frontend error monitoring enabled
- [ ] Backend auth/payment logs monitored
- [ ] Incident response owner assigned

## Post-Release

- [ ] Smoke test login, account, pricing, admin
- [ ] Verify role/plan restrictions in production
- [ ] Verify billing redirects in production
