# AdhanSync Corporate Frontend

Frontend web application for AdhanSync corporate operations.

This repository is now structured as a production-ready frontend baseline:
- No demo credentials or hardcoded account data.
- All business data is loaded from backend API endpoints.
- Authentication is session-based (cookie) with route-level authorization.
- Billing actions are backend-driven (checkout sessions and customer portal).

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Sonner

## Prerequisites

- Node.js 20+
- npm 10+

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Default local URL: `http://localhost:5173`

## Environment Variables

See `.env.example`:

- `VITE_API_BASE_URL` (default: `/api/v1`)
- `VITE_REQUEST_TIMEOUT_MS` (default: `15000`)

## Available Scripts

- `npm run dev`: start local dev server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run typecheck`: TypeScript validation
- `npm run lint`: ESLint
- `npm run test`: Vitest

## CI

GitHub Actions workflow: `.github/workflows/frontend-ci.yml`

Pipeline gate:
- typecheck
- lint
- test
- build

## Documentation Index

Full technical documentation is in [`docs/`](./docs):

- `docs/01-architecture.md`
- `docs/02-security.md`
- `docs/03-api-contracts.md`
- `docs/04-frontend-guide.md`
- `docs/05-testing-quality.md`
- `docs/06-debug-runbook.md`
- `docs/07-release-checklist.md`
- `docs/08-handoff-backend.md`

## Security Notes

- Do not store access tokens in `localStorage`.
- Backend must issue secure HTTP-only session cookies.
- Mutating endpoints must validate CSRF token.
- Plan and role enforcement must happen on backend for every protected endpoint.
