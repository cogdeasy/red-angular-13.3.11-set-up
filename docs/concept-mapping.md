# Concept Mapping — Angular 13 → React 18

## HSBC Loans Portal Full Mapping

---

## Architecture Concepts

| Angular Concept | React Equivalent | HSBC Loans Example |
|----------------|-----------------|-------------------|
| NgModule | No equivalent (tree-shaking by default) | AppModule, SharedModule → just imports |
| Lazy-loaded module | `React.lazy()` + `Suspense` | `loadChildren: () => import('./pages/login/login.module')` → `lazy(() => import('./pages/Login'))` |
| Component decorator | Function component | `@Component({...}) class LoginComponent` → `function LoginPage()` |
| Template (.html file) | JSX/TSX (inline) | `login.component.html` → JSX in `Login.tsx` |
| Styles (.scss file) | CSS Modules or co-located .scss | `login.component.scss` → `Login.module.scss` |
| `selector: 'app-root'` | No selector (mounted via React DOM) | `<app-root>` → `<div id="root">` |
| `templateUrl` | Inline JSX return | Separate file → same file |
| `styleUrls` | `import styles from './X.module.scss'` | Separate file → CSS Module import |

## Component Lifecycle

| Angular Lifecycle | React Equivalent | HSBC Loans Usage |
|------------------|-----------------|-----------------|
| `constructor()` | Function body (before return) | Service injection → Hook calls |
| `ngOnInit()` | `useEffect(() => {}, [])` | DashboardComponent data loading |
| `ngOnDestroy()` | `useEffect` cleanup return | Subscription cleanup (auto with hooks) |
| `ngOnChanges()` | `useEffect(() => {}, [dep])` | Not used in HSBC Loans |
| `ngAfterViewInit()` | `useEffect` + `useRef` | Not used in HSBC Loans |
| `ngDoCheck()` | Not needed (React re-renders) | Not used in HSBC Loans |

## Data Binding

| Angular Binding | React Equivalent | Example |
|----------------|-----------------|---------|
| `{{ expression }}` | `{expression}` | `{{ loan.amount }}` → `{loan.amount}` |
| `[property]="value"` | `property={value}` | `[isCollapsed]="sidebarCollapsed"` → `isCollapsed={sidebarCollapsed}` |
| `(event)="handler()"` | `onEvent={handler}` | `(click)="login()"` → `onClick={login}` |
| `[(ngModel)]="value"` | `value={val} onChange={set}` | `[(ngModel)]="amount"` → controlled input |
| `[ngClass]="expr"` | `className={expr}` | `[ngClass]="getStatusClass(s)"` → `className={getStatusClass(s)}` |
| `[ngStyle]="expr"` | `style={expr}` | `[style.width.%]="progress"` → `style={{ width: `${progress}%` }}` |
| `[attr.x]="val"` | `x={val}` | `[attr.stroke-dasharray]="..."` → `strokeDasharray={...}` |

## Template Directives

| Angular Directive | React Pattern | HSBC Loans Example |
|------------------|--------------|-------------------|
| `*ngIf="cond"` | `{cond && <El />}` | `*ngIf="isLoading"` → `{isLoading && <Spinner />}` |
| `*ngIf="cond; else tpl"` | Ternary `{cond ? <A /> : <B />}` | `*ngIf="!isEditing; else editForm"` → `{isEditing ? <EditForm /> : <ViewMode />}` |
| `*ngFor="let x of xs"` | `{xs.map(x => <El key={} />)}` | `*ngFor="let loan of filteredLoans"` → `{filteredLoans.map(loan => ...)}` |
| `*ngFor="let x; let i = index"` | `{xs.map((x, i) => ...)}` | Used in stepper, timeline |
| `*ngFor="let x; let last = last"` | `{xs.map((x, i) => ...)}` + `i === xs.length - 1` | Timeline steps |
| `[hidden]="cond"` | `style={{ display: cond ? 'none' : undefined }}` | Not used (prefer *ngIf) |
| `ngSwitch` | Multiple ternaries or function | `getStatusClass(status)` switch statement → same function |

## Dependency Injection → Hooks

| Angular DI | React Hook | HSBC Loans Mapping |
|-----------|-----------|-------------------|
| `constructor(private authService: AuthService)` | `const { user, login, logout } = useAuth()` | All authenticated components |
| `constructor(private loanService: LoanService)` | `const { data } = useLoans()` | Dashboard, LoanStatus, LoanCalc |
| `constructor(private notifService: NotificationService)` | `const { notifications } = useNotificationStore()` | Header |
| `constructor(private router: Router)` | `const navigate = useNavigate()` | Login (redirect), Guard |
| `constructor(private route: ActivatedRoute)` | `const params = useParams()` | Not used (no param routes) |
| `constructor(private fb: FormBuilder)` | `const form = useForm()` | LoanApplication |

## RxJS → React Patterns

| RxJS Pattern | React Pattern | HSBC Loans Usage |
|-------------|--------------|-----------------|
| `BehaviorSubject<T>` | `useState<T>` or Context | Auth state, notifications |
| `subject.next(value)` | `setState(value)` | Login updates, notification updates |
| `subject.asObservable()` | Context value / store selector | `isAuthenticated$`, `currentUser$` |
| `.subscribe(val => this.x = val)` | Direct destructuring from hook | `authService.isAuthenticated$.subscribe(...)` → `const { isAuthenticated } = useAuth()` |
| `of(value).pipe(delay(ms))` | `await new Promise(r => setTimeout(r, ms))` | Mock API delay in AuthService |
| `pipe(tap(fn))` | Side effect in async function | Login side effects |
| `forkJoin([obs1, obs2])` | Multiple `useQuery` hooks (parallel) | Dashboard data loading |
| `pipe(filter(fn))` | Conditional logic in `useEffect` | Router event filtering |
| `Observable<T>` return type | `Promise<T>` or TanStack Query | Service method returns |

## Forms

| Angular Forms | React Hook Form | HSBC Loans Usage |
|--------------|----------------|-----------------|
| `ReactiveFormsModule` | `react-hook-form` | LoanApplication wizard |
| `FormsModule` (template-driven) | Controlled inputs | Login, Profile edit, Calculator |
| `FormGroup` | `useForm<T>()` return | personalInfoForm, employmentForm, loanDetailsForm |
| `FormBuilder.group({})` | `useForm({ defaultValues, resolver })` | `this.fb.group({...})` |
| `Validators.required` | `z.string().min(1)` | All required fields |
| `Validators.email` | `z.string().email()` | Email fields |
| `Validators.minLength(n)` | `z.string().min(n)` | Name fields |
| `Validators.pattern(regex)` | `z.string().regex(regex)` | Phone field |
| `Validators.min(n)` / `max(n)` | `z.number().min(n).max(n)` | Loan amount, term |
| `formControlName="field"` | `{...register('field')}` | Form inputs |
| `form.get('field').errors` | `errors.field?.message` | Error display |
| `form.valid` | `formState.isValid` | Submit button enable |
| `form.markAllAsTouched()` | Handled by RHF on submit | Force validation display |

## Routing

| Angular Router | React Router 6 | HSBC Loans Usage |
|---------------|----------------|-----------------|
| `RouterModule.forRoot(routes)` | `<BrowserRouter>` + `<Routes>` | App-level routing |
| `RouterModule.forChild(routes)` | Nested `<Route>` | Feature module routes |
| `loadChildren: () => import(...)` | `React.lazy(() => import(...))` | All 6 page routes |
| `canActivate: [AuthGuard]` | `<ProtectedRoute>` wrapper | 5 routes (all except login) |
| `routerLink="/path"` | `<Link to="/path">` | Sidebar nav, buttons |
| `[routerLink]="path"` | `<Link to={path}>` | Dynamic links |
| `routerLinkActive="class"` | `<NavLink className={({isActive}) => ...}>` | Sidebar active state |
| `router.navigate(['/path'])` | `navigate('/path')` | Login redirect |
| `router.events` | `useLocation()` | Detecting current route |
| `NavigationEnd` event | `location.pathname` | isLoginPage check |
| `{ path: '', redirectTo: '/login' }` | `<Navigate to="/login" />` | Default redirect |
| `{ path: '**', redirectTo: '/login' }` | `<Route path="*" element={<Navigate to="/login" />} />` | Wildcard |

## Angular Material → React UI

| Angular Material | React Alternative | HSBC Loans Usage |
|-----------------|------------------|-----------------|
| `MatIconModule` / `<mat-icon>` | `react-icons/md` or `@mui/icons-material` | Icons throughout app |
| `MatButtonModule` | Native `<button>` with HSBC styles | Styled buttons (already custom) |
| `MatMenuModule` / `<mat-menu>` | `@radix-ui/react-dropdown-menu` or custom | Header user menu |
| `MatBadgeModule` / `[matBadge]` | Custom Badge component | Notification count |
| `MatTooltipModule` / `[matTooltip]` | `@radix-ui/react-tooltip` | Sidebar collapsed tooltips |
| `MatProgressSpinnerModule` | Custom spinner (already inline) | Loading states |
| `MatDividerModule` | `<hr>` or CSS border | Menu dividers |
| `MatStepperModule` | Custom stepper | Not used (custom stepper in loan-app) |

## State Management Summary

```
Angular                          React
─────────────────────────────    ─────────────────────────────
AuthService                      AuthContext + useAuth hook
  ├ currentUserSubject             ├ user (useState)
  ├ isAuthenticatedSubject         ├ isAuthenticated (useState)
  ├ login() → Observable           ├ login() → Promise
  └ logout()                       └ logout()

LoanService                      TanStack Query hooks
  ├ getLoans() → Observable        ├ useLoans() → useQuery
  ├ getLoanById() → Observable     ├ useLoan(id) → useQuery
  ├ getDashboardStats() → Obs.    ├ useDashboardStats() → useQuery
  ├ submitApplication() → Obs.    ├ useSubmitApplication() → useMutation
  └ calculateLoan() → value        └ calculateLoan() → pure function

NotificationService              Zustand store
  ├ notifications$ (BehaviorSubj)  ├ notifications (state)
  ├ unreadCount (getter)           ├ unreadCount (derived)
  ├ markAsRead(id)                 ├ markAsRead(id)
  ├ markAllAsRead()                ├ markAllAsRead()
  └ addNotification()              └ addNotification()

Component class properties       useState hooks
  ├ isLoading = true               ├ const [isLoading, setIsLoading]
  ├ searchQuery = ''               ├ const [searchQuery, setSearchQuery]
  ├ selectedLoan = null            ├ const [selectedLoan, setSelectedLoan]
  └ sidebarCollapsed = false       └ const [sidebarCollapsed, setSidebarCollapsed]
```
