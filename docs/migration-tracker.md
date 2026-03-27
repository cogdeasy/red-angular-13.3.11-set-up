# Migration Tracker — HSBC Loans Portal

## Overall Progress

| Wave | Name | Routes | Status | Progress |
|------|------|--------|--------|----------|
| 0 | Assessment & Foundation | N/A | **Complete** | 100% |
| 1 | Leaf Pages | /login, /profile | Not Started | 0% |
| 2 | Read-Only Pages | /dashboard, /loan-status | Not Started | 0% |
| 3 | Interactive Pages | /loan-calculator | Not Started | 0% |
| 4 | Complex Pages | /loan-application | Not Started | 0% |
| 5 | Shell & Cleanup | Shell, Header, Sidebar, Footer | Not Started | 0% |

**Overall Migration**: 0% (0/11 components migrated)

---

## Wave 1 — Leaf Pages

### /login (LoginComponent → LoginPage)
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| Angular component analyzed | Not Started | |
| React component created | Not Started | |
| Custom hooks created (useAuth) | Not Started | |
| Styles migrated | Not Started | |
| Unit tests written | Not Started | |
| E2E parity tests written | Not Started | |
| Visual regression baseline | Not Started | |
| Accessibility audit passed | Not Started | |
| Performance check passed | Not Started | |
| Feature flag configured (ff_react_login) | Not Started | |
| PR created and merged | Not Started | |

**Complexity**: 2/5
**Angular Dependencies**: AuthService, Router
**Angular Form Type**: Template-driven (ngModel)
**React Form Type**: React Hook Form + Zod (email/password)
**Estimated Effort**: 2-3 days

### /profile (ProfileComponent → ProfilePage)
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| Angular component analyzed | Not Started | |
| React component created | Not Started | |
| Custom hooks created (useAuth) | Not Started | |
| Styles migrated | Not Started | |
| Unit tests written | Not Started | |
| E2E parity tests written | Not Started | |
| Visual regression baseline | Not Started | |
| Accessibility audit passed | Not Started | |
| Performance check passed | Not Started | |
| Feature flag configured (ff_react_profile) | Not Started | |
| PR created and merged | Not Started | |

**Complexity**: 2/5
**Angular Dependencies**: AuthService
**Angular Form Type**: Template-driven (ngModel for edit mode)
**React Form Type**: Controlled inputs (simple view/edit toggle)
**Estimated Effort**: 2-3 days

---

## Wave 2 — Read-Only Pages

### /dashboard (DashboardComponent → DashboardPage)
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| Angular component analyzed | Not Started | |
| React component created | Not Started | |
| Custom hooks created (useDashboardStats, useLoans) | Not Started | |
| Styles migrated | Not Started | |
| Unit tests written | Not Started | |
| E2E parity tests written | Not Started | |
| Visual regression baseline | Not Started | |
| Accessibility audit passed | Not Started | |
| Performance check passed | Not Started | |
| Feature flag configured (ff_react_dashboard) | Not Started | |
| PR created and merged | Not Started | |

**Complexity**: 3/5
**Angular Dependencies**: AuthService, LoanService (forkJoin pattern)
**Key Patterns**: forkJoin → parallel useQuery, stats cards, loans table, quick actions
**Estimated Effort**: 4-5 days

### /loan-status (LoanStatusComponent → LoanStatusPage)
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| Angular component analyzed | Not Started | |
| React component created | Not Started | |
| Custom hooks created (useLoans) | Not Started | |
| Styles migrated | Not Started | |
| Unit tests written | Not Started | |
| E2E parity tests written | Not Started | |
| Visual regression baseline | Not Started | |
| Accessibility audit passed | Not Started | |
| Performance check passed | Not Started | |
| Feature flag configured (ff_react_loan_status) | Not Started | |
| PR created and merged | Not Started | |

**Complexity**: 3/5
**Angular Dependencies**: LoanService
**Key Patterns**: Filterable/searchable list, expandable detail cards, status timeline, progress bars
**Estimated Effort**: 4-5 days

---

## Wave 3 — Interactive Pages

### /loan-calculator (LoanCalculatorComponent → LoanCalculatorPage)
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| Angular component analyzed | Not Started | |
| React component created | Not Started | |
| Custom hooks created (useCalculateLoan) | Not Started | |
| Styles migrated | Not Started | |
| Unit tests written | Not Started | |
| E2E parity tests written | Not Started | |
| Visual regression baseline | Not Started | |
| Accessibility audit passed | Not Started | |
| Performance check passed | Not Started | |
| Feature flag configured (ff_react_loan_calculator) | Not Started | |
| PR created and merged | Not Started | |

**Complexity**: 3/5
**Angular Dependencies**: LoanService (calculateLoan method)
**Key Patterns**: Two-way binding (ngModel → controlled inputs), SVG donut chart, amortization schedule with pagination, range sliders
**Estimated Effort**: 4-5 days

---

## Wave 4 — Complex Pages

### /loan-application (LoanApplicationComponent → LoanApplicationPage)
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| Angular component analyzed | Not Started | |
| React component created (wizard container + 4 step components) | Not Started | |
| Custom hooks created (useSubmitApplication) | Not Started | |
| Zod validation schemas created | Not Started | |
| Styles migrated | Not Started | |
| Unit tests written | Not Started | |
| E2E parity tests written | Not Started | |
| Visual regression baseline | Not Started | |
| Accessibility audit passed | Not Started | |
| Performance check passed | Not Started | |
| Feature flag configured (ff_react_loan_application) | Not Started | |
| PR created and merged | Not Started | |

**Complexity**: 5/5
**Angular Dependencies**: AuthService, LoanService
**Key Patterns**: 4-step wizard, 3 FormGroups (personalInfo, employment, loanDetails), complex validation, conditional fields, step navigation, estimated payment calculation
**React Pattern**: useForm per step with FormProvider, shared wizard context, Zod schemas per step
**Estimated Effort**: 5-7 days

---

## Wave 5 — Shell & Cleanup

### AppComponent → AppShell
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| React component created | Not Started | |
| Auth-aware layout switching | Not Started | |
| Sidebar toggle state | Not Started | |
| Route-aware login page detection | Not Started | |
| Tests written | Not Started | |

**Complexity**: 3/5

### HeaderComponent → Header
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| React component created | Not Started | |
| Notification panel (Zustand) | Not Started | |
| User menu dropdown | Not Started | |
| Logout functionality | Not Started | |
| Tests written | Not Started | |

**Complexity**: 3/5

### SidebarComponent → Sidebar
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| React component created | Not Started | |
| Collapse/expand toggle | Not Started | |
| Active route highlighting | Not Started | |
| Navigation items | Not Started | |
| Tests written | Not Started | |

**Complexity**: 2/5

### FooterComponent → Footer
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| React component created | Not Started | |
| Tests written | Not Started | |

**Complexity**: 1/5

### LoadingSpinnerComponent → LoadingSpinner
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| React component created | Not Started | |
| Tests written | Not Started | |

**Complexity**: 1/5

### Angular Removal
| Checklist Item | Status | Notes |
|---------------|--------|-------|
| Feature flags removed | Not Started | |
| single-spa bridge removed | Not Started | |
| Angular dependencies removed | Not Started | |
| Angular source files deleted | Not Started | |
| Configuration cleaned up | Not Started | |
| Project consolidated | Not Started | |
| Final test suite passed | Not Started | |
| Final performance audit passed | Not Started | |
| Final accessibility audit passed | Not Started | |
| Angular codebase archived (git tag) | Not Started | |
| Final migration report produced | Not Started | |
