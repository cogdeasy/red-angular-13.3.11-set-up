# Workflow 3 — Migrate Route

Migrate a single Angular route/page to React. This workflow is repeatable — run once per route in the order defined by the migration plan waves.

- **Phase**: 2–4 — Migration Waves
- **Duration**: 1–5 days per route (depends on complexity)
- **Repeat**: Yes (once per route)

## Inputs

| Input | Description |
|-------|-------------|
| `route_path` | e.g., `/login`, `/dashboard` |
| `angular_component` | e.g., `LoginComponent` |
| `angular_module` | e.g., `LoginModule` |
| `angular_services` | e.g., `[AuthService]` |
| `route_guards` | e.g., `[AuthGuard]` or none |
| `existing_e2e_tests` | e.g., `login.spec.ts` or none |
| `complexity_score` | 1–5 from component inventory |
| `migration_wave` | 1–5 |

## Outputs

- `src/pages/{ComponentName}.tsx` — React component
- `src/hooks/use{Feature}.ts` — Custom hooks (if needed)
- `src/pages/__tests__/{ComponentName}.test.tsx` — Unit tests
- `e2e/{route}.spec.ts` — E2E parity tests
- Chromatic/Percy visual baseline
- Entry in `docs/migration-tracker.md`

## Steps

### 1. Analyze Angular Component

Read the Angular component, template, styles, and module. Document:

- All inputs/outputs
- Injected services and their usage
- Template directives (`*ngIf`, `*ngFor`, `[ngClass]`, `[(ngModel)]`, `[formGroup]`)
- RxJS subscriptions
- Lifecycle hooks
- Event handlers

**Acceptance criteria:**
- Complete mapping document produced
- All Angular patterns identified with React equivalents

### 2. Create/Verify TypeScript Types

Ensure all TypeScript interfaces/enums used by this component exist in the shared types package.

**Acceptance criteria:**
- All types available in `packages/shared-types/`
- No type duplication between Angular and React

### 3. Create Custom Hooks

Translate Angular service methods used by this component into React hooks.

| Angular Pattern | React Equivalent |
|----------------|-----------------|
| `this.authService.login(email, password).subscribe()` | `const { mutate: login } = useLoginMutation()` |
| `this.authService.isAuthenticated$.subscribe()` | `const { isAuthenticated } = useAuth()` |
| `this.loanService.getLoans().subscribe()` | `const { data: loans } = useLoans()` |
| `this.loanService.getDashboardStats().subscribe()` | `const { data: stats } = useDashboardStats()` |
| `forkJoin([...]).subscribe()` | Multiple `useQuery` hooks (parallel by default) |
| `this.notificationService.addNotification()` | `useNotificationStore().addNotification()` |
| `FormBuilder.group({...})` | `useForm<T>({ resolver: zodResolver(schema) })` |

**Acceptance criteria:**
- Every Angular service method has a React hook equivalent
- Hooks handle loading, error, and success states
- No direct RxJS in React code

### 4. Build React Component

Create the React component that replicates the Angular component's functionality.

| Angular | React |
|---------|-------|
| `*ngIf='condition'` | `{condition && <Element />}` |
| `*ngFor='let item of items'` | `{items.map(item => <Element key={item.id} />)}` |
| `[ngClass]='getStatusClass(status)'` | `className={getStatusClass(status)}` |
| `[(ngModel)]='value'` | `value={value} onChange={e => setValue(e.target.value)}` |
| `[formGroup]='form'` | `<form onSubmit={handleSubmit(onSubmit)}>` |
| `formControlName='field'` | `{...register('field')}` |
| `(click)='handler()'` | `onClick={handler}` |
| `(ngSubmit)='submit()'` | `onSubmit={handleSubmit(onSubmit)}` |
| `{{ value \| currencyFormat }}` | `{formatCurrency(value)}` |
| `{{ value \| date:'format' }}` | `{new Intl.DateTimeFormat(...).format(value)}` |
| `routerLink='/path'` | `<Link to='/path'>` |
| `[routerLink]='path'` | `<Link to={path}>` |
| `mat-icon` | Material icon via `@mui/icons-material` or `react-icons` |

**Acceptance criteria:**
- Component renders identically to Angular version
- All interactive behavior preserved
- Accessibility attributes maintained
- Responsive behavior maintained

### 5. Migrate Component Styles

Convert component SCSS to CSS Modules or co-located styles using CSS custom properties.

**Acceptance criteria:**
- Visual output matches Angular version pixel-for-pixel
- HSBC design tokens used (CSS custom properties)
- No hardcoded colors or spacing values
- Responsive breakpoints preserved

### 6. Write Unit Tests

Write Vitest + React Testing Library tests covering the same scenarios as the Angular component's spec file (if one exists).

**Test patterns:**
- Renders without crashing
- Displays correct data when loaded
- Handles loading state
- Handles error state
- Form validation works correctly (if applicable)
- Navigation works correctly
- User interactions trigger correct behavior

**Acceptance criteria:**
- Coverage >= Angular baseline for this component
- All user interactions tested
- All edge cases covered
- Tests pass in CI

### 7. Write E2E Parity Tests

Write Playwright E2E tests that can run against both the Angular and React versions.

**Acceptance criteria:**
- Same test file runs against both Angular (port 4200) and React (port 5173)
- All critical user journeys covered
- Visual snapshots captured
- Tests pass in CI

### 8. Capture Visual Regression Baseline

Take screenshots of the React component and compare against Angular version.

**Viewports:**
| Name | Width | Height |
|------|-------|--------|
| Desktop | 1920 | 1080 |
| Tablet | 768 | 1024 |
| Mobile | 375 | 812 |

**Acceptance criteria:**
- Zero visual diff at all viewports
- Or documented and approved intentional differences

### 9. Accessibility Audit

Run axe-core against the React component.

**Acceptance criteria:**
- Zero critical violations
- Zero serious violations
- All interactive elements keyboard accessible
- Proper ARIA labels and roles

### 10. Performance Check

Verify the React component meets performance budgets.

**Acceptance criteria:**
- Component render time within budget
- No unnecessary re-renders
- Lazy loading working correctly
- Bundle contribution documented

### 11. Wire Feature Flag

Enable the React version behind a feature flag so it can be gradually rolled out.

- Flag name: `ff_react_{route_name}`
- Default: Angular active (flag off)
- Flag can be toggled without deployment

### 12. Update Migration Tracker

Update `docs/migration-tracker.md` with completion status for this route.

**Acceptance criteria:**
- Route marked as migrated in tracker
- All checklist items verified
- PR reference linked
- Screenshots attached

### 13. Create Migration PR

PR title: `feat: migrate {route_path} to React (Wave {wave})`

**PR must include:**
- Before/after screenshots
- Test coverage delta
- Bundle size impact
- Link to migration tracker row

**Acceptance criteria:**
- PR passes all CI checks
- Code review approved
- No regressions in existing functionality
