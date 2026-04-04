# 05 - Testing and Quality

## Current Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Minimum CI Gate (recommended)

Run in order:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run test`
5. `npm run build`

## GitHub CI

Workflow file: `.github/workflows/frontend-ci.yml`

It executes the same quality gate (`typecheck`, `lint`, `test`, `build`) on:

- pull requests touching frontend files
- pushes to `main` touching frontend files

## What Is Covered Today

- TypeScript static checks
- ESLint baseline
- Vitest baseline utilities test (`src/lib/format.test.ts`)

## What Should Be Added Next

- Service/API contract tests with mocked responses
- Route guard behavior tests
- Critical page smoke tests (auth, pricing, account)
- Security-focused tests:
  - unauthorized API responses
  - plan-based forbidden responses
  - CSRF failure handling

## Bug Fix Checklist

- [ ] Reproduced with exact route and payload
- [ ] Added/updated test if logic bug
- [ ] Confirmed no regression via quality commands
- [ ] Updated docs if API shape changed
