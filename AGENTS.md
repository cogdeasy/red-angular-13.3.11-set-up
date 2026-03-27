# HSBC Loans Portal — Angular 13.3.11 to React 18 Migration

## Project Context

- **Project**: hsbc-loans-portal
- **Source**: Angular 13.3.11
- **Target**: React 18.3.x (LTS)
- **Coexistence**: single-spa (route-level switching via feature flags)
- **Source repo**: https://github.com/cogdeasy/red-angular-13.3.11

## Architecture Rules

### Source Application (READ-ONLY)

The Angular codebase in `red-angular-13.3.11` is read-only during migration. Never modify Angular source files. All new features are built in React.

```
src/app/
  app.module.ts              # Root NgModule
  app-routing.module.ts      # 6 lazy-loaded routes + AuthGuard
  app.component.ts           # Shell: auth check, sidebar toggle
  shared/
    services/                # AuthService, LoanService, NotificationService
    guards/auth.guard.ts     # CanActivate guard
    models/                  # 12 TypeScript interfaces/enums
    pipes/                   # CurrencyFormatPipe
    components/              # Header, Sidebar, Footer, LoadingSpinner
  pages/                     # Login, Dashboard, LoanApplication, LoanCalculator, LoanStatus, Profile
```

### Target Application (WRITE)

```
src/
  main.tsx                   # React entry point
  App.tsx                    # Root component with React Router
  routes.tsx                 # Route definitions with lazy loading + auth guard
  providers/                 # AuthProvider, QueryProvider
  hooks/                     # useAuth, useLoans, useNotifications, useCurrencyFormat
  types/                     # Shared TypeScript interfaces/enums
  components/layout/         # AppShell, Header, Sidebar, Footer
  components/ui/             # LoadingSpinner, Badge
  pages/                     # Login, Dashboard, LoanApplication, LoanCalculator, LoanStatus, Profile
  styles/                    # tokens.css, global.css
```

## Code Guidelines

### TypeScript
- `strict: true` — no `any` types
- Prefer `interface` over `type` for object shapes
- Use proper interfaces from `types/`

### React Components
- Functional components only (no class components)
- Named exports: `export function DashboardPage() {}`
- Props interface co-located with component
- One component per file, PascalCase file names

### State Management
- **Auth state**: React Context + `useAuth` hook
- **Server data**: TanStack Query (replaces LoanService Observables)
- **UI state**: Component-local `useState`
- **Notifications**: Zustand store

### Forms
- React Hook Form for all forms
- Zod schemas for validation (replaces Angular Validators)

### Routing
- React Router 6 with `lazy()` for code splitting
- Auth guard via `<ProtectedRoute>` wrapper component
- Same URL paths as Angular: `/login`, `/dashboard`, `/loan-application`, `/loan-calculator`, `/loan-status`, `/profile`

### Styling
- SCSS variables migrated to CSS custom properties (`--hsbc-red`, `--hsbc-success`, etc.)
- Component-scoped styles via CSS Modules
- Angular Material icons replaced with `@mui/icons-material` or `react-icons`

### Imports
- Absolute imports via path aliases: `@/hooks/useAuth`, `@/types/loan`
- Group order: React → third-party → `@/` aliases → relative

## Process Guidelines

### Migration Order (Strangler Fig)

1. **Wave 1** — Leaf Pages: Login, Profile
2. **Wave 2** — Read-Only Pages: Dashboard, Loan Status
3. **Wave 3** — Interactive Pages: Loan Calculator
4. **Wave 4** — Complex Pages: Loan Application
5. **Wave 5** — Shell & Cleanup: AppShell, Header, Sidebar, Footer + remove Angular

### Feature Flags
- Route-level switching: `ff_react_{route_name}`
- Default: Angular active, React behind flag

### PR Requirements
- Reference the route/component being migrated
- Include before/after screenshots
- Report test coverage delta and bundle size impact

### Testing Requirements
- E2E parity: same Playwright spec runs against both Angular and React
- Lighthouse CI: FCP < 1.8s, LCP < 2.5s, CLS < 0.1
- axe-core: zero critical/serious accessibility violations
- Visual regression: Chromatic/Percy snapshots for every migrated component
