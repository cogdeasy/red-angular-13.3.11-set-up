---
name: assess-angular-app
description: Inventory and assess the HSBC Loans Portal Angular 13.3.11 codebase. Produces component/service inventories, route map, dependency audit, performance baseline, test baseline, and migration plan with wave assignments.
---

# Assess Angular App

Run this skill to perform a comprehensive inventory of the HSBC Loans Portal Angular 13.3.11 codebase before migration.

## Pre-requisites

- Access to the Angular source repo (`red-angular-13.3.11`)
- Node.js >= 18 installed

## Steps

### 1. Inventory All NgModules

List every NgModule with its declarations, imports, exports, and providers.

**Expected modules (8):** AppModule, SharedModule, LoginModule, DashboardModule, LoanApplicationModule, LoanCalculatorModule, LoanStatusModule, ProfileModule.

- Document lazy-loading relationships
- Document SharedModule export surface

### 2. Inventory All Components

List every component with metadata: selector, template type, style type, inputs, outputs, injected services, lifecycle hooks, complexity score (1-5).

**Expected components (11):** AppComponent, HeaderComponent, SidebarComponent, FooterComponent, LoadingSpinnerComponent, LoginComponent, DashboardComponent, LoanApplicationComponent, LoanCalculatorComponent, LoanStatusComponent, ProfileComponent.

- Note template-driven vs reactive form usage
- Note Angular Material usage per component

### 3. Inventory All Services

List every service with: provider scope, injected dependencies, public API surface, RxJS usage patterns, state management patterns.

**Expected services (3):** AuthService, LoanService, NotificationService.

- Map BehaviorSubject patterns to React equivalents
- Document public method signatures

### 4. Map All Routes

Document every route with: path, component, module, guards, resolvers, lazy loading config.

**Expected routes (6):** /login, /dashboard, /loan-application, /loan-calculator, /loan-status, /profile.

- Document AuthGuard usage (all routes except /login)
- Verify deep link support

### 5. Audit Dependencies

Categorize every dependency as: Angular-specific (remove), third-party keep, third-party replace, or shared (framework-agnostic).

- 13 production dependencies
- 15 dev dependencies
- Identify React equivalents for each Angular-specific dep
- Document chart.js/ng2-charts migration path

### 6. Inventory TypeScript Models

List all interfaces, enums, and types that can be shared between Angular and React.

**Expected types (12):** Loan, LoanType, LoanStatus, LoanApplication, PersonalInfo, EmploymentInfo, LoanDetails, DocumentInfo, LoanCalculation, AmortizationEntry, DashboardStats, User.

### 7. Capture Test Baseline

Document current test coverage, test count, test types, and testing infrastructure.

- Current framework: Karma 6.3 + Jasmine 4.0
- Only `app.component.spec.ts` exists
- Define target coverage for React (80% statements, 75% branches)

### 8. Capture Performance Baseline

Measure and document current application performance metrics.

- Bundle size (production build)
- Lighthouse scores (FCP, LCP, CLS, TBT)
- Route-level code splitting analysis
- Define performance budgets for React target

### 9. Produce Migration Plan

Assign every component/route to a migration wave with estimated effort and dependencies.

| Wave | Name | Routes | Risk |
|------|------|--------|------|
| 1 | Leaf Pages | /login, /profile | Low |
| 2 | Read-Only Pages | /dashboard, /loan-status | Medium |
| 3 | Interactive Pages | /loan-calculator | Medium |
| 4 | Complex Pages | /loan-application | High |
| 5 | Shell & Cleanup | Shell components | Medium |

## Outputs

Save results to:

- `assessment/component_inventory.csv`
- `assessment/service_inventory.csv`
- `assessment/route-map.md`
- `assessment/dependency-map.csv`
- `assessment/test_baseline.md`
- `assessment/performance_baseline.md`
- `docs/migration_plan.md`
