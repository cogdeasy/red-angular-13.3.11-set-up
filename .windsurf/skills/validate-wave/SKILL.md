---
name: validate-wave
description: Run the quality gate for a completed migration wave. Validates E2E parity, visual regression, accessibility, performance budgets, and produces a Go/No-Go report before proceeding to the next wave.
---

# Validate Wave

Run this skill after all routes in a migration wave have been migrated. Produces a Go/No-Go decision.

## Inputs

- **wave_number**: 1-5
- **routes_in_wave**: List of route paths included in this wave

## Steps

### 1. Run Full E2E Suite

Execute Playwright tests against both Angular (port 4200) and React (port 5173). All tests must pass on both.

```bash
npx playwright test --project=angular
npx playwright test --project=react
```

Compare results — React pass rate must equal Angular pass rate.

### 2. Visual Regression

Run Chromatic or Percy visual diff for every migrated page at 3 viewports:

- Desktop: 1920×1080
- Tablet: 768×1024
- Mobile: 375×812

Acceptance: < 0.1% pixel diff per page.

### 3. Accessibility Audit

Run axe-core on every migrated route:

```bash
npx playwright test --project=a11y
```

Acceptance criteria:

- Zero critical violations
- Zero serious violations
- Keyboard navigation fully functional
- Screen reader announcements correct

### 4. Performance Audit

Run Lighthouse CI on every migrated route:

| Metric | Budget |
|--------|--------|
| FCP | < 1.5s |
| LCP | < 2.5s |
| CLS | < 0.1 |
| TBT | < 200ms |
| Bundle (per route) | < 50 KB gzipped |

React must meet or beat Angular baselines.

### 5. Test Coverage Check

Run Vitest with coverage:

```bash
npx vitest run --coverage
```

Acceptance:

- Statements ≥ 80%
- Branches ≥ 75%
- Functions ≥ 80%
- Lines ≥ 80%

### 6. Feature Flag Validation

For each route in the wave:

- Toggle flag ON → React version loads, all tests pass
- Toggle flag OFF → Angular version loads, all tests pass
- Toggle mid-session → no crash, state preserved where possible

### 7. Produce Go/No-Go Report

Generate `docs/wave-{N}-report.md` with:

- Test results summary (pass/fail counts)
- Visual regression screenshots
- Accessibility scan results
- Performance metrics vs budgets
- Coverage report
- Feature flag test results
- **Decision**: GO or NO-GO with rationale
- **Blockers** (if NO-GO): List of items that must be fixed

### 8. Update Migration Tracker

Update `docs/migration-tracker.md`:

- Mark wave as VALIDATED or BLOCKED
- Record validation date
- Link to wave report

## Decision Matrix

| Criteria | GO | NO-GO |
|----------|-----|--------|
| E2E tests | 100% pass | Any failure |
| Visual diff | < 0.1% | ≥ 0.1% |
| Accessibility | Zero critical/serious | Any critical/serious |
| Performance | All within budget | Any over budget |
| Coverage | Meets thresholds | Below thresholds |
| Feature flags | All toggle correctly | Any toggle failure |
