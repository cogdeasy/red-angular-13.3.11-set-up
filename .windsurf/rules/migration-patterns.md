---
trigger: always_on
description: Concrete Angular 13 to React 18 translation patterns with HSBC Loans Portal code examples. Covers components, services/hooks, data fetching, forms, directives/JSX, pipes, route guards, state management, and Material UI replacements.
---

# Migration Patterns — Angular 13 to React 18

## HSBC Loans Portal Specific Mappings

This document provides concrete code examples from the actual HSBC Loans codebase,
showing how each Angular pattern translates to React.

---

## 1. Component Architecture

### Angular (app.component.ts)
```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HSBC Loans Portal';
  isAuthenticated = false;
  isLoginPage = false;
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isLoginPage = event.urlAfterRedirects === '/login';
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
```

### React (AppShell.tsx)
```tsx
export function AppShell() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Header onToggleSidebar={() => setSidebarCollapsed(prev => !prev)} />
      <Sidebar isCollapsed={sidebarCollapsed} />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="page-wrapper">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
```

**Key changes:**
- `constructor(private service)` → `useAuth()` hook
- `ngOnInit` + `subscribe` → `useLocation()` (no subscription needed)
- `router.events.pipe(filter(...))` → `location.pathname` (React Router is synchronous)
- Class properties → `useState` hooks
- `*ngIf` conditions → conditional JSX returns

---

## 2. Services → Custom Hooks

### Angular AuthService (BehaviorSubject pattern)
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(email: string, password: string): Observable<User> {
    return of(this.mockUser).pipe(
      delay(1200),
      tap(user => {
        localStorage.setItem('hsbc_auth', 'true');
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }
}
```

### React AuthProvider + useAuth (Context pattern)
```tsx
// AuthProvider.tsx
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('hsbc_auth') === 'true'
  );

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    const mockUser = { id: 'USR-001', firstName: 'James', /* ... */ };
    localStorage.setItem('hsbc_auth', 'true');
    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hsbc_auth');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Key changes:**
- `BehaviorSubject` → `useState`
- `asObservable()` → Context value (no subscription needed)
- `subscribe()` at consumer → Direct destructuring from hook
- `providedIn: 'root'` → Provider at app root

---

## 3. Data Fetching (LoanService → TanStack Query)

### Angular (forkJoin pattern in DashboardComponent)
```typescript
ngOnInit(): void {
  this.isLoading = true;
  forkJoin([
    this.loanService.getDashboardStats(),
    this.loanService.getLoans()
  ]).subscribe({
    next: ([stats, loans]) => {
      this.stats = stats;
      this.loans = loans;
      this.recentLoans = loans.slice(0, 4);
      this.isLoading = false;
    },
    error: () => { this.isLoading = false; }
  });
}
```

### React (parallel useQuery hooks)
```tsx
export function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  });
  const { data: loans, isLoading: loansLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: () => api.getLoans(),
  });

  const isLoading = statsLoading || loansLoading;
  const recentLoans = loans?.slice(0, 4) ?? [];

  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard-page fade-in">
      <h1>Welcome back, {user?.firstName}</h1>
      {/* Stats cards, quick actions, loans table */}
    </div>
  );
}
```

**Key changes:**
- `forkJoin([...]).subscribe()` → Multiple `useQuery` hooks (parallel by default)
- Manual `isLoading` flag → TanStack Query provides `isLoading` automatically
- `this.stats = stats` → `data: stats` from query result
- Error handling → TanStack Query `isError` + `error` properties

---

## 4. Reactive Forms → React Hook Form + Zod

### Angular (LoanApplicationComponent — multi-step wizard)
```typescript
personalInfoForm!: FormGroup;

initForms(): void {
  this.personalInfoForm = this.fb.group({
    title: ['', Validators.required],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dateOfBirth: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,15}$/)]],
    // ...
  });
}

getFieldError(form: FormGroup, field: string): string {
  const control = form.get(field);
  if (!control || !control.errors || !control.touched) return '';
  if (control.errors['required']) return 'This field is required';
  if (control.errors['email']) return 'Please enter a valid email';
  // ...
}
```

### React (PersonalInfoStep.tsx — React Hook Form + Zod)
```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const personalInfoSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  firstName: z.string().min(2, 'Minimum 2 characters'),
  lastName: z.string().min(2, 'Minimum 2 characters'),
  dateOfBirth: z.string().min(1, 'This field is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid format'),
  // ...
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;

export function PersonalInfoStep({ onNext }: { onNext: (data: PersonalInfo) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <div className="form-group">
        <label>First Name *</label>
        <input {...register('firstName')} className={errors.firstName ? 'is-invalid' : ''} />
        {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
      </div>
      {/* ... */}
    </form>
  );
}
```

**Key changes:**
- `FormBuilder.group({})` → `useForm({ resolver: zodResolver(schema) })`
- `Validators.required` → `z.string().min(1, 'Required')`
- `Validators.email` → `z.string().email('Invalid email')`
- `Validators.pattern(regex)` → `z.string().regex(regex, 'message')`
- `formControlName="field"` → `{...register('field')}`
- `getFieldError()` helper → `errors.field?.message`
- `form.markAllAsTouched()` → Handled automatically by RHF on submit

---

## 5. Template Directives → JSX

### Angular Template
```html
<div *ngIf="isLoginPage">
  <router-outlet></router-outlet>
</div>
<div *ngIf="!isLoginPage && isAuthenticated" class="app-layout">
  <app-header (toggleSidebar)="toggleSidebar()"></app-header>
  <app-sidebar [isCollapsed]="sidebarCollapsed"></app-sidebar>
</div>
<div *ngFor="let loan of recentLoans">
  <span [ngClass]="getStatusClass(loan.status)">{{ loan.status }}</span>
  <span>{{ formatCurrency(loan.amount) }}</span>
</div>
```

### React JSX
```tsx
{isLoginPage && <Outlet />}
{!isLoginPage && isAuthenticated && (
  <div className="app-layout">
    <Header onToggleSidebar={toggleSidebar} />
    <Sidebar isCollapsed={sidebarCollapsed} />
  </div>
)}
{recentLoans.map(loan => (
  <div key={loan.id}>
    <span className={getStatusClass(loan.status)}>{loan.status}</span>
    <span>{formatCurrency(loan.amount)}</span>
  </div>
))}
```

---

## 6. Pipes → Utility Functions / Hooks

### Angular Pipe
```typescript
@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencySymbol = '$', decimals = 2): string {
    if (value === null || value === undefined) return '-';
    const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${currencySymbol}${formatted}`;
  }
}
// Usage: {{ loan.amount | currencyFormat }}
```

### React Utility Function
```typescript
export function formatCurrency(value: number, currencySymbol = '$', decimals = 2): string {
  if (value === null || value === undefined) return '-';
  const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${currencySymbol}${formatted}`;
}
// Usage: {formatCurrency(loan.amount)}
```

### Angular Date Pipe
```html
{{ notification.timestamp | date:'MMM d, h:mm a' }}
{{ currentUser.lastLogin | date:'medium' }}
```

### React Date Formatting
```tsx
{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(notification.timestamp)}
// Or use a utility function:
{formatDate(notification.timestamp, 'MMM d, h:mm a')}
```

---

## 7. Route Guards → Protected Route Component

### Angular AuthGuard
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isLoggedIn) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
```

### React ProtectedRoute
```tsx
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// In routes.tsx:
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/loan-application" element={<LoanApplicationPage />} />
  {/* ... */}
</Route>
```

---

## 8. Notification Service → Zustand Store

### Angular NotificationService
```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: Notification[] = [...];
  private notificationsSubject = new BehaviorSubject<Notification[]>(this.notifications);
  notifications$ = this.notificationsSubject.asObservable();

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string): void { /* ... */ }
  markAllAsRead(): void { /* ... */ }
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void { /* ... */ }
}
```

### React Zustand Store
```typescript
import { create } from 'zustand';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: initialNotifications,
  get unreadCount() { return get().notifications.filter(n => !n.read).length; },

  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  markAllAsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
  })),

  addNotification: (notification) => set(state => ({
    notifications: [{
      ...notification,
      id: `n${Date.now()}`,
      timestamp: new Date(),
      read: false,
    }, ...state.notifications],
  })),
}));
```

---

## 9. Angular Material → React Alternatives

| Angular Material | React Equivalent | HSBC Loans Usage |
|-----------------|-----------------|-----------------|
| `<mat-icon>` | `@mui/icons-material` or `react-icons/md` | Throughout (dashboard, menu, status icons) |
| `<mat-menu>` | Custom dropdown or `@radix-ui/react-dropdown-menu` | Header user menu |
| `[matBadge]` | Custom badge component | Notification count |
| `[matTooltip]` | `@radix-ui/react-tooltip` or custom | Sidebar collapsed labels |
| `<mat-spinner>` | Custom LoadingSpinner (already inline) | Loading states |
| `<mat-divider>` | `<hr>` or custom divider | User menu |

## 10. Two-Way Binding → Controlled Components

### Angular (Loan Calculator)
```html
<input type="number" [(ngModel)]="amount" (ngModelChange)="calculate()">
<input type="range" [(ngModel)]="amount" (ngModelChange)="calculate()">
```

### React (Loan Calculator)
```tsx
const [amount, setAmount] = useState(50000);

const handleAmountChange = (value: number) => {
  setAmount(value);
  // calculation happens via useMemo or useEffect
};

<input type="number" value={amount} onChange={e => handleAmountChange(Number(e.target.value))} />
<input type="range" value={amount} onChange={e => handleAmountChange(Number(e.target.value))} />
```
