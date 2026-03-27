# Architectural Decision Records — HSBC Loans Portal Migration

---

## ADR-001: Target React 18.3.x LTS (Not React 19)

**Status**: Accepted
**Date**: 2026-03-27

### Context
React 19 is available but the ecosystem (TanStack Query, React Router, testing libraries)
has not fully stabilized around it. The HSBC Loans Portal needs a stable, well-documented target.

### Decision
Target React 18.3.x (latest LTS). Upgrade to React 19 as a separate, smaller effort
after migration is complete.

### Consequences
- Stable ecosystem with mature documentation
- All third-party libraries fully compatible
- Upgrade to React 19 is a minor effort (mostly opt-in features)
- Miss React 19 features (use(), Server Components) — not needed for this app

---

## ADR-002: single-spa for Coexistence

**Status**: Accepted
**Date**: 2026-03-27

### Context
During migration, Angular and React must coexist. Options considered:
1. **single-spa** — Microfrontend framework for route-level switching
2. **Module Federation** — Webpack 5 feature, but Angular 13 uses older Webpack
3. **Web Components** — Wrap React in custom elements
4. **iframe** — Isolate completely

### Decision
Use single-spa for route-level coexistence with feature flags.

### Rationale
- single-spa has proven Angular + React support (Crunch-IS case study)
- Route-level granularity matches our migration wave strategy
- Feature flags enable gradual rollout per route
- Angular 13's Webpack version doesn't support Module Federation cleanly
- Web Components add serialization overhead for complex state
- iframes are too isolated for shared auth/navigation

### Consequences
- Additional ~20KB bundle overhead during coexistence
- Need to handle zone.js isolation
- Shared state via localStorage + custom events (not ideal, but sufficient for mock data)
- single-spa removed entirely in Wave 5

---

## ADR-003: Zustand for Client State (Not Redux, Not Jotai)

**Status**: Accepted
**Date**: 2026-03-27

### Context
Need a client-side state management solution for notifications and other UI state.
Options: Redux Toolkit, Zustand, Jotai, Recoil, Context API only.

### Decision
Use Zustand for client state management.

### Rationale
- Minimal boilerplate (NotificationService has 3 methods → 3 Zustand actions)
- No providers needed (unlike Context or Redux)
- TypeScript-first with excellent inference
- 1KB bundle size (vs Redux Toolkit ~12KB)
- Simple mental model for Angular developers (imperative mutations via `set`)
- HSBC Loans has very little global client state (just notifications)

### Consequences
- Team needs to learn Zustand patterns (simple, ~1 day)
- Not overkill — appropriate for the small amount of client state
- Easy to migrate to Redux if the app grows significantly
- Auth state stays in React Context (more appropriate for provider-based auth)

---

## ADR-004: Vite 5 for Build Tooling (Not Webpack, Not Turbopack)

**Status**: Accepted
**Date**: 2026-03-27

### Context
Angular 13 uses @angular-devkit/build-angular (Webpack). Need a build tool for React.
Options: Webpack 5, Vite, Turbopack, Parcel, esbuild.

### Decision
Use Vite 5 as the build tool for the React application.

### Rationale
- 10-100x faster dev server than Webpack (native ESM)
- First-class React + TypeScript support
- Built-in code splitting per route (matches Angular's lazy loading)
- vite-plugin-checker for TypeScript type checking during dev
- Excellent production optimization (Rollup-based)
- Growing ecosystem and community support

### Consequences
- Dev server on port 5173 (Angular stays on 4200)
- Some Webpack-specific configs don't transfer (but few in this project)
- SCSS support via sass package (same as Angular)
- Production builds significantly faster than Angular CLI

---

## ADR-005: React Hook Form + Zod (Not Formik, Not Native)

**Status**: Accepted
**Date**: 2026-03-27

### Context
The Loan Application component has a complex 4-step wizard with 3 FormGroups and
extensive validation. Need a form library that supports multi-step patterns.

### Decision
Use React Hook Form with Zod for validation.

### Rationale
- Uncontrolled inputs by default (better performance than Formik)
- Schema-based validation with Zod (closest to Angular's declarative Validators)
- Multi-step wizard pattern well-documented
- TypeScript inference from Zod schemas (type-safe forms)
- @hookform/resolvers provides Zod integration
- Smaller bundle than Formik

### Consequences
- Different mental model from Angular reactive forms (uncontrolled vs controlled)
- Team needs training on RHF + Zod patterns (Week 3 of training plan)
- Multi-step state sharing via useFormContext or lifted state
- Zod schemas serve as both validation AND TypeScript types

---

## ADR-006: Vitest + Playwright (Not Jest + Cypress)

**Status**: Accepted
**Date**: 2026-03-27

### Context
Angular uses Karma + Jasmine. Need testing tools for React.
Options: Jest + Cypress, Vitest + Playwright, Jest + Playwright.

### Decision
Use Vitest for unit/integration tests and Playwright for E2E tests.

### Rationale
- Vitest: Native Vite integration, same config, 2-10x faster than Jest
- Vitest: Jest-compatible API (easy transition for team)
- Playwright: Multi-browser support (Chromium, Firefox, WebKit)
- Playwright: Same test file can run against both Angular and React (parity testing)
- Playwright: Better auto-waiting and reliability than Cypress
- Both tools have excellent TypeScript support

### Consequences
- Karma + Jasmine tests don't need to be ported (Angular tests stay as-is during coexistence)
- New React tests use Vitest + React Testing Library
- E2E tests use Playwright and are framework-agnostic
- Team learns two new testing tools (familiar API reduces learning curve)

---

## ADR-007: TanStack Query for Server State (Not SWR, Not Custom)

**Status**: Accepted
**Date**: 2026-03-27

### Context
Angular uses RxJS Observables in services for data fetching. Need a server state
management solution for React.

### Decision
Use TanStack Query (React Query) v5 for all server state.

### Rationale
- Declarative data fetching with automatic caching
- Built-in loading, error, and success states (replaces manual isLoading flags)
- Automatic refetch on window focus, reconnect
- Optimistic updates for mutations (loan application submission)
- DevTools for debugging cache state
- Replaces the forkJoin pattern with parallel queries (automatic)
- Query invalidation on mutation (e.g., invalidate loans after submitApplication)

### Consequences
- Team needs to learn query keys, stale time, cache time concepts
- Mock data via MSW handlers (not in-memory like Angular services)
- Query client provider at app root
- Query keys: `['loans']`, `['loans', id]`, `['dashboard-stats']`, `['user']`
