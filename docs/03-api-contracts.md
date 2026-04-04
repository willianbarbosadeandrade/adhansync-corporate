# 03 - API Contracts (Frontend Expectations)

Base URL: `VITE_API_BASE_URL` (default `/api/v1`)

All responses are JSON.
All mutating endpoints must require authenticated session and CSRF validation.

## Auth

## `GET /auth/session`
Returns active session user.

```json
{
  "user": {
    "id": "usr_123",
    "name": "Fatima Ali",
    "email": "fatima@company.com",
    "company": "Acme Corp",
    "location": "Doha, Qatar",
    "plan": "enterprise",
    "planLabel": "Enterprise",
    "roles": ["admin"]
  }
}
```

## `POST /auth/login`
Request:

```json
{ "email": "fatima@company.com", "password": "***" }
```

Response: same as `/auth/session`.

## `POST /auth/logout`
Response:

```json
{ "message": "Logged out" }
```

## Billing

## `GET /billing/plans`

```json
[
  {
    "id": "personal",
    "name": "Personal",
    "description": "...",
    "highlighted": false,
    "currency": "USD",
    "monthlyPriceCents": 500,
    "yearlyPriceCents": 4900,
    "features": ["..."]
  }
]
```

## `POST /billing/checkout-session`
Request:

```json
{ "planId": "professional", "billingCycle": "monthly" }
```

Response:

```json
{ "checkoutUrl": "https://checkout.stripe.com/..." }
```

## `POST /billing/customer-portal`
Response:

```json
{ "checkoutUrl": "https://billing.stripe.com/..." }
```

## Account

## `GET /account`
Returns `AccountData` shape used in `src/app/types/domain.ts`.

## `PATCH /account/profile`
Request:

```json
{ "name": "...", "email": "...", "company": "...", "location": "..." }
```

Response: full updated `AccountData`.

## `POST /account/compliance-report`

```json
{ "message": "Report generated" }
```

## `POST /account/download-installer`
Request:

```json
{ "platform": "windows" }
```

Response:

```json
{ "url": "https://cdn.example.com/installer.exe" }
```

## App - Dashboard

## `GET /app/dashboard`
Returns:

- `locationLabel`
- `dateIso`
- `prayers[]`
- `configs` (pause settings)
- `audioEngineStatus`
- `masterVolume`

## App - Schedule

## `GET /app/schedule`
Returns schedule, week/month data, and prayer config map.

## `PUT /app/schedule/config`
Request:

```json
{ "config": { "Fajr": { "pauseBefore": 5, "pauseDuration": 20, "enabled": true } } }
```

## App - Audio

## `GET /app/audio`
Returns `AudioSettingsData`.

## `PUT /app/audio`
Request body must match `AudioSettingsData`.

## `POST /app/audio/simulate-adhan`
Triggers backend simulation event.

## App - Adhan

## `GET /app/adhan`
Returns:

```json
{ "tracks": [ ... ], "activeTrackId": "track_1" }
```

## `PUT /app/adhan/default`

```json
{ "trackId": "track_2" }
```

## App - Analytics

## `GET /app/analytics`
Returns chart-ready analytics datasets.

## App - Settings

## `GET /app/settings`
Returns `AppSettingsData`.

## `PUT /app/settings`
Persists full settings payload.

## `POST /app/settings/location/unlock`

```json
{ "confirmation": "CONFIRM" }
```

## App - Admin

## `GET /app/admin`
Returns department and event datasets.

## `POST /app/admin/sync`

```json
{ "message": "Sync complete" }
```

## `POST /app/admin/export-report`

```json
{ "url": "https://.../report.csv" }
```

## Error Contract (recommended)

```json
{
  "message": "Human readable",
  "code": "ERR_CODE",
  "details": { "field": ["error"] }
}
```
