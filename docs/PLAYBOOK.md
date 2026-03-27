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
