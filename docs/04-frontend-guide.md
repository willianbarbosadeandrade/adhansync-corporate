# 04 - Frontend Development Guide

## Core Principles

- API first: no hardcoded business data in components.
- Centralized network access through `src/lib/http.ts` and `src/app/services/api.ts`.
- Keep authorization checks in both frontend routes and backend endpoints.

## Adding a New Feature

1. Define/extend domain type in `src/app/types/domain.ts`.
2. Add API method in `src/app/services/api.ts`.
3. Use `useAsyncData` for loading state lifecycle.
4. Render consistent states with:
   - `LoadingBlock`
   - `ErrorBlock`
   - `EmptyBlock`
5. Add tests for non-trivial utility logic.

## UI State Pattern

For data pages:

- `loading`: show loading block
- `error`: show retryable error block
- `success + empty`: show explicit empty state
- `success + data`: render feature

## Route Guard Pattern

- Use `RequireAuth` for authenticated sections.
- Use plan-specific wrappers for restricted pages.
- Do not rely on nav hiding alone.

## Form Guidelines

- Keep form state local.
- Validate required fields client-side for UX.
- Let backend enforce final validation.
- Display backend error messages when available.

## API Error Handling

- Use `getErrorMessage(error, fallback)` from `src/lib/errors.ts`.
- Avoid swallowing errors silently.
- Prefer user-safe messages over raw stack text.

## Performance Recommendations

- Current bundle is large; consider route-level code splitting next.
- Lazy load heavy chart/admin modules first.
- Audit unused dependencies after backend stabilization.

## Files to Know First

- `src/app/routes.ts`
- `src/app/components/AuthContext.tsx`
- `src/lib/http.ts`
- `src/app/services/api.ts`
- `src/app/types/domain.ts`
