# 01 - Architecture

## Goal

Provide a maintainable frontend baseline that can be safely integrated with a backend team delivering auth, billing, operational APIs, and enterprise controls.

## High-Level Structure

```text
src/
  app/
    components/
      common/              # shared state UI blocks (loading/error/empty)
      app/                 # authenticated app pages
    hooks/
      useAsyncData.ts      # standard async loading lifecycle
    services/
      api.ts               # typed backend API calls
    types/
      domain.ts            # canonical frontend domain types
    routes.ts              # route map + auth/plan guards
  lib/
    env.ts                 # environment normalization
    http.ts                # secure HTTP client wrapper
    errors.ts              # typed API errors
    format.ts              # formatting utilities
```

## Data Flow

1. UI component triggers `api.ts` function.
2. `api.ts` calls `http.ts`.
3. `http.ts` applies:
   - base URL from env
   - credentials policy (`include`)
   - timeout
   - CSRF header on mutating requests
   - consistent error parsing
4. Component receives typed response and renders.

## Auth & Authorization Flow

- Session bootstrap happens in `AuthProvider` via `GET /auth/session`.
- Login is performed via `POST /auth/login`.
- Logout is performed via `POST /auth/logout`.
- Route-level protection:
  - `RequireAuth` for `/app/*`
  - `RequireProfessionalPlan` for `/app/analytics`
  - `RequireEnterprisePlan` for `/app/admin`
- UI-level navigation restrictions are additive; backend remains source of truth.

## API-Driven Pages

All major business pages are now backend-driven:

- Pricing: plans + checkout session
- Account: profile, devices, billing, downloads
- Dashboard: prayers and audio engine status
- Schedule: prayer config and calendar data
- Audio: audio source policy and persistence
- Adhan: library and default track
- Analytics: chart data
- Settings: location/system/notification config
- Admin: departments, events, sync/export actions

## Non-Goals

- Backend business rules are not implemented in frontend.
- Payment finalization logic is not in frontend.
- Frontend does not store secrets.
