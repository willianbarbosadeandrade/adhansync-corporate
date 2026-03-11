# 08 - Backend Handoff Guide

## Context

Frontend is prepared for real backend integration and no longer depends on mock business data.

## Priority Tasks for Backend Team

1. Implement all endpoints listed in `docs/03-api-contracts.md`.
2. Enforce auth + authorization server-side.
3. Implement CSRF issuance + validation.
4. Implement billing session and portal endpoints.
5. Return stable error contract (`message`, `code`, `details`).

## Contract Ownership

- Frontend contract source: `src/app/types/domain.ts`
- Transport contract source: `docs/03-api-contracts.md`

When changing payloads:

- Update backend schema
- Update `domain.ts`
- Update service methods in `api.ts`
- Update docs and changelog

## Security Acceptance Criteria

- Session cookies are secure and rotated
- CSRF required on mutating routes
- Unauthorized responses are consistent (`401`/`403`)
- Plan restrictions enforced on backend for analytics/admin
- Checkout sessions generated server-side only

## Recommended First Integration Sequence

1. Auth endpoints (`/auth/session`, `/auth/login`, `/auth/logout`)
2. Billing plans + checkout endpoints
3. Account aggregate endpoint
4. Dashboard/schedule/audio
5. Adhan/analytics/settings/admin

## Debugging Integration Mismatches

- Compare payloads with `domain.ts`
- Check browser network status codes and response JSON
- Use `ErrorBlock` output to validate error messaging
