# Route Map — HSBC Loans Portal

## Route Architecture

```
Angular Router (AppRoutingModule)
│
├── /login          → LoginModule (lazy)     [NO GUARD]
├── /dashboard      → DashboardModule (lazy) [AuthGuard]
├── /loan-application → LoanApplicationModule (lazy) [AuthGuard]
├── /loan-calculator  → LoanCalculatorModule (lazy) [AuthGuard]
├── /loan-status      → LoanStatusModule (lazy) [AuthGuard]
├── /profile          → ProfileModule (lazy) [AuthGuard]
├── / (empty)         → redirectTo: /login
└── ** (wildcard)     → redirectTo: /login
```

## Route Details

| Path | Module | Component | Guard | Lazy | Deep Link | Query Params | React Route |
|------|--------|-----------|-------|------|-----------|-------------|-------------|
| `/login` | LoginModule | LoginComponent | None | Yes | N/A | None | `<Route path="/login" element={<LoginPage />} />` |
| `/dashboard` | DashboardModule | DashboardComponent | AuthGuard | Yes | N/A | None | `<Route path="/dashboard" element={<DashboardPage />} />` |
| `/loan-application` | LoanApplicationModule | LoanApplicationComponent | AuthGuard | Yes | N/A | None | `<Route path="/loan-application" element={<LoanApplicationPage />} />` |
| `/loan-calculator` | LoanCalculatorModule | LoanCalculatorComponent | AuthGuard | Yes | N/A | None | `<Route path="/loan-calculator" element={<LoanCalculatorPage />} />` |
| `/loan-status` | LoanStatusModule | LoanStatusComponent | AuthGuard | Yes | N/A | None | `<Route path="/loan-status" element={<LoanStatusPage />} />` |
| `/profile` | ProfileModule | ProfileComponent | AuthGuard | Yes | N/A | None | `<Route path="/profile" element={<ProfilePage />} />` |
| `/` | N/A | N/A | N/A | N/A | N/A | N/A | `<Navigate to="/login" />` |
| `**` | N/A | N/A | N/A | N/A | N/A | N/A | `<Route path="*" element={<Navigate to="/login" />} />` |

## Guard Analysis

### AuthGuard (CanActivate)

**Location**: `src/app/shared/guards/auth.guard.ts`

**Logic**:
```typescript
canActivate(): boolean {
  if (this.authService.isLoggedIn) {
    return true;
  }
  this.router.navigate(['/login']);
  return false;
}
```

**Protected Routes**: `/dashboard`, `/loan-application`, `/loan-calculator`, `/loan-status`, `/profile`

**React Equivalent**:
```tsx
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

## Lazy Loading Analysis

All 6 feature routes use Angular's lazy loading via `loadChildren`:
```typescript
{ path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) }
```

**React equivalent**: `React.lazy()` + `Suspense`
```tsx
const LoginPage = lazy(() => import('./pages/Login'));
// In routes:
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/login" element={<LoginPage />} />
</Suspense>
```

## Navigation Patterns

| Navigation Type | Angular Usage | React Equivalent |
|----------------|--------------|-----------------|
| Template link | `routerLink="/dashboard"` | `<Link to="/dashboard">` |
| Active link | `routerLinkActive="active"` | `<NavLink className={({isActive}) => isActive ? 'active' : ''}>` |
| Programmatic | `this.router.navigate(['/login'])` | `navigate('/login')` |
| Route detection | `router.events.pipe(filter(NavigationEnd))` | `useLocation().pathname` |

## Cross-Route Navigation Flows

```
Login → (on success) → Dashboard
Dashboard → Apply for Loan → Loan Application
Dashboard → Loan Calculator → Loan Calculator
Dashboard → View My Loans → Loan Status
Loan Calculator → Apply for This Loan → Loan Application
Loan Status → New Application → Loan Application
Any authenticated page → Sidebar nav → Any other authenticated page
Any page → Header logout → Login
```

## URL Structure

No route parameters (`:id`) are used. All routes are simple paths.
No query parameters are used.
No hash-based routing.
Base href is `/`.
