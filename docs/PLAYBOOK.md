# HSBC Loans Portal — Angular 13.3.11 to React 18 Migration Playbook

## Executive Summary

This playbook guides the incremental migration of the HSBC Loans Portal from Angular 13.3.11
to React 18.3.x using the **Strangler Fig pattern**. The application has 6 routes, 11 components,
3 services, 1 guard, 11 TypeScript models, and 1 custom pipe.

**Timeline**: 10-14 weeks (5 migration waves)
**Strategy**: single-spa coexistence with route-level feature flags
**Risk**: Low-Medium (mock data, no real API, straightforward domain model)

---

## Source Application Profile

| Metric | Value |
|--------|-------|
| Framework | Angular 13.3.11 (EOL May 2023) |
| Routes | 6 (login, dashboard, loan-application, loan-calculator, loan-status, profile) |
| Components | 11 (5 page, 4 shared layout, 1 root shell, 1 inline template) |
| Services | 3 (AuthService, LoanService, NotificationService) |
| Guards | 1 (AuthGuard — CanActivate) |
| Models/Interfaces | 12 (User + 11 loan domain types) |
| Pipes | 1 (CurrencyFormatPipe) |
| Forms | 2 patterns (template-driven: login/profile, reactive: loan-application) |
| Styling | SCSS with Angular Material theme (HSBC custom palette) |
| Testing | Karma + Jasmine (minimal — no coverage reports found) |
| Third-party | chart.js 3.7, ng2-charts 3.1, Angular Material 13.3.9 |
| Build | @angular-devkit/build-angular (Webpack) |
| Bundle budget | 2MB initial warning, 5MB error |

## Target Stack

| Category | Technology | Version |
|----------|-----------|---------|
| UI Library | React | 18.3.x LTS |
| Language | TypeScript | 5.x (strict) |
| Bundler | Vite | 5.x |
| Routing | React Router | 6.x |
| Server State | TanStack Query | 5.x |
| Client State | Zustand | 4.x |
| Forms | React Hook Form + Zod | 7.x + 3.x |
| Unit Testing | Vitest + React Testing Library | 1.x + 14.x |
| E2E Testing | Playwright | 1.x |
| API Mocking | MSW | 2.x |
| Accessibility | axe-core | 4.x |
| CI/CD | GitHub Actions | latest |

## Migration Waves

### Wave 1 — Leaf Pages (Week 1-2)
| Route | Component | Complexity | Dependencies | Est. Days |
|-------|-----------|-----------|-------------|-----------|
| `/login` | LoginComponent | 2/5 | AuthService | 2-3 |
| `/profile` | ProfileComponent | 2/5 | AuthService | 2-3 |

**Why first**: Simplest pages, fewest dependencies, builds team confidence.
Login uses template-driven forms (simple to convert). Profile has basic view/edit toggle.

### Wave 2 — Read-Only Pages (Week 3-5)
| Route | Component | Complexity | Dependencies | Est. Days |
|-------|-----------|-----------|-------------|-----------|
| `/dashboard` | DashboardComponent | 3/5 | AuthService, LoanService | 4-5 |
| `/loan-status` | LoanStatusComponent | 3/5 | LoanService | 4-5 |

**Why second**: Data display pages with moderate complexity. Dashboard uses forkJoin
(→ parallel useQuery). Loan Status has filtering/search logic and expandable cards.

### Wave 3 — Interactive Pages (Week 6-8)
| Route | Component | Complexity | Dependencies | Est. Days |
|-------|-----------|-----------|-------------|-----------|
| `/loan-calculator` | LoanCalculatorComponent | 3/5 | LoanService | 4-5 |

**Why third**: Two-way binding intensive (ngModel ↔ controlled inputs), SVG donut chart,
amortization schedule with pagination. Good test of React's controlled component model.

### Wave 4 — Complex Pages (Week 9-11)
| Route | Component | Complexity | Dependencies | Est. Days |
|-------|-----------|-----------|-------------|-----------|
| `/loan-application` | LoanApplicationComponent | 5/5 | AuthService, LoanService | 5-7 |

**Why fourth**: Most complex component. 4-step wizard with 3 FormGroups, complex validation,
conditional fields, step navigation, estimated payment calculation. Requires React Hook Form
multi-step pattern with shared form context.

### Wave 5 — Shell & Cleanup (Week 12-14)
| Component | Complexity | Dependencies | Est. Days |
|-----------|-----------|-------------|-----------|
| AppComponent (Shell) | 3/5 | AuthService, Router | 2-3 |
| HeaderComponent | 3/5 | AuthService, NotificationService | 2-3 |
| SidebarComponent | 2/5 | Router | 1-2 |
| FooterComponent | 1/5 | None | 0.5 |
| LoadingSpinnerComponent | 1/5 | None | 0.5 |

**Why last**: Shell components wrap everything. Must be migrated together.
Includes notification panel (BehaviorSubject → Zustand), sidebar collapse toggle,
and auth-aware layout switching.

---

## Workflow Walkthrough

This migration follows 5 sequential workflows. Each workflow has explicit inputs, outputs, steps, and acceptance criteria defined in `.windsurf/workflows/`.

### Workflow 1 — Assess & Inventory ✅ (Complete)

**File**: `.windsurf/workflows/workflow-1-assess.yaml`
**Duration**: 3-5 days | **Status**: Done

**What it does**: Systematically inventories every piece of the Angular codebase to produce a complete migration plan.

**Steps**:
1. **Inventory Modules** — Scan `angular.json` and all `*.module.ts` files. Map the module tree.
2. **Inventory Components** — Catalog every component with its selector, template type, complexity score (1-5), and Angular patterns used (e.g., `*ngFor`, `[(ngModel)]`, reactive forms).
3. **Inventory Services** — Catalog every injectable service with its RxJS patterns (BehaviorSubject, Observable chains), methods, and state management approach.
4. **Inventory Routes** — Map every route with its path, guards, resolvers, lazy loading config, and navigation flows.
5. **Audit Dependencies** — Categorize all `package.json` dependencies into: Angular Core (remove), Angular Wrappers (replace), Third-party (keep/replace), Dev Tools (replace).
6. **Inventory Models** — Catalog all TypeScript interfaces, enums, and types. These carry over directly to React.
7. **Capture Test Baseline** — Document current test coverage (Karma/Jasmine) and identify gaps.
8. **Capture Performance Baseline** — Estimate bundle sizes, Lighthouse scores, and set React performance budgets.
9. **Produce Migration Plan** — Assign components to waves, estimate effort, identify risks.

**Outputs** (in `assessment/`):
- `component_inventory.csv` — 11 components with complexity scores and wave assignments
- `service_inventory.csv` — 3 services with RxJS patterns and React equivalents
- `route-map.md` — 6 routes with guards, lazy loading, and navigation flows
- `dependency-map.csv` — 28 packages categorized with React replacements
- `test_baseline.md` — Current coverage (minimal) and React testing targets
- `performance_baseline.md` — Bundle analysis and performance budgets

---

### Workflow 2 — Foundation Setup (Next Up)

**File**: `.windsurf/workflows/workflow-2-foundation.yaml`
**Duration**: 1-2 weeks

**What it does**: Scaffolds the React project and sets up the single-spa bridge so Angular and React can run side-by-side in the same browser window.

**Steps**:
1. **Scaffold React Project** — `npm create vite@latest` with React + TypeScript template. Configure `tsconfig.json` with strict mode.
2. **Install Target Stack** — React Router 6, TanStack Query 5, Zustand 4, React Hook Form 7, Zod 3, Vitest, Playwright, MSW 2.
3. **Configure single-spa Bridge** — Install `single-spa`, register both Angular and React apps. Angular becomes the "legacy" app, React becomes the "new" app. Route ownership table controls which framework serves which URL.
4. **Create Shared Design Tokens** — Extract HSBC color palette (`$hsbc-red: #DB0011`, etc.) and spacing tokens from Angular's `styles.scss` into CSS custom properties (`--hsbc-red`, `--spacing-md`, etc.) shared by both frameworks.
5. **Build Auth Bridge** — Both Angular and React read/write the same `localStorage` key (`hsbc_auth`). Create a `useAuth()` React hook that mirrors `AuthService`'s behavior. Cross-framework auth events keep both apps in sync.
6. **Create Protected Route** — React equivalent of `AuthGuard`: a `<ProtectedRoute>` component that redirects to `/login` if not authenticated.
7. **Set Up MSW** — Create mock service worker handlers that return the same mock data as Angular's services (5 loans, 4 notifications, user James Chen).
8. **Configure Vitest** — Unit test config with jsdom, React Testing Library, coverage thresholds (80% statements).
9. **Configure Playwright** — E2E test config targeting `http://localhost:4200` (Angular) and `http://localhost:5173` (React).
10. **Configure Lighthouse CI** — Performance budgets (FCP < 1.5s, LCP < 2.0s, CLS < 0.05, TBT < 200ms).
11. **Create CI Pipeline** — GitHub Actions workflow: lint → type-check → unit tests → build → E2E tests → Lighthouse → deploy preview.
12. **Smoke Test** — Verify both Angular and React apps load, auth bridge works, route switching between frameworks works.
13. **Document** — Update migration tracker, create foundation ADR.

**Outputs**:
- Working React project alongside Angular
- single-spa config routing traffic between frameworks
- Shared auth state via localStorage
- CI pipeline running on every PR
- Smoke test proving coexistence works

**Why this matters**: After this workflow, you have the infrastructure to migrate routes one at a time. Without it, you'd need a "big bang" cutover.

---

### Workflow 3 — Migrate Route (Repeatable — Run Once Per Route)

**File**: `.windsurf/workflows/workflow-3-migrate-route.yaml`
**Duration**: 1-5 days per route (depending on complexity)

**What it does**: Takes a single Angular route and converts it to React. This workflow is run 6 times — once for each route, in wave order.

**Steps**:
1. **Analyze Angular Component** — Read the component's TypeScript, HTML template, and SCSS. List every Angular pattern used (directives, pipes, form controls, subscriptions).
2. **Create React Component** — Translate the component using the patterns in `.windsurf/rules/migration-patterns.md`. Function component with hooks.
3. **Extract Custom Hooks** — Pull service logic into React hooks: `useAuth()` (from AuthService), `useLoans()` / `useDashboardStats()` (from LoanService via TanStack Query), `useNotificationStore()` (from NotificationService via Zustand).
4. **Migrate Styles** — Convert SCSS to CSS modules (or keep SCSS). Replace Angular Material components with plain HTML + HSBC design tokens.
5. **Migrate Forms** — Template-driven (`ngModel`) → controlled inputs. Reactive forms (`FormBuilder`) → React Hook Form + Zod schema.
6. **Write Unit Tests** — Vitest + React Testing Library. Test rendering, user interactions, hook behavior.
7. **Write Integration Tests** — Test component with its hooks, mocked API (MSW), and router context.
8. **Write E2E Parity Test** — Playwright test that runs the same user flow against both Angular and React versions and asserts identical behavior.
9. **Add Feature Flag** — Create `ff_react_{route_name}` flag. When ON, single-spa routes to React. When OFF, routes to Angular. Default: OFF.
10. **Visual Regression Test** — Capture screenshots at 3 viewports (mobile, tablet, desktop). Compare Angular vs React renders.
11. **Accessibility Audit** — Run axe-core against the React version. Zero critical/serious violations.
12. **Performance Check** — Verify React version meets route-level performance targets.
13. **Enable Feature Flag** — Flip `ff_react_{route_name}` to ON in staging. Run full E2E suite.
14. **Update Tracker** — Mark route as migrated in `docs/migration-tracker.md`.

**Run order** (by wave):
| Wave | Route | Complexity | Why This Order |
|------|-------|-----------|----------------|
| 1 | `/login` | 2/5 | Simplest form, no guard needed on this page, builds confidence |
| 1 | `/profile` | 2/5 | Simple view/edit toggle, similar auth dependency |
| 2 | `/dashboard` | 3/5 | Read-only data display, introduces TanStack Query pattern |
| 2 | `/loan-status` | 3/5 | List with search/filter, expandable cards |
| 3 | `/loan-calculator` | 3/5 | Two-way binding intensive, SVG chart, real-time calculation |
| 4 | `/loan-application` | 5/5 | Most complex — 4-step wizard, multi-group reactive forms, validation |

---

### Workflow 4 — Validate Wave (Run After Each Wave)

**File**: `.windsurf/workflows/workflow-4-validate-wave.yaml`
**Duration**: 2-3 days per wave

**What it does**: Quality gate that must pass before starting the next wave. Ensures the migrated routes meet all quality criteria.

**Steps**:
1. **Run Full E2E Suite** — All Playwright tests (both Angular and React routes) must pass.
2. **Visual Regression Review** — Review all Chromatic/Percy snapshots. No unexpected visual diffs.
3. **Accessibility Audit** — axe-core scan of all migrated routes. Zero critical/serious violations.
4. **Performance Audit** — Lighthouse CI on all migrated routes. Must meet budgets (FCP, LCP, CLS, TBT).
5. **Bundle Size Check** — Total bundle (Angular + React) must not exceed 150% of Angular-only baseline.
6. **Code Review** — All React code follows conventions in `.windsurfrules`. No Angular patterns leaking in.
7. **Test Coverage Check** — Migrated components meet coverage thresholds (80% statements, 75% branches).
8. **Rollback Test** — Flip all feature flags OFF. Verify Angular versions still work correctly.
9. **Go/No-Go Report** — Produce a report with pass/fail for each criterion. All must pass to proceed.

**Wave definitions**:
| Wave | Routes Validated | Go/No-Go Gate |
|------|-----------------|---------------|
| Wave 1 | Login + Profile | 2 routes on React, auth flow works end-to-end |
| Wave 2 | + Dashboard + Loan Status | 4 routes on React, data display correct |
| Wave 3 | + Loan Calculator | 5 routes on React, interactive features work |
| Wave 4 | + Loan Application | All 6 page routes on React, complex forms work |
| Wave 5 | Shell components | Angular fully removed, standalone React SPA |

---

### Workflow 5 — Angular Removal (Final)

**File**: `.windsurf/workflows/workflow-5-angular-removal.yaml`
**Duration**: 1-2 weeks

**What it does**: Once all routes are on React, this workflow removes Angular, single-spa, and all coexistence infrastructure. The result is a clean, standalone React SPA.

**Steps**:
1. **Pre-Removal Audit** — Verify all 6 routes are served by React. All feature flags are ON. All E2E tests pass.
2. **Remove Feature Flags** — Delete all `ff_react_*` flags and the feature flag infrastructure.
3. **Remove single-spa** — Uninstall single-spa, remove the bridge config, convert React app to standalone SPA with `react-router-dom`.
4. **Remove Angular Dependencies** — `npm uninstall @angular/*`, `rxjs`, `zone.js`, `ng2-charts`, `karma`, `jasmine`, and all Angular-related packages.
5. **Remove Angular Source** — Delete all `.component.ts`, `.module.ts`, `.service.ts`, `.guard.ts`, `.pipe.ts` Angular files. Delete `angular.json`, `karma.conf.js`, `polyfills.ts`.
6. **Remove Angular Configs** — Delete `tsconfig.app.json`, `tsconfig.spec.json` (Angular-specific), `.browserslistrc`, `angular.json`.
7. **Consolidate Project** — Clean up `package.json` scripts, update `README.md`, ensure `vite.config.ts` is the sole build config.
8. **Final Test Suite** — Run all Vitest unit tests, RTL integration tests, Playwright E2E tests. 100% must pass.
9. **Final Performance Audit** — Lighthouse CI. React-only bundle should be 20-40% smaller than Angular.
10. **Final Accessibility Audit** — axe-core on all 6 routes. Zero violations.
11. **Archive Angular** — Create a git tag `angular-final` on the last commit before removal. Archive for reference.
12. **Final Report** — Produce migration completion report: timeline, effort, test coverage, performance comparison, lessons learned.
13. **Cleanup Migration Infra** — Remove this setup repo's assessment files, coexistence rules, and migration tracker (they're no longer needed). Keep architectural decisions and concept mapping as documentation.

**Outputs**:
- Standalone React 18 SPA (no Angular traces)
- Final migration report
- `angular-final` git tag for historical reference
- 20-40% bundle size reduction vs Angular

---

## Key Migration Patterns

Detailed code examples are in `.windsurf/rules/migration-patterns.md`. Summary:

| Angular Pattern | React Equivalent |
|----------------|-----------------|
| `@Component` decorator | Function component |
| `ngOnInit` | `useEffect(fn, [])` |
| `constructor(private svc)` | `const val = useHook()` |
| `BehaviorSubject.subscribe()` | `useContext` / `useState` |
| `forkJoin([...]).subscribe()` | Multiple `useQuery` hooks |
| `FormBuilder.group({})` | `useForm({ resolver: zodResolver(schema) })` |
| `*ngIf="condition"` | `{condition && <Element />}` |
| `*ngFor="let item of items"` | `{items.map(item => <Element key={id} />)}` |
| `[(ngModel)]="value"` | `value={value} onChange={handler}` |
| `Pipe.transform()` | Utility function |
| `CanActivate guard` | `<ProtectedRoute>` wrapper |
| `loadChildren: () => import(...)` | `React.lazy(() => import(...))` |
| Angular Material `<mat-icon>` | `@mui/icons-material` or `react-icons` |

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Angular Material visual diff | Medium | Medium | Pixel-perfect Chromatic/Percy snapshots |
| RxJS subscription leak patterns | Low | Low | No RxJS in React, but audit Angular cleanup |
| Multi-step form state loss | Medium | High | React Hook Form with session persistence |
| Bundle size increase (two frameworks) | Medium | Medium | Monitor with vite-plugin-visualizer, remove Angular ASAP |
| zone.js interference | Low | High | Isolate React from zone.js in single-spa config |
| Team learning curve | Medium | Medium | 4-week training plan in SKILLS.md |
| Mock data drift between Angular/React | Low | Medium | Shared MSW handlers used by both |

## Cross-References

| Document | Purpose |
|----------|---------|
| `.windsurfrules` | Project rules and code conventions |
| `SKILLS.md` | Team skill matrix and training plan |
| `.windsurf/workflows/workflow-1-assess.yaml` | Assessment & Inventory |
| `.windsurf/workflows/workflow-2-foundation.yaml` | Foundation Setup |
| `.windsurf/workflows/workflow-3-migrate-route.yaml` | Per-Route Migration (repeatable) |
| `.windsurf/workflows/workflow-4-validate-wave.yaml` | Wave Validation & Go/No-Go |
| `.windsurf/workflows/workflow-5-angular-removal.yaml` | Angular Removal & Finalization |
| `.windsurf/rules/coexistence-rules.md` | single-spa architecture, shared state contracts |
| `.windsurf/rules/testing-rules.md` | Testing pyramid, E2E parity, performance budgets |
| `.windsurf/rules/migration-patterns.md` | Angular → React code translation examples |
| `docs/concept-mapping.md` | Full Angular → React concept mapping |
| `docs/architectural-decisions.md` | ADRs for key technology choices |
| `docs/migration-tracker.md` | Per-route progress tracker |
| `docs/user-stories.md` | Testable user stories per wave |
| `docs/traceability-matrix.md` | Story → code → test → verification links |
| `assessment/` | Component/service inventories, route map, dependency audit |

## Case Study References

- **Crunch-IS (2024)**: Angular 12 → React migration using single-spa. Achieved 25% time reduction, 40% acceleration with AI-assisted translation.
- **INSART (2023)**: Angular to React migration. Documented pattern mapping, emphasised incremental approach.
- **DEFTeam (2024)**: Angular to React migration. Highlighted RxJS-to-hooks translation challenges.
- **Monica Parra (2023)**: Large-scale Angular-to-React migration. Stressed testing parity.
- **Netguru (2023)**: Migration planning guide. Covered team readiness assessment.

## Success Criteria

Migration is complete when:
- [ ] Zero Angular dependencies in `package.json`
- [ ] Zero Angular source files in `src/`
- [ ] All 6 routes served by React
- [ ] Full E2E test suite passes on React-only build
- [ ] Lighthouse scores meet or exceed Angular baseline
- [ ] Bundle size <= Angular baseline (target 20% reduction)
- [ ] Zero critical/serious accessibility violations
- [ ] Final migration report produced
