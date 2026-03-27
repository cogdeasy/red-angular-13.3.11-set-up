# Workflow 1 — Assessment & Inventory

Comprehensive inventory of the HSBC Loans Portal Angular 13.3.11 codebase. Produces component/service inventories, route map, dependency audit, performance baseline, test baseline, and migration plan with wave assignments.

- **Phase**: 0 — Assessment
- **Duration**: 3–5 days
- **Repeat**: No

## Inputs

| Input | Value |
|-------|-------|
| Angular source root | `src/app` |
| package.json | `package.json` |
| Angular config | `angular.json` |
| TypeScript config | `tsconfig.json` |
| Existing test reports | Karma + Jasmine, no existing coverage reports |

## Outputs

- `assessment/component_inventory.csv`
- `assessment/service_inventory.csv`
- `assessment/route-map.md`
- `assessment/dependency-map.csv`
- `assessment/test_baseline.md`
- `assessment/performance_baseline.md`
- `docs/migration_plan.md`

## Steps

### 1. Inventory All NgModules

List every NgModule in the application with its declarations, imports, exports, and providers.

**Acceptance criteria:**
- All 8 modules documented (AppModule, SharedModule, LoginModule, DashboardModule, LoanApplicationModule, LoanCalculatorModule, LoanStatusModule, ProfileModule)
- Lazy-loading relationships mapped
- SharedModule export surface documented

### 2. Inventory All Components

List every component with metadata: selector, template type, style type, inputs, outputs, injected services, lifecycle hooks, complexity score.

**Acceptance criteria:**
- All 11 components inventoried
- Complexity scores assigned (1–5 scale)
- Template-driven vs reactive form usage documented
- Angular Material usage per component documented

### 3. Inventory All Services

List every service with: provider scope, injected dependencies, public API surface, RxJS usage patterns, state management patterns.

**Acceptance criteria:**
- All 3 services documented (AuthService, LoanService, NotificationService)
- BehaviorSubject patterns identified and mapped to React equivalents
- Public method signatures documented

### 4. Map All Routes

Document every route with: path, component, module, guards, resolvers, lazy loading config.

**Acceptance criteria:**
- All 6 routes + 2 redirects documented
- AuthGuard usage documented
- Lazy loading strategy documented
- Deep link support verified

### 5. Audit Dependencies

Categorize every dependency as Angular-specific, third-party (keep), third-party (replace), or shared (framework-agnostic).

**Acceptance criteria:**
- All 13 production dependencies categorized
- All 15 dev dependencies categorized
- React equivalents identified for each Angular-specific dep
- chart.js/ng2-charts migration path documented

### 6. Inventory TypeScript Models

List all interfaces, enums, and types that can be shared between Angular and React.

**Acceptance criteria:**
- All 11 interfaces/enums documented (Loan, LoanType, LoanStatus, LoanApplication, PersonalInfo, EmploymentInfo, LoanDetails, DocumentInfo, LoanCalculation, AmortizationEntry, DashboardStats, User)
- Shared types package strategy defined

### 7. Capture Test Baseline

Document current test coverage, test count, test types, and testing infrastructure.

**Acceptance criteria:**
- Current test count documented (spec files identified)
- Testing framework documented (Karma + Jasmine)
- Coverage gaps identified
- Target coverage for React defined

### 8. Capture Performance Baseline

Measure and document current application performance metrics.

**Acceptance criteria:**
- Bundle size documented (production build)
- Lighthouse scores captured (FCP, LCP, CLS, TBT)
- Route-level code splitting analysis
- Performance budgets defined for React target

### 9. Produce Migration Plan

Assign every component/route to a migration wave with estimated effort and dependencies.

**Acceptance criteria:**
- 5 waves defined with component assignments
- Effort estimates per wave (story points or days)
- Dependencies between waves documented
- Risk register populated
- Go/no-go criteria per wave defined
