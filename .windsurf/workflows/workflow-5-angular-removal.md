# Workflow 5 — Angular Removal & Finalization

Remove Angular framework, single-spa bridge, and all coexistence infrastructure. Produce a pure React 18 application.

- **Phase**: 5 — Angular Removal
- **Duration**: 1–2 weeks
- **Repeat**: No

## Prerequisites

- All 5 wave reports show GO decision
- Migration tracker shows 100% migrated
- Production metrics stable for 2+ weeks with React serving all routes
- Zero critical bugs in React version

## Inputs

| Input | Value |
|-------|-------|
| All wave reports | `docs/wave-*-go-nogo-decision.md` (all must be GO) |
| Migration tracker | `docs/migration-tracker.md` (100% migrated) |
| Production metrics | 2+ weeks stable with React serving 100% traffic |

## Outputs

- Pure React 18 application (no Angular, no single-spa)
- `docs/final-migration-report.md`
- Git tag: `angular-archive-v1.0`

## Steps

### 1. Pre-Removal Audit

Final comprehensive check before removing Angular.

**Acceptance criteria:**
- All routes serving from React (feature flags all ON)
- Zero traffic to Angular routes
- All E2E tests pass against React-only
- Performance metrics stable
- No Angular-specific error logs in production

### 2. Remove Feature Flags

Remove all `ff_react_*` feature flags and make React the permanent route handler.

**Flags to remove:**
- `ff_react_login`
- `ff_react_dashboard`
- `ff_react_loan_application`
- `ff_react_loan_calculator`
- `ff_react_loan_status`
- `ff_react_profile`

**Acceptance criteria:**
- All feature flag code removed
- React routes are direct (no conditional logic)
- No dead code paths

### 3. Remove single-spa Bridge

Remove single-spa root config, Angular app registration, and bridge code.

**Acceptance criteria:**
- single-spa dependency removed
- Root config removed
- Angular app registration removed
- React app runs standalone

### 4. Remove Angular Dependencies

Remove all Angular packages from `package.json`.

**Packages to remove:**
- `@angular/animations`, `@angular/cdk`, `@angular/common`, `@angular/compiler`
- `@angular/core`, `@angular/forms`, `@angular/material`
- `@angular/platform-browser`, `@angular/platform-browser-dynamic`, `@angular/router`
- `@angular-devkit/build-angular`, `@angular-eslint/*`, `@angular/cli`, `@angular/compiler-cli`
- `ng2-charts`, `zone.js`
- `karma`, `karma-*`, `jasmine-core`, `@types/jasmine`

**Acceptance criteria:**
- Zero Angular packages in `package.json`
- `npm install` succeeds without Angular
- No Angular imports in any source file

### 5. Remove Angular Source Files

Delete all Angular source code, configs, and build artifacts.

**Files to remove:**
- `src/app/**/*.module.ts`
- `src/app/**/*.component.ts` (Angular versions)
- `src/app/**/*.component.html`
- `src/app/**/*.component.scss` (Angular versions)
- `src/app/**/*.component.spec.ts`
- `src/app/shared/guards/auth.guard.ts`
- `src/app/shared/pipes/currency-format.pipe.ts`
- `angular.json`, `karma.conf.js`
- `tsconfig.app.json`, `tsconfig.spec.json`
- `src/polyfills.ts`, `src/test.ts`, `src/main.ts` (Angular entry)

**Acceptance criteria:**
- Zero `.module.ts` files
- Zero Angular-style `.component.ts` files
- `angular.json` removed
- `karma.conf.js` removed
- Only React source files remain

### 6. Clean Up Configuration

Remove Angular-specific configuration from remaining files.

**Acceptance criteria:**
- `.browserslistrc` reviewed (keep if still needed for Vite)
- `.editorconfig` reviewed (keep, framework-agnostic)
- `.eslintrc.json` updated (remove Angular-specific rules)
- `tsconfig.json` simplified (remove Angular compiler options)
- `package.json` scripts updated (remove `ng` commands)

### 7. Consolidate Project Structure

Merge `react-app/` into root if using monorepo, or clean up directory structure.

**Acceptance criteria:**
- Single clean project structure
- No orphaned files or directories
- `README.md` updated
- `package.json` scripts reflect React-only workflow

### 8. Run Complete Test Suite

Run all tests against the pure React application.

**Acceptance criteria:**
- All unit tests pass (Vitest)
- All integration tests pass (RTL)
- All E2E tests pass (Playwright)
- Coverage meets or exceeds pre-migration baseline
- No flaky tests

### 9. Final Performance Audit

Comprehensive performance comparison against the original Angular baseline.

**Acceptance criteria:**
- Lighthouse scores meet or exceed Angular baseline
- Bundle size <= Angular baseline (target 20% reduction with Vite)
- FCP < 1.8s, LCP < 2.5s, CLS < 0.1
- No memory leaks

### 10. Final Accessibility Audit

Full axe-core audit of the React application.

**Acceptance criteria:**
- Zero critical violations
- Zero serious violations
- WCAG 2.1 AA compliance maintained

### 11. Archive Angular Codebase

Create a git tag marking the last Angular version for historical reference.

```bash
git tag -a angular-archive-v1.0 -m 'Final Angular 13.3.11 version before React migration'
git push origin angular-archive-v1.0
```

**Acceptance criteria:**
- Git tag created and pushed
- Tag includes all Angular source at its final state
- Migration PR merged to main

### 12. Produce Final Migration Report

Comprehensive report documenting the entire migration.

**Report sections:**
1. Executive Summary
2. Timeline and Milestones
3. Metrics Comparison (before/after)
4. Lessons Learned
5. Remaining Technical Debt
6. Recommendations for Future

**Acceptance criteria:**
- Report documents all waves and their outcomes
- Performance comparison included
- Bundle size comparison included
- Test coverage comparison included
- Lessons learned documented

### 13. Remove Migration Infrastructure

Remove migration-specific files that are no longer needed.

**Files to remove:**
- `assessment/` (inventory files)
- `.windsurf/` (migration workflows)
- `docs/migration-tracker.md`
- `docs/wave-*-report.md`
- `packages/shared-types/` (inline into React `src/types/`)

**Files to keep:**
- `docs/final-migration-report.md`
- `docs/architectural-decisions.md`
- `AGENTS.md` (update for React-only project)

**Acceptance criteria:**
- Migration-specific infrastructure removed
- Project looks like a normal React 18 application
- Documentation reflects current state
