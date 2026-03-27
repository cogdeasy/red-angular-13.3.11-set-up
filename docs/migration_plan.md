# Migration Plan — HSBC Loans Portal

## Overview

| Item | Value |
|------|-------|
| Source | Angular 13.3.11 (HSBC Loans Portal) |
| Target | React 18.3.x + Vite 5 + TypeScript 5 |
| Strategy | Strangler Fig (incremental, route-by-route) |
| Coexistence | single-spa with feature flags |
| Timeline | 10-14 weeks (5 waves) |
| Team Size | 2-3 developers |
| Risk Level | Low-Medium |

---

## Timeline

```
Week  1  2  3  4  5  6  7  8  9  10  11  12  13  14
      ├──┤                                              Wave 0: Foundation Setup
      │     ├────┤                                      Wave 1: Login + Profile
      │           ├───────┤                             Wave 2: Dashboard + Loan Status
      │                    ├──────┤                     Wave 3: Loan Calculator
      │                           ├────────┤            Wave 4: Loan Application
      │                                     ├─────┤    Wave 5: Shell + Angular Removal
      └──────────────────────────────────────────────┘
```

---

## Wave 0 — Foundation Setup (Week 1-2)

**Duration**: 5-7 days
**Risk**: Low
**Dependencies**: None

| Task | Effort | Owner |
|------|--------|-------|
| Scaffold React + Vite project | 0.5 day | Dev 1 |
| Install all dependencies | 0.5 day | Dev 1 |
| Configure TypeScript strict + path aliases | 0.5 day | Dev 1 |
| Extract shared types package | 1 day | Dev 1 |
| Migrate HSBC design tokens (SCSS → CSS vars) | 1 day | Dev 2 |
| Implement AuthProvider + useAuth | 1 day | Dev 2 |
| Configure React Router with all routes (placeholders) | 0.5 day | Dev 1 |
| Set up MSW mock API handlers | 1 day | Dev 2 |
| Configure CI pipeline (GitHub Actions) | 0.5 day | Dev 1 |
| Set up single-spa root config | 1 day | Dev 1 + Dev 2 |
| Validate foundation (all routes render placeholders) | 0.5 day | Both |

**Go/No-Go Criteria**:
- React dev server starts without errors
- All 6 routes render placeholder components
- Auth bridge works (login in Angular → React reads state)
- CI pipeline passes
- Design tokens render correctly

---

## Wave 1 — Leaf Pages (Week 3-4)

**Duration**: 5-7 days
**Risk**: Low
**Dependencies**: Foundation complete

| Route | Component | Complexity | Effort | Owner |
|-------|-----------|-----------|--------|-------|
| `/login` | LoginPage | 2/5 | 2-3 days | Dev 1 |
| `/profile` | ProfilePage | 2/5 | 2-3 days | Dev 2 |

### /login Migration Tasks
1. Create LoginPage component with React Hook Form + Zod
2. Wire up useAuth hook (login mutation)
3. Migrate SCSS styles
4. Write unit tests (form validation, auth flow)
5. Write E2E parity test
6. Capture visual regression baseline
7. Run accessibility audit
8. Configure ff_react_login feature flag

### /profile Migration Tasks
1. Create ProfilePage component with view/edit toggle
2. Wire up useAuth hook (current user data)
3. Migrate SCSS styles
4. Write unit tests (view mode, edit mode, save)
5. Write E2E parity test
6. Capture visual regression baseline
7. Run accessibility audit
8. Configure ff_react_profile feature flag

**Go/No-Go Criteria**:
- Both routes render identically to Angular
- Unit test coverage >= 80%
- E2E parity tests pass against both Angular and React
- Zero visual regressions
- Zero accessibility violations

---

## Wave 2 — Read-Only Pages (Week 5-7)

**Duration**: 8-10 days
**Risk**: Medium
**Dependencies**: Wave 1 complete, useLoans hooks ready

| Route | Component | Complexity | Effort | Owner |
|-------|-----------|-----------|--------|-------|
| `/dashboard` | DashboardPage | 3/5 | 4-5 days | Dev 1 |
| `/loan-status` | LoanStatusPage | 3/5 | 4-5 days | Dev 2 |

### /dashboard Migration Tasks
1. Create useDashboardStats and useLoans TanStack Query hooks
2. Create DashboardPage (stats cards, quick actions, loans table)
3. Replace forkJoin with parallel useQuery calls
4. Migrate SCSS styles
5. Write unit tests (loading, data display, navigation)
6. Write E2E parity test
7. Capture visual regression baseline
8. Configure ff_react_dashboard feature flag

### /loan-status Migration Tasks
1. Create LoanStatusPage (filterable list, expandable cards)
2. Implement search and filter logic
3. Implement expandable loan detail view with timeline
4. Migrate SCSS styles
5. Write unit tests (filtering, search, expand/collapse)
6. Write E2E parity test
7. Capture visual regression baseline
8. Configure ff_react_loan_status feature flag

**Go/No-Go Criteria**:
- Data displays accurately (amounts, percentages, dates)
- Filtering and search work correctly
- Loading states render correctly
- Performance: no unnecessary re-renders
- Unit test coverage >= 80%

---

## Wave 3 — Interactive Pages (Week 8-9)

**Duration**: 5-7 days
**Risk**: Medium
**Dependencies**: Wave 2 complete

| Route | Component | Complexity | Effort | Owner |
|-------|-----------|-----------|--------|-------|
| `/loan-calculator` | LoanCalculatorPage | 3/5 | 4-5 days | Dev 1 + Dev 2 |

### /loan-calculator Migration Tasks
1. Create LoanCalculatorPage with controlled inputs
2. Implement real-time calculation (useMemo/useCallback)
3. Migrate SVG donut chart to React
4. Implement amortization schedule with pagination
5. Wire up range sliders with number inputs
6. Migrate SCSS styles
7. Write unit tests (calculations, pagination, chart)
8. Write E2E parity test
9. Capture visual regression baseline
10. Configure ff_react_loan_calculator feature flag

**Key Challenge**: Angular's two-way binding (`[(ngModel)]`) is heavily used.
Each input needs `value` + `onChange` with state updates triggering recalculation.

**Go/No-Go Criteria**:
- Calculations match Angular output exactly
- Real-time updates work without lag
- SVG chart renders correctly
- Amortization pagination works
- Range sliders sync with number inputs

---

## Wave 4 — Complex Pages (Week 9-11)

**Duration**: 7-10 days
**Risk**: High
**Dependencies**: Wave 3 complete

| Route | Component | Complexity | Effort | Owner |
|-------|-----------|-----------|--------|-------|
| `/loan-application` | LoanApplicationPage + 4 steps | 5/5 | 5-7 days | Dev 1 + Dev 2 |

### /loan-application Migration Tasks
1. Create wizard container with step navigation
2. Create PersonalInfoStep (RHF + Zod)
3. Create EmploymentStep (RHF + Zod)
4. Create LoanDetailsStep (RHF + Zod)
5. Create ReviewStep with summary view
6. Implement cross-step data sharing (FormProvider or lifted state)
7. Implement step validation and navigation guards
8. Implement estimated monthly payment calculation
9. Wire up useSubmitApplication mutation
10. Migrate SCSS styles
11. Write unit tests per step + integration test for full flow
12. Write E2E parity test (full wizard completion)
13. Capture visual regression baseline per step
14. Configure ff_react_loan_application feature flag

**Key Challenge**: 3 FormGroups in Angular → 3 useForm instances or 1 large form
with step-level validation. Recommend: separate useForm per step with shared context.

**Go/No-Go Criteria**:
- All 4 steps render correctly
- Validation works per step and cross-step
- Data preserved when navigating back
- Submit creates loan application
- Estimated payment calculation accurate
- Full wizard E2E test passes

---

## Wave 5 — Shell & Angular Removal (Week 12-14)

**Duration**: 5-7 days (shell) + 3-5 days (removal)
**Risk**: Medium
**Dependencies**: Waves 1-4 complete

### Shell Component Migration (5-7 days)
| Component | Complexity | Effort | Owner |
|-----------|-----------|--------|-------|
| AppShell | 3/5 | 2-3 days | Dev 1 |
| Header | 3/5 | 2-3 days | Dev 2 |
| Sidebar | 2/5 | 1-2 days | Dev 1 |
| Footer | 1/5 | 0.5 day | Dev 2 |
| LoadingSpinner | 1/5 | 0.5 day | Dev 2 |

### Angular Removal (3-5 days)
1. Remove all feature flags (make React permanent)
2. Remove single-spa bridge
3. Remove Angular dependencies from package.json
4. Delete Angular source files
5. Clean up configuration files
6. Consolidate project structure
7. Run full test suite
8. Final performance audit
9. Final accessibility audit
10. Archive Angular codebase (git tag)
11. Produce final migration report

---

## Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|-----------|
| R1 | Angular Material visual differences | Medium | Medium | Chromatic/Percy snapshots per component, pixel-perfect validation |
| R2 | Multi-step form state management | Medium | High | Prototype wizard pattern in Wave 0, use FormProvider |
| R3 | Two-framework bundle size during coexistence | Medium | Medium | Monitor with vite-plugin-visualizer, set size budgets |
| R4 | zone.js interference with React | Low | High | Isolate React from Angular's zone in single-spa config |
| R5 | Team Angular→React learning curve | Medium | Medium | 4-week training plan (SKILLS.md), pair programming |
| R6 | Mock data drift between frameworks | Low | Medium | Shared MSW handlers, single source of truth |
| R7 | SVG chart migration complexity | Low | Low | Simple SVG, no heavy charting library dependency |
| R8 | Performance regression | Low | Medium | Lighthouse CI budgets, automatic blocking on regression |

## Dependencies Between Waves

```
Wave 0 (Foundation)
  ├── Wave 1 (Leaf Pages) ──── depends on: AuthProvider, design tokens
  │     └── Wave 2 (Read-Only) ──── depends on: useLoans hooks
  │           └── Wave 3 (Interactive) ──── depends on: calculation utils
  │                 └── Wave 4 (Complex) ──── depends on: all patterns proven
  │                       └── Wave 5 (Shell & Cleanup) ──── depends on: all routes migrated
  └── shared-types package (used by all waves)
```

## Rollback Strategy

Each wave can be rolled back independently via feature flags:
1. Set `ff_react_{route}` to `false` for affected routes
2. Angular version immediately serves that route
3. No deployment needed — flag change only
4. React code stays in codebase, fix and re-enable

**Full rollback**: Set ALL flags to false → entire app served by Angular.
