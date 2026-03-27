# HSBC Loans Portal — Angular 13.3.11 to React 18 Migration Setup

Migration playbook, assessment, and tooling for migrating the [HSBC Loans Portal](https://github.com/cogdeasy/red-angular-13.3.11) from Angular 13.3.11 to React 18.3.x.

## Quick Links

| Document | Description |
|----------|-------------|
| [Migration Playbook](docs/PLAYBOOK.md) | Master playbook with timeline, waves, and success criteria |
| [Migration Plan](docs/migration_plan.md) | Detailed 14-week plan with task breakdowns per wave |
| [Migration Tracker](docs/migration-tracker.md) | Per-route progress tracker with checklists |
| [Concept Mapping](docs/concept-mapping.md) | Full Angular → React concept mapping |
| [Architectural Decisions](docs/architectural-decisions.md) | 7 ADRs (React 18, single-spa, Zustand, Vite, RHF+Zod, Vitest+Playwright, TanStack Query) |
| [User Stories](docs/user-stories.md) | Testable user stories for every wave |
| [Traceability Matrix](docs/traceability-matrix.md) | Story → code → test → verification links |

## Repository Structure

```
.
├── .windsurfrules                          # Project rules (architecture, code style, process)
├── SKILLS.md                               # Team skill matrix and 4-week training plan
├── .windsurf/
│   ├── rules/
│   │   ├── coexistence-rules.md            # single-spa bridge, shared auth, feature flags
│   │   ├── testing-rules.md                # Testing pyramid, E2E parity, performance budgets
│   │   └── migration-patterns.md           # Angular → React code translation examples
│   └── workflows/
│       ├── workflow-1-assess.yaml          # Assessment & Inventory (complete)
│       ├── workflow-2-foundation.yaml      # Foundation Setup (React scaffold, bridge, CI)
│       ├── workflow-3-migrate-route.yaml   # Per-Route Migration (repeatable)
│       ├── workflow-4-validate-wave.yaml   # Wave Validation & Go/No-Go
│       └── workflow-5-angular-removal.yaml # Angular Removal & Finalization
├── assessment/
│   ├── component_inventory.csv             # All 11 components with complexity scores
│   ├── service_inventory.csv               # All 3 services with RxJS patterns
│   ├── route-map.md                        # All 6 routes with guards and lazy loading
│   ├── dependency-map.csv                  # All dependencies categorized with React equivalents
│   ├── test_baseline.md                    # Current test coverage (minimal) and React targets
│   └── performance_baseline.md             # Bundle analysis and performance budgets
├── docs/
│   ├── PLAYBOOK.md                         # Master migration playbook
│   ├── migration_plan.md                   # Detailed migration plan with timeline
│   ├── migration-tracker.md                # Per-route progress tracker
│   ├── concept-mapping.md                  # Full Angular → React concept mapping
│   ├── architectural-decisions.md          # ADRs for key technology choices
│   ├── user-stories.md                     # Testable user stories per wave
│   └── traceability-matrix.md              # Story → code → test → verification links
└── README.md                               # This file
```

## Source Application Summary

| Metric | Value |
|--------|-------|
| Framework | Angular 13.3.11 (EOL May 2023) |
| Routes | 6 (login, dashboard, loan-application, loan-calculator, loan-status, profile) |
| Components | 11 (5 page, 4 shared layout, 1 root, 1 inline) |
| Services | 3 (AuthService, LoanService, NotificationService) |
| Guards | 1 (AuthGuard — CanActivate) |
| Models | 12 TypeScript interfaces/enums |
| Pipes | 1 (CurrencyFormatPipe) |
| Styling | SCSS + Angular Material theme (HSBC custom palette) |
| Testing | Karma + Jasmine (minimal coverage) |
| Build | @angular-devkit/build-angular (Webpack) |

## Target Stack

| Category | Technology |
|----------|-----------|
| UI | React 18.3.x LTS |
| Language | TypeScript 5.x (strict) |
| Bundler | Vite 5.x |
| Routing | React Router 6.x |
| Server State | TanStack Query 5.x |
| Client State | Zustand 4.x |
| Forms | React Hook Form 7.x + Zod 3.x |
| Testing | Vitest + React Testing Library + Playwright |
| Coexistence | single-spa (during migration) |

## Migration Strategy

**Strangler Fig pattern** — incremental route-by-route migration over 5 waves:

1. **Wave 1** (Week 3-4): Login + Profile (leaf pages, builds confidence)
2. **Wave 2** (Week 5-7): Dashboard + Loan Status (read-only, data display)
3. **Wave 3** (Week 8-9): Loan Calculator (interactive, two-way binding)
4. **Wave 4** (Week 9-11): Loan Application (complex multi-step form wizard)
5. **Wave 5** (Week 12-14): Shell components + Angular removal

Each wave has a **Go/No-Go gate** with quality criteria (tests, visual regression, accessibility, performance).

## How to Use This Playbook

1. **Read** the [Migration Playbook](docs/PLAYBOOK.md) for the full strategy
2. **Review** the [assessment/](assessment/) folder for the source app inventory
3. **Follow** the workflows in `.windsurf/workflows/` sequentially
4. **Track** progress in the [Migration Tracker](docs/migration-tracker.md)
5. **Reference** the [migration patterns](/.windsurf/rules/migration-patterns.md) for code translation examples

## Windsurf IDE Integration

This playbook is structured as a Windsurf-compatible project:
- `.windsurfrules` — Project-level rules loaded automatically
- `.windsurf/rules/` — Domain-specific rules
- `.windsurf/workflows/` — Automated workflow definitions
- `SKILLS.md` — Team skill matrix
