# Workflow 4 — Validate Wave Completion

Quality gate validation after completing a migration wave. Ensures all routes in the wave meet acceptance criteria before proceeding.

- **Phase**: 2–4 — Migration Waves (end of each wave)
- **Duration**: 2–3 days per wave
- **Repeat**: Yes (once per wave)

## Inputs

| Input | Value |
|-------|-------|
| `wave_number` | 1–5 |
| Migration tracker | `docs/migration-tracker.md` |
| Performance baseline | `assessment/performance_baseline.md` |
| Test baseline | `assessment/test_baseline.md` |

## Outputs

- `docs/wave-{N}-report.md`
- `docs/wave-{N}-regression-report.md`
- `docs/wave-{N}-go-nogo-decision.md`

## Wave Definitions

| Wave | Name | Routes | Components | Effort | Risk |
|------|------|--------|------------|--------|------|
| 1 | Leaf Pages | `/login`, `/profile` | LoginComponent, ProfileComponent | 5–7 days | Low |
| 2 | Read-Only Pages | `/dashboard`, `/loan-status` | DashboardComponent, LoanStatusComponent | 7–10 days | Medium |
| 3 | Interactive Pages | `/loan-calculator` | LoanCalculatorComponent | 5–7 days | Medium |
| 4 | Complex Pages | `/loan-application` | LoanApplicationComponent | 7–10 days | High |
| 5 | Shell & Cleanup | All (shell components) | AppComponent, HeaderComponent, SidebarComponent, FooterComponent, LoadingSpinnerComponent | 5–7 days | Medium |

## Steps

### 1. Verify All Routes Migrated

Check that every route assigned to this wave has been migrated and marked complete in the migration tracker.

**Acceptance criteria:**
- All routes in wave have completed /workflow-3-migrate-route
- Migration tracker shows 100% for this wave
- All PRs merged

### 2. Run Full Unit Test Suite

Run Vitest for all React components, not just the wave's components.

**Acceptance criteria:**
- All unit tests pass
- Coverage >= baseline for migrated components
- No regressions in previously migrated components

### 3. Run E2E Parity Tests

Run Playwright E2E suite against both Angular and React versions.

**Acceptance criteria:**
- All E2E tests pass against React
- All E2E tests still pass against Angular
- No behavioral differences detected

### 4. Full Visual Regression Check

Run Chromatic/Percy across all migrated routes.

**Acceptance criteria:**
- Zero unintended visual diffs
- All intentional changes documented and approved
- Desktop, tablet, and mobile viewports checked

### 5. Full Accessibility Audit

Run axe-core across all migrated routes.

**Acceptance criteria:**
- Zero critical violations
- Zero serious violations
- Keyboard navigation works end-to-end
- Screen reader experience verified

### 6. Performance Comparison

Compare React performance against Angular baseline.

| Metric | Requirement |
|--------|-------------|
| FCP | Must be <= Angular baseline + 10% |
| LCP | Must be <= Angular baseline + 10% |
| CLS | Must be < 0.1 |
| TBT | Must be <= Angular baseline |
| Bundle size | Must be within 15% of Angular |

**Acceptance criteria:**
- All Lighthouse metrics meet budgets
- Bundle size within tolerance
- No performance regressions

### 7. Bundle Size Analysis

Analyze bundle composition and identify any oversized chunks.

**Acceptance criteria:**
- Route-level code splitting working
- No single chunk > 250KB (gzipped)
- Tree-shaking effective (no unused code)
- Bundle size trend documented

### 8. Cross-Framework Integration Test

Test that Angular and React coexist without issues.

**Acceptance criteria:**
- Navigation between Angular and React routes works
- Auth state shared correctly
- No JavaScript errors in console
- No style conflicts
- Feature flags toggle correctly

### 9. Stakeholder Demo

Demo the migrated routes to stakeholders and collect feedback.

**Acceptance criteria:**
- All migrated routes demonstrated
- Feedback documented
- No blocking issues raised
- Sign-off obtained

### 10. Go/No-Go Decision

Formal decision on whether to proceed to the next wave.

**GO criteria:**
- All unit tests pass
- All E2E tests pass
- Visual regression approved
- Accessibility audit clean
- Performance within budgets
- Stakeholder sign-off obtained
- No critical bugs outstanding

**NO-GO criteria:**
- Any critical test failure
- Performance regression > 15%
- Accessibility critical/serious violations
- Stakeholder blocking feedback

**Acceptance criteria:**
- Decision documented in `wave-{N}-go-nogo-decision.md`
- If GO, next wave can begin
- If NO-GO, remediation plan created
