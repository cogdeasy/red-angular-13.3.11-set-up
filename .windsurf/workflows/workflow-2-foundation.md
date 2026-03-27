# Workflow 2 — Foundation Setup

Scaffold the React 18 project alongside the Angular app, set up single-spa bridge, shared types, design tokens, auth bridge, and CI pipeline.

- **Phase**: 1 — Foundation
- **Duration**: 1–2 weeks
- **Repeat**: No

## Inputs

| Input | Value |
|-------|-------|
| Migration plan | `docs/migration_plan.md` |
| Component inventory | `assessment/component_inventory.csv` |
| Dependency map | `assessment/dependency-map.csv` |
| Performance baseline | `assessment/performance_baseline.md` |
| Angular styles | `src/styles.scss` |
| Coexistence strategy | single-spa |

## Outputs

- `react-app/` — Vite + React 18 + TypeScript project
- `packages/shared-types/` — Shared TypeScript interfaces
- single-spa root config — Coexistence bridge
- `react-app/src/styles/tokens.css` — HSBC design tokens
- `react-app/src/providers/AuthProvider.tsx` — Auth bridge
- `.github/workflows/ci.yml` — CI pipeline

## Steps

### 1. Scaffold React Project

Create React 18 project with Vite, TypeScript strict mode, path aliases.

```bash
npm create vite@latest react-app -- --template react-ts
cd react-app && npm install
```

Configure `tsconfig.json` with `strict: true` and path aliases (`@/`).

**Acceptance criteria:**
- React 18.3.x installed
- Vite 5.x configured
- TypeScript strict mode enabled
- Path aliases working (`@/components`, `@/hooks`, `@/types`, etc.)
- Dev server starts without errors

### 2. Install React Dependencies

Install all React ecosystem dependencies identified in the migration plan.

**Production packages:**
- `react-router-dom@^6.20`
- `@tanstack/react-query@^5`
- `zustand@^4`
- `react-hook-form@^7`
- `zod@^3`
- `@hookform/resolvers@^3`
- `chart.js@^3.7.0`
- `react-chartjs-2@^5`

**Development packages:**
- `vitest@^1`
- `@testing-library/react@^14`
- `@testing-library/jest-dom@^6`
- `@testing-library/user-event@^14`
- `playwright@^1`
- `msw@^2`
- `@axe-core/react@^4`
- `vite-plugin-checker@^0.6`

**Acceptance criteria:**
- All packages installed without conflicts
- No duplicate React versions
- Bundle size within 200KB of Angular baseline

### 3. Extract Shared Types Package

Copy TypeScript interfaces and enums from Angular models to a shared package that both Angular and React can consume.

**Source files:**
- `src/app/shared/models/loan.model.ts` → `packages/shared-types/loan.ts`
- `src/app/shared/models/user.model.ts` → `packages/shared-types/user.ts`

**Types to extract (12):**
Loan, LoanType, LoanStatus, LoanApplication, PersonalInfo, EmploymentInfo, LoanDetails, DocumentInfo, LoanCalculation, AmortizationEntry, DashboardStats, User, Notification.

**Acceptance criteria:**
- All 12 interfaces/enums extracted
- Both Angular and React import from shared package
- No type duplication

### 4. Migrate HSBC Design Tokens

Convert SCSS variables from `styles.scss` to CSS custom properties.

| SCSS Variable | CSS Custom Property |
|--------------|-------------------|
| `$hsbc-red: #DB0011` | `--hsbc-red: #DB0011` |
| `$hsbc-red-dark: #AF000D` | `--hsbc-red-dark: #AF000D` |
| `$hsbc-red-light: #FF1A2C` | `--hsbc-red-light: #FF1A2C` |
| `$hsbc-black: #333333` | `--hsbc-black: #333333` |
| `$hsbc-dark-gray: #575757` | `--hsbc-dark-gray: #575757` |
| `$hsbc-medium-gray: #767676` | `--hsbc-medium-gray: #767676` |
| `$hsbc-light-gray: #D7D8D6` | `--hsbc-light-gray: #D7D8D6` |
| `$hsbc-pale-gray: #F3F3F3` | `--hsbc-pale-gray: #F3F3F3` |
| `$hsbc-white: #FFFFFF` | `--hsbc-white: #FFFFFF` |
| `$hsbc-success: #00847F` | `--hsbc-success: #00847F` |
| `$hsbc-warning: #F2A900` | `--hsbc-warning: #F2A900` |
| `$hsbc-error: #DB0011` | `--hsbc-error: #DB0011` |
| `$hsbc-info: #0073CF` | `--hsbc-info: #0073CF` |

**Acceptance criteria:**
- All 13 color tokens migrated
- All spacing tokens migrated (`$spacing-xs` through `$spacing-xxl`)
- All typography tokens migrated
- All shadow tokens migrated
- Visual diff shows zero regression

### 5. Implement Auth Bridge

Create AuthProvider that shares auth state with Angular via localStorage. Both Angular AuthService and React useAuth read/write the same `hsbc_auth` key.

**Angular contract:**
- Storage key: `hsbc_auth`
- Check on init: `localStorage.getItem('hsbc_auth')`
- Set on login: `localStorage.setItem('hsbc_auth', 'true')`
- Clear on logout: `localStorage.removeItem('hsbc_auth')`

**React implementation:**
- Provider: `AuthProvider.tsx`
- Hook: `useAuth.ts`
- Context value: `{ user, isAuthenticated, login, logout }`

**Acceptance criteria:**
- Login in Angular → React reads auth state correctly
- Login in React → Angular reads auth state correctly
- Logout in either framework clears state in both
- No auth flicker during navigation

### 6. Configure React Router

Set up React Router 6 with the same URL structure as Angular.

| Path | Component | Auth Required | Lazy |
|------|-----------|--------------|------|
| `/login` | LoginPage | No | Yes |
| `/dashboard` | DashboardPage | Yes | Yes |
| `/loan-application` | LoanApplicationPage | Yes | Yes |
| `/loan-calculator` | LoanCalculatorPage | Yes | Yes |
| `/loan-status` | LoanStatusPage | Yes | Yes |
| `/profile` | ProfilePage | Yes | Yes |
| `/` | Redirect → `/login` | — | — |
| `*` | Redirect → `/login` | — | — |

**Acceptance criteria:**
- All 6 routes accessible
- Auth guard redirects to `/login` when not authenticated
- Lazy loading working (separate chunks per route)
- URL structure identical to Angular app

### 7. Set Up MSW Mock API

Replicate Angular's in-memory mock data as MSW handlers.

| Handler | Description |
|---------|-------------|
| `POST /api/auth/login` | Mock user (James Chen) |
| `GET /api/loans` | 5 mock loans |
| `GET /api/loans/:id` | Single loan |
| `GET /api/dashboard/stats` | Dashboard stats |
| `POST /api/loans/apply` | Create loan |
| `POST /api/loans/calculate` | Amortization calculation |

**Acceptance criteria:**
- All mock handlers return same data as Angular services
- MSW active in development and test environments
- API contract documented in OpenAPI format

### 8. Configure CI Pipeline

GitHub Actions workflow for build, test, lint, and performance checks.

**Jobs:**
1. `lint` — ESLint + Prettier check
2. `typecheck` — `tsc --noEmit`
3. `unit-test` — `vitest run --coverage`
4. `build` — `vite build`
5. `bundle-size` — Compare against baseline
6. `lighthouse` — Performance audit

**Acceptance criteria:**
- CI runs on every PR
- All jobs pass on clean React scaffold
- Coverage thresholds configured
- Bundle size check configured

### 9. Configure single-spa Bridge

Set up single-spa root config to mount Angular and React apps side by side.

**Acceptance criteria:**
- Angular app mounts at all current routes
- React app mounts behind feature flags
- Route-level switching works via feature flags
- No JavaScript conflicts between frameworks
- Shared dependencies (zone.js awareness) handled

### 10. Validate Foundation

End-to-end validation that the foundation is solid before starting migration.

**Acceptance criteria:**
- React dev server starts without errors
- All routes render placeholder components
- Auth bridge works bidirectionally
- Design tokens render correctly
- CI pipeline passes
- Lighthouse baseline captured for React shell
