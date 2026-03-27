# Workflow 0 — Migration Orchestrator

Master orchestrator that runs the full Angular 13.3.11 → React 18.3.x migration end-to-end. Calls each child workflow in sequence, tracks progress, and enforces quality gates between phases.

- **Duration**: 8–14 weeks total
- **Repeat**: No

## Prerequisites

- Access to both repos:
  - Setup repo: `cogdeasy/red-angular-13.3.11-set-up` (this repo — playbook, rules, workflows)
  - Angular repo: `cogdeasy/red-angular-13.3.11` (source app — READ-ONLY)
- Node.js >= 18 installed
- Git configured

## Migration Phases

```
Phase 0          Phase 1            Phase 2–4              Phase 5
┌──────────┐    ┌──────────────┐    ┌───────────────────┐    ┌──────────────┐
│ Assess & │───►│ Foundation   │───►│ Migration Waves   │───►│ Angular      │
│ Inventory│    │ Setup        │    │ (repeat per wave) │    │ Removal      │
│          │    │              │    │                   │    │              │
│ /workflow│    │ /workflow-2  │    │ ┌───────────────┐ │    │ /workflow-5  │
│ -1-assess│    │ -foundation  │    │ │ For each route│ │    │ -angular-    │
│          │    │              │    │ │ /workflow-3   │ │    │ removal      │
│          │    │              │    │ │ -migrate-route│ │    │              │
│          │    │              │    │ └───────┬───────┘ │    │              │
│          │    │              │    │         │         │    │              │
│          │    │              │    │ ┌───────▼───────┐ │    │              │
│          │    │              │    │ │ After wave:   │ │    │              │
│          │    │              │    │ │ /workflow-4   │ │    │              │
│          │    │              │    │ │ -validate-wave│ │    │              │
│          │    │              │    │ └───────────────┘ │    │              │
└──────────┘    └──────────────┘    └───────────────────┘    └──────────────┘
   3–5 days         1–2 weeks          5–8 weeks               1–2 weeks
```

## Step 1 — Assessment & Inventory

Run `/workflow-1-assess` against the Angular source repo.

**Inputs:**
- Angular source: `cogdeasy/red-angular-13.3.11`

**Gate:** All assessment outputs exist and are complete:
- [ ] `assessment/component_inventory.csv` — 11 components
- [ ] `assessment/service_inventory.csv` — 3 services
- [ ] `assessment/route-map.md` — 6 routes + 2 redirects
- [ ] `assessment/dependency-map.csv` — 28 dependencies categorized
- [ ] `assessment/test_baseline.md` — current coverage documented
- [ ] `assessment/performance_baseline.md` — Lighthouse scores captured
- [ ] `docs/migration_plan.md` — 5 waves with assignments

**If gate passes → proceed to Step 2.**

## Step 2 — Foundation Setup

Run `/workflow-2-foundation` to scaffold the React project and coexistence bridge.

**Inputs:**
- Assessment outputs from Step 1
- Angular styles from source repo

**Gate:** Foundation is validated:
- [ ] React dev server starts without errors
- [ ] All 6 routes render placeholder components
- [ ] Auth bridge works bidirectionally (Angular ↔ React via localStorage)
- [ ] Design tokens render correctly (13 HSBC colors as CSS custom properties)
- [ ] CI pipeline passes (lint, typecheck, unit tests, build)
- [ ] single-spa bridge mounts both apps without conflicts
- [ ] Lighthouse baseline captured for React shell

**If gate passes → proceed to Step 3.**

## Step 3 — Migration Waves

Execute waves 1–5 sequentially. Each wave consists of:

1. **For each route in the wave:** Run `/workflow-3-migrate-route`
2. **After all routes in wave complete:** Run `/workflow-4-validate-wave`

### Wave 1 — Leaf Pages (5–7 days)

| Route | Component | Complexity | Risk |
|-------|-----------|-----------|------|
| `/login` | LoginComponent | 2/5 | Low |
| `/profile` | ProfileComponent | 3/5 | Low |

Run `/workflow-3-migrate-route` for `/login`, then `/profile`.
Then run `/workflow-4-validate-wave` with `wave_number=1`.

**Wave 1 gate:** `/workflow-4-validate-wave` produces GO decision.
**If GO → proceed to Wave 2. If NO-GO → fix blockers and re-validate.**

### Wave 2 — Read-Only Pages (7–10 days)

| Route | Component | Complexity | Risk |
|-------|-----------|-----------|------|
| `/dashboard` | DashboardComponent | 3/5 | Medium |
| `/loan-status` | LoanStatusComponent | 3/5 | Medium |

Run `/workflow-3-migrate-route` for `/dashboard`, then `/loan-status`.
Then run `/workflow-4-validate-wave` with `wave_number=2`.

**Wave 2 gate:** GO decision from `/workflow-4-validate-wave`.

### Wave 3 — Interactive Pages (5–7 days)

| Route | Component | Complexity | Risk |
|-------|-----------|-----------|------|
| `/loan-calculator` | LoanCalculatorComponent | 4/5 | Medium |

Run `/workflow-3-migrate-route` for `/loan-calculator`.
Then run `/workflow-4-validate-wave` with `wave_number=3`.

**Wave 3 gate:** GO decision from `/workflow-4-validate-wave`.

### Wave 4 — Complex Pages (7–10 days)

| Route | Component | Complexity | Risk |
|-------|-----------|-----------|------|
| `/loan-application` | LoanApplicationComponent | 5/5 | High |

Run `/workflow-3-migrate-route` for `/loan-application`.
Then run `/workflow-4-validate-wave` with `wave_number=4`.

**Wave 4 gate:** GO decision from `/workflow-4-validate-wave`.

### Wave 5 — Shell & Cleanup (5–7 days)

| Component | Complexity | Risk |
|-----------|-----------|------|
| AppComponent (AppShell) | 3/5 | Medium |
| HeaderComponent | 3/5 | Medium |
| SidebarComponent | 2/5 | Low |
| FooterComponent | 1/5 | Low |
| LoadingSpinnerComponent | 1/5 | Low |

Run `/workflow-3-migrate-route` for each shell component.
Then run `/workflow-4-validate-wave` with `wave_number=5`.

**Wave 5 gate:** GO decision from `/workflow-4-validate-wave`.

## Step 4 — Angular Removal

Run `/workflow-5-angular-removal` to remove Angular, single-spa, and all migration infrastructure.

**Prerequisites (enforced):**
- All 5 wave reports show GO decision
- Migration tracker shows 100% migrated
- Zero critical bugs in React version

**Final gate:**
- [ ] Zero Angular packages in `package.json`
- [ ] Zero Angular source files remain
- [ ] All E2E tests pass on pure React app
- [ ] Lighthouse scores meet or exceed Angular baseline
- [ ] Bundle size <= Angular baseline
- [ ] axe-core: zero critical/serious violations
- [ ] Git tag `angular-archive-v1.0` created
- [ ] `docs/final-migration-report.md` produced

## Progress Tracking

Update `docs/migration-tracker.md` after each step:

| Phase | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| Assessment | ⬜ Not Started | — | — | |
| Foundation | ⬜ Not Started | — | — | |
| Wave 1 (Leaf) | ⬜ Not Started | — | — | |
| Wave 2 (Read-Only) | ⬜ Not Started | — | — | |
| Wave 3 (Interactive) | ⬜ Not Started | — | — | |
| Wave 4 (Complex) | ⬜ Not Started | — | — | |
| Wave 5 (Shell) | ⬜ Not Started | — | — | |
| Angular Removal | ⬜ Not Started | — | — | |

## Rollback Decision Tree

At any quality gate, if NO-GO:

1. **Single test failure?** → Fix and re-run validation
2. **Performance regression > 15%?** → Profile, optimize, re-validate
3. **Accessibility violation?** → Fix ARIA/keyboard issues, re-validate
4. **Multiple failures across routes?** → Roll back wave, investigate root cause
5. **Architectural issue with bridge?** → Pause migration, escalate to tech lead
6. **After 3 failed validation attempts?** → Stakeholder review meeting required

## Completion Criteria

The migration is **DONE** when ALL of the following are true:

- [ ] Zero Angular dependencies in `package.json`
- [ ] Zero Angular source files in the project
- [ ] Zero `.module.ts` files
- [ ] Full E2E suite green on React-only build
- [ ] Lighthouse scores meet or exceed Angular baseline
- [ ] Bundle size <= Angular baseline (target 20% reduction)
- [ ] axe-core: zero critical/serious violations across all routes
- [ ] `docs/final-migration-report.md` produced and approved
- [ ] Git tag `angular-archive-v1.0` pushed
- [ ] Migration infrastructure removed (assessment/, .windsurf/ workflows)
