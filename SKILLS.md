# HSBC Loans Portal — Migration Skills Matrix

## Skill Categories

### 1. Angular 13 Comprehension (READ-ONLY)

Skills needed to understand the existing HSBC Loans codebase. **No Angular code will be written.**

| Skill | Proficiency Required | HSBC Loans Context |
|-------|---------------------|-------------------|
| NgModules | Intermediate | AppModule, SharedModule, 6 lazy-loaded feature modules |
| Components | Intermediate | 11 components (5 page, 4 shared layout, 1 inline template, 1 root) |
| Services + DI | Intermediate | AuthService, LoanService, NotificationService (all providedIn: 'root') |
| Reactive Forms | Advanced | LoanApplicationComponent: 3 FormGroups, multi-step wizard, custom validation |
| Template-driven Forms | Basic | LoginComponent: ngModel bindings, ProfileComponent: edit form |
| RxJS (BehaviorSubject) | Intermediate | Auth state, loan list, notifications — all BehaviorSubject + asObservable |
| RxJS Operators | Intermediate | forkJoin (dashboard), pipe/filter (router events), delay/tap (mock API) |
| Router | Intermediate | Lazy loading via loadChildren, AuthGuard (CanActivate), NavigationEnd |
| Angular Material | Intermediate | MatIcon, MatMenu, MatBadge, MatTooltip, MatSpinner, MatDivider |
| Pipes | Basic | CurrencyFormatPipe (custom), date pipe (built-in) |
| Change Detection | Basic | Default strategy throughout (no OnPush) |

### 2. React 18 Core (WRITE)

| Skill | Proficiency Required | Mapping From Angular |
|-------|---------------------|---------------------|
| JSX/TSX | Advanced | Replaces Angular templates (.html files) |
| useState | Advanced | Replaces component class properties (isLoading, searchQuery, etc.) |
| useEffect | Advanced | Replaces ngOnInit lifecycle + subscription management |
| useContext | Advanced | Replaces service injection for AuthService state |
| useCallback/useMemo | Intermediate | Replaces computed getters (getStatusClass, formatCurrency) |
| useRef | Basic | Replaces ViewChild (none currently, but needed for focus management) |
| React.lazy + Suspense | Intermediate | Replaces Angular lazy loading (loadChildren) |
| Error Boundaries | Intermediate | No Angular equivalent — new addition |
| React.memo | Basic | Performance optimization for list items (loan cards) |
| Custom Hooks | Advanced | Replaces Angular services for stateful logic |

### 3. React Ecosystem (WRITE)

| Library | Version | Replaces | HSBC Loans Usage |
|---------|---------|----------|-----------------|
| React Router 6 | ^6.20 | @angular/router | 6 routes, auth guard, lazy loading |
| TanStack Query 5 | ^5.x | LoanService Observables | getLoans, getDashboardStats, getLoanById, submitApplication |
| Zustand | ^4.x | NotificationService BehaviorSubject | Notification store with unread count |
| React Hook Form | ^7.x | Angular ReactiveFormsModule | Loan application wizard (3 form groups) |
| Zod | ^3.x | Angular Validators | Email, phone pattern, min/max, required |
| Vite | ^5.x | @angular-devkit/build-angular | Dev server, production builds |
| Vitest | ^1.x | Karma + Jasmine | Unit tests for hooks, components |
| React Testing Library | ^14.x | (no Angular equivalent) | Component integration tests |
| Playwright | ^1.x | (no Angular equivalent) | E2E tests for all routes |
| MSW | ^2.x | In-memory mock data in services | API mocking for dev and tests |

### 4. Coexistence & Bridge Skills

| Skill | Context |
|--------|---------|
| single-spa | Mount React app alongside Angular during migration |
| Shared Auth Token | localStorage-based (already used by Angular AuthService) |
| Feature Flags | Route-level switching: ff_react_login, ff_react_dashboard, etc. |
| Shared CSS Variables | HSBC design tokens as CSS custom properties accessible by both apps |
| Event Bus | Custom events for cross-framework communication (notifications) |

### 5. DevOps & Quality

| Skill | Tool | Purpose |
|-------|------|---------|
| Linting | ESLint + @typescript-eslint | Code quality enforcement |
| Formatting | Prettier | Consistent code style |
| CI Pipeline | GitHub Actions | Build, test, lint, lighthouse on every PR |
| Visual Regression | Chromatic or Percy | Screenshot comparison for migrated components |
| Accessibility | axe-core + @axe-core/react | Zero critical/serious violations |
| Bundle Analysis | vite-plugin-visualizer | Monitor bundle size during migration |
| Performance | Lighthouse CI | FCP < 1.8s, LCP < 2.5s, CLS < 0.1 |

---

## Training Delivery Plan

### Week 1: React Fundamentals + Tooling
- React 18 core concepts (JSX, hooks, component lifecycle)
- Vite setup and configuration
- TypeScript strict mode in React context
- **Exercise**: Convert LoadingSpinnerComponent (inline template) to React

### Week 2: State Management + Data Fetching
- TanStack Query for server state (replacing LoanService Observables)
- Zustand for client state (replacing NotificationService)
- React Context for auth state (replacing AuthService)
- **Exercise**: Implement useAuth hook and useLoans query hooks

### Week 3: Forms + Routing
- React Hook Form with multi-step wizard pattern
- Zod validation schemas (replacing Angular Validators)
- React Router 6 with lazy loading and protected routes
- **Exercise**: Build LoanApplication wizard step 1 (PersonalInfo)

### Week 4: Testing + Coexistence
- Vitest + React Testing Library patterns
- Playwright E2E test structure
- single-spa integration and feature flag setup
- **Exercise**: Write parity tests for Login page (Angular vs React)

---

## Skill Assessment Checklist

Before starting migration, each developer must demonstrate:

- [ ] Can create a functional React component with TypeScript props
- [ ] Can use useState, useEffect, useContext, useCallback correctly
- [ ] Can implement a custom hook that manages async state
- [ ] Can set up React Router 6 with lazy loading and route guards
- [ ] Can build a multi-step form with React Hook Form + Zod
- [ ] Can write TanStack Query hooks with proper cache invalidation
- [ ] Can write Vitest unit tests with React Testing Library
- [ ] Can write Playwright E2E tests
- [ ] Can read and understand Angular 13 component/service/module code
- [ ] Can translate BehaviorSubject patterns to React state patterns
- [ ] Can translate Angular reactive form patterns to React Hook Form
