---
name: migrate-route
description: Migrate a single Angular route/page to React 18. Repeatable workflow — run once per route in the order defined by the migration plan waves. Covers component creation, hooks, styles, tests, feature flags, and tracker updates.
---

# Migrate Route

Run this skill to migrate one Angular route to React. Repeat for each route in wave order.

## Inputs

- **route_path**: e.g., `/login`, `/dashboard`
- **angular_component**: e.g., `LoginComponent`
- **complexity_score**: 1-5 from component inventory
- **migration_wave**: 1-5

## Steps

### 1. Analyze Angular Component

Read the Angular component, template, styles, and module. Document:

- All inputs/outputs
- Injected services and their usage
- Template directives (`*ngIf`, `*ngFor`, `[ngClass]`, `[(ngModel)]`, `[formGroup]`)
- RxJS subscriptions
- Lifecycle hooks
- Event handlers

### 2. Create/Verify TypeScript Types

Ensure all TypeScript interfaces/enums used by this component exist in the shared types package (`packages/shared-types/`).

### 3. Create Custom Hooks

Translate Angular service methods to React hooks:

| Angular Pattern | React Equivalent |
|----------------|-----------------|
| `this.authService.login().subscribe()` | `useLoginMutation()` |
| `this.authService.isAuthenticated$.subscribe()` | `useAuth()` |
| `this.loanService.getLoans().subscribe()` | `useLoans()` query hook |
| `forkJoin([...]).subscribe()` | Multiple `useQuery` hooks |
| `FormBuilder.group({...})` | `useForm({ resolver: zodResolver(schema) })` |

### 4. Build React Component

Create the React component using these translation patterns:

| Angular | React |
|---------|-------|
| `*ngIf="condition"` | `{condition && <Element />}` |
| `*ngFor="let item of items"` | `{items.map(item => <Element key={item.id} />)}` |
| `[ngClass]` | `className={getStatusClass(status)}` |
| `[(ngModel)]` | `value={value} onChange={handler}` |
| `[formGroup]` | `<form onSubmit={handleSubmit(onSubmit)}>` |
| `formControlName` | `{...register('field')}` |
| `(click)="handler()"` | `onClick={handler}` |
| `{{ value \| currencyFormat }}` | `{formatCurrency(value)}` |
| `routerLink` | `<Link to="/path">` |

### 5. Migrate Component Styles

Convert SCSS to CSS Modules using CSS custom properties (HSBC design tokens). Visual output must match Angular version.

### 6. Write Unit Tests

Write Vitest + React Testing Library tests:

- Renders without crashing
- Displays correct data when loaded
- Handles loading/error states
- Form validation (if applicable)
- User interactions trigger correct behavior

### 7. Write E2E Parity Tests

Write Playwright tests that run against both Angular (port 4200) and React (port 5173).

### 8. Visual Regression

Capture screenshots at 3 viewports: Desktop (1920x1080), Tablet (768x1024), Mobile (375x812).

### 9. Accessibility Audit

Run axe-core: zero critical/serious violations, keyboard accessible, proper ARIA labels.

### 10. Wire Feature Flag

Enable React version behind `ff_react_{route_name}`. Default: Angular (flag off).

### 11. Update Migration Tracker

Update `docs/migration-tracker.md` with completion status, PR reference, screenshots.

### 12. Create Migration PR

PR title: `feat: migrate {route_path} to React (Wave {wave})`

Include before/after screenshots, test coverage delta, bundle size impact.

## Wave Run Order

| Wave | Routes | Estimated Effort |
|------|--------|-----------------|
| 1 | /login, /profile | 5-7 days |
| 2 | /dashboard, /loan-status | 7-10 days |
| 3 | /loan-calculator | 5-7 days |
| 4 | /loan-application | 7-10 days |
| 5 | Shell components | 5-7 days |
