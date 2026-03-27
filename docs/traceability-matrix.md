# Traceability Matrix — HSBC Loans Portal Migration

## Purpose
Links every user story to its Angular source, React target, test files, and verification status.

---

## Wave 1 — Leaf Pages

| Story ID | User Story | Angular Source | React Target | Unit Test | E2E Test | Visual | A11y | Status |
|----------|-----------|---------------|-------------|-----------|---------|--------|------|--------|
| US-101 | Login page display | `pages/login/login.component.html` | `pages/Login.tsx` | `Login.test.tsx` | `e2e/login.spec.ts` | `login-desktop.png` | axe clean | Not Started |
| US-102 | Login authentication | `pages/login/login.component.ts` (login method) | `pages/Login.tsx` + `hooks/useAuth.ts` | `useAuth.test.ts` | `e2e/login.spec.ts` | N/A | N/A | Not Started |
| US-103 | Login validation | `pages/login/login.component.ts` (form validation) | `pages/Login.tsx` (Zod schema) | `Login.test.tsx` | `e2e/login.spec.ts` | N/A | N/A | Not Started |
| US-104 | Profile view | `pages/profile/profile.component.html` | `pages/Profile.tsx` | `Profile.test.tsx` | `e2e/profile.spec.ts` | `profile-desktop.png` | axe clean | Not Started |
| US-105 | Profile edit | `pages/profile/profile.component.ts` (toggleEdit, saveProfile) | `pages/Profile.tsx` | `Profile.test.tsx` | `e2e/profile.spec.ts` | `profile-edit.png` | axe clean | Not Started |

## Wave 2 — Read-Only Pages

| Story ID | User Story | Angular Source | React Target | Unit Test | E2E Test | Visual | A11y | Status |
|----------|-----------|---------------|-------------|-----------|---------|--------|------|--------|
| US-201 | Dashboard overview | `pages/dashboard/dashboard.component.html` | `pages/Dashboard.tsx` | `Dashboard.test.tsx` | `e2e/dashboard.spec.ts` | `dashboard-desktop.png` | axe clean | Not Started |
| US-202 | Dashboard stats | `pages/dashboard/dashboard.component.ts` (loadData forkJoin) | `pages/Dashboard.tsx` + `hooks/useLoans.ts` | `useLoans.test.ts` | `e2e/dashboard.spec.ts` | N/A | N/A | Not Started |
| US-203 | Loan status list | `pages/loan-status/loan-status.component.html` | `pages/LoanStatus.tsx` | `LoanStatus.test.tsx` | `e2e/loan-status.spec.ts` | `loan-status-desktop.png` | axe clean | Not Started |
| US-204 | Loan status detail | `pages/loan-status/loan-status.component.ts` (selectLoan, timeline) | `pages/LoanStatus.tsx` | `LoanStatus.test.tsx` | `e2e/loan-status.spec.ts` | `loan-status-expanded.png` | axe clean | Not Started |

## Wave 3 — Interactive Pages

| Story ID | User Story | Angular Source | React Target | Unit Test | E2E Test | Visual | A11y | Status |
|----------|-----------|---------------|-------------|-----------|---------|--------|------|--------|
| US-301 | Calculator input | `pages/loan-calculator/loan-calculator.component.html` (input panel) | `pages/LoanCalculator.tsx` | `LoanCalculator.test.tsx` | `e2e/loan-calculator.spec.ts` | `calculator-desktop.png` | axe clean | Not Started |
| US-302 | Calculator results | `pages/loan-calculator/loan-calculator.component.ts` (calculate, chart) | `pages/LoanCalculator.tsx` | `LoanCalculator.test.tsx` | `e2e/loan-calculator.spec.ts` | `calculator-results.png` | axe clean | Not Started |
| US-303 | Amortization schedule | `pages/loan-calculator/loan-calculator.component.ts` (pagination) | `pages/LoanCalculator.tsx` | `LoanCalculator.test.tsx` | `e2e/loan-calculator.spec.ts` | `amortization.png` | axe clean | Not Started |

## Wave 4 — Complex Pages

| Story ID | User Story | Angular Source | React Target | Unit Test | E2E Test | Visual | A11y | Status |
|----------|-----------|---------------|-------------|-----------|---------|--------|------|--------|
| US-401 | Personal info step | `pages/loan-application/loan-application.component.ts` (personalInfoForm) | `pages/LoanApplication/PersonalInfoStep.tsx` | `PersonalInfoStep.test.tsx` | `e2e/loan-application.spec.ts` | `loan-app-step1.png` | axe clean | Not Started |
| US-402 | Employment step | `pages/loan-application/loan-application.component.ts` (employmentForm) | `pages/LoanApplication/EmploymentStep.tsx` | `EmploymentStep.test.tsx` | `e2e/loan-application.spec.ts` | `loan-app-step2.png` | axe clean | Not Started |
| US-403 | Loan details step | `pages/loan-application/loan-application.component.ts` (loanDetailsForm) | `pages/LoanApplication/LoanDetailsStep.tsx` | `LoanDetailsStep.test.tsx` | `e2e/loan-application.spec.ts` | `loan-app-step3.png` | axe clean | Not Started |
| US-404 | Review & submit | `pages/loan-application/loan-application.component.ts` (submitApplication) | `pages/LoanApplication/ReviewStep.tsx` | `ReviewStep.test.tsx` | `e2e/loan-application.spec.ts` | `loan-app-step4.png` | axe clean | Not Started |

## Wave 5 — Shell & Cleanup

| Story ID | User Story | Angular Source | React Target | Unit Test | E2E Test | Visual | A11y | Status |
|----------|-----------|---------------|-------------|-----------|---------|--------|------|--------|
| US-501 | App shell layout | `app.component.ts` + `app.component.html` | `components/layout/AppShell.tsx` | `AppShell.test.tsx` | All E2E specs | `shell-desktop.png` | axe clean | Not Started |
| US-502 | Header functionality | `shared/components/header/header.component.ts` | `components/layout/Header.tsx` | `Header.test.tsx` | `e2e/header.spec.ts` | `header-desktop.png` | axe clean | Not Started |
| US-503 | Sidebar navigation | `shared/components/sidebar/sidebar.component.ts` | `components/layout/Sidebar.tsx` | `Sidebar.test.tsx` | `e2e/sidebar.spec.ts` | `sidebar-desktop.png` | axe clean | Not Started |
| US-504 | Angular removal | All Angular files | N/A (deletion) | Full suite | Full suite | Full suite | Full suite | Not Started |

---

## Angular Source → React Target File Map

| Angular File | React File | Type | Wave |
|-------------|-----------|------|------|
| `app.component.ts` | `components/layout/AppShell.tsx` | Component | 5 |
| `app-routing.module.ts` | `routes.tsx` | Config | Foundation |
| `shared/services/auth.service.ts` | `providers/AuthProvider.tsx` + `hooks/useAuth.ts` | Service → Context + Hook | Foundation |
| `shared/services/loan.service.ts` | `hooks/useLoans.ts` (TanStack Query) | Service → Hooks | 2 |
| `shared/services/notification.service.ts` | `hooks/useNotifications.ts` (Zustand) | Service → Store | 5 |
| `shared/guards/auth.guard.ts` | `components/ProtectedRoute.tsx` | Guard → Component | Foundation |
| `shared/models/loan.model.ts` | `types/loan.ts` | Types (shared) | Foundation |
| `shared/models/user.model.ts` | `types/user.ts` | Types (shared) | Foundation |
| `shared/pipes/currency-format.pipe.ts` | `utils/format.ts` | Pipe → Utility | Foundation |
| `shared/components/header/` | `components/layout/Header.tsx` | Component | 5 |
| `shared/components/sidebar/` | `components/layout/Sidebar.tsx` | Component | 5 |
| `shared/components/footer/` | `components/layout/Footer.tsx` | Component | 5 |
| `shared/components/loading-spinner/` | `components/ui/LoadingSpinner.tsx` | Component | 5 |
| `pages/login/` | `pages/Login.tsx` | Page | 1 |
| `pages/dashboard/` | `pages/Dashboard.tsx` | Page | 2 |
| `pages/loan-application/` | `pages/LoanApplication/index.tsx` + steps | Page | 4 |
| `pages/loan-calculator/` | `pages/LoanCalculator.tsx` | Page | 3 |
| `pages/loan-status/` | `pages/LoanStatus.tsx` | Page | 2 |
| `pages/profile/` | `pages/Profile.tsx` | Page | 1 |
| `styles.scss` | `styles/tokens.css` + `styles/global.css` | Styles | Foundation |

## Hook → Service Method Map

| React Hook | Method | Angular Source | Query Key |
|-----------|--------|---------------|-----------|
| `useAuth().login` | `login(email, password)` | `AuthService.login()` | N/A (mutation) |
| `useAuth().logout` | `logout()` | `AuthService.logout()` | N/A (action) |
| `useAuth().user` | Current user | `AuthService.currentUser$` | N/A (context) |
| `useAuth().isAuthenticated` | Auth state | `AuthService.isAuthenticated$` | N/A (context) |
| `useLoans()` | Fetch all loans | `LoanService.getLoans()` | `['loans']` |
| `useLoan(id)` | Fetch single loan | `LoanService.getLoanById(id)` | `['loans', id]` |
| `useDashboardStats()` | Fetch stats | `LoanService.getDashboardStats()` | `['dashboard-stats']` |
| `useSubmitApplication()` | Submit form | `LoanService.submitApplication()` | N/A (mutation, invalidates `['loans']`) |
| `useNotificationStore()` | Notification state | `NotificationService.notifications$` | N/A (Zustand) |
