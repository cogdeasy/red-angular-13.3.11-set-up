---
trigger: always_on
description: Testing pyramid, patterns, performance budgets, and CI integration rules for the HSBC Loans Portal Angular-to-React migration. Covers unit tests (Vitest), integration tests (RTL), E2E parity tests (Playwright), visual regression, and accessibility.
---

# Testing Rules — HSBC Loans Portal Migration

## Testing Pyramid

```
                    ┌───────┐
                    │  E2E  │  Playwright (6 routes)
                    │ Tests │  Both Angular & React
                   ┌┴───────┴┐
                   │ Visual   │  Chromatic/Percy
                   │Regression│  3 viewports per route
                  ┌┴──────────┴┐
                  │ Integration │  React Testing Library
                  │   Tests     │  Component + hook combos
                 ┌┴─────────────┴┐
                 │   Unit Tests   │  Vitest
                 │ Hooks, utils,  │  Fast, isolated
                 │ pure functions │
                ┌┴────────────────┴┐
                │  Static Analysis  │  TypeScript strict, ESLint
                │                   │  axe-core accessibility
                └───────────────────┘
```

## Test Categories

### 1. Unit Tests (Vitest)

**What to test:**
- Custom hooks (useAuth, useLoans, useNotifications, useCurrencyFormat)
- Pure functions (formatCurrency, getStatusClass, calculateLoan, getProgressPercent)
- Zustand stores (notification store)
- Zod validation schemas

**Patterns:**

```typescript
// Hook test pattern
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => {
  it('should return isAuthenticated false initially', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set isAuthenticated true after login', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('test@email.com', 'password');
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

```typescript
// Pure function test pattern
import { formatCurrency } from '@/utils/format';

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    expect(formatCurrency(2015.44)).toBe('$2,015.44');
  });
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  it('formats large numbers', () => {
    expect(formatCurrency(450000)).toBe('$450,000.00');
  });
});
```

### 2. Integration Tests (React Testing Library)

**What to test:**
- Component rendering with mock data
- User interactions (click, type, submit)
- Navigation behavior
- Form validation feedback
- Loading and error states

**Patterns:**

```typescript
// Component test pattern
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from '@/pages/Dashboard';
import { TestProviders } from '@/test/providers';

describe('DashboardPage', () => {
  it('renders stats cards after loading', async () => {
    render(<DashboardPage />, { wrapper: TestProviders });
    
    // Loading state
    expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
    
    // Loaded state
    await waitFor(() => {
      expect(screen.getByText('Total Borrowed')).toBeInTheDocument();
      expect(screen.getByText('$660,000.00')).toBeInTheDocument();
    });
  });

  it('navigates to loan application', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />, { wrapper: TestProviders });
    
    await waitFor(() => {
      expect(screen.getByText('Apply for a Loan')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Apply for a Loan'));
    // Assert navigation occurred
  });
});
```

### 3. E2E Parity Tests (Playwright)

**Critical rule:** The SAME test file must pass against both Angular and React.

```typescript
// e2e/login.spec.ts — runs against both frameworks
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4200'; // or :5173 for React

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByText('Sign in')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should show error for empty submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Please enter your email and password')).toBeVisible();
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel('Email address').fill('james.chen@email.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});
```

### 4. Visual Regression

**Viewports:**
| Name | Width | Height |
|------|-------|--------|
| Desktop | 1920 | 1080 |
| Tablet | 768 | 1024 |
| Mobile | 375 | 812 |

**Routes to snapshot:**
- `/login` — Login page
- `/dashboard` — Dashboard with stats (after data loads)
- `/loan-application` — Step 1 of wizard
- `/loan-calculator` — Calculator with results
- `/loan-status` — Loan list with filters
- `/profile` — Profile view mode

### 5. Accessibility Tests

```typescript
// Accessibility test pattern using axe-core
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LoginPage } from '@/pages/Login';

expect.extend(toHaveNoViolations);

describe('LoginPage accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<LoginPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Performance Budgets

| Metric | Angular Baseline | React Target | Max Allowed |
|--------|-----------------|--------------|-------------|
| FCP | TBD | < 1.5s | 1.8s |
| LCP | TBD | < 2.0s | 2.5s |
| CLS | TBD | < 0.05 | 0.1 |
| TBT | TBD | < 200ms | 300ms |
| Bundle (initial) | TBD | < 150KB gz | 200KB gz |
| Bundle (total) | TBD | < 400KB gz | 500KB gz |

## CI Integration

Every PR must pass:
- [ ] TypeScript compilation (`tsc --noEmit`)
- [ ] ESLint (`eslint --max-warnings 0`)
- [ ] Unit tests (`vitest run --coverage`)
- [ ] Coverage threshold (statements >= 80%, branches >= 75%)
- [ ] Build succeeds (`vite build`)
- [ ] Bundle size within budget
- [ ] E2E tests pass (Playwright, run against React dev server)
- [ ] Accessibility audit (axe-core, zero critical/serious)

## Test Data

Mock data for tests matches the Angular app's in-memory data:

- **User**: James Chen (USR-001), Premier Customer
- **Loans**: 5 loans (Mortgage LN-2024-001, Personal LN-2024-002, Auto LN-2025-003, Business LN-2026-004, Education LN-2026-005)
- **Statuses**: Active (3), Under Review (1), Approved (1)
- **Notifications**: 4 mock notifications (payment reminder, approval, document required, rate change)
