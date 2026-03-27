---
trigger: always_on
description: Architecture rules for Angular/React coexistence via single-spa during the HSBC Loans Portal migration. Covers route ownership, shared auth contract, CSS variables, and framework isolation.
---

# Coexistence Rules — HSBC Loans Portal

## Architecture Overview

During migration, Angular and React coexist via single-spa:

```
┌─────────────────────────────────────────────────────┐
│                   Browser                            │
│  ┌───────────────────────────────────────────────┐  │
│  │           single-spa Root Config               │  │
│  │  ┌──────────────┐    ┌───────────────────┐    │  │
│  │  │  Angular App  │    │    React App       │    │  │
│  │  │  (legacy)     │    │    (new)           │    │  │
│  │  │              │    │                   │    │  │
│  │  │  /dashboard* │◄──►│  /dashboard*      │    │  │
│  │  │  /login*     │    │  /login*          │    │  │
│  │  │  /loan-*     │    │  /loan-*          │    │  │
│  │  │  /profile*   │    │  /profile*        │    │  │
│  │  └──────┬───────┘    └────────┬──────────┘    │  │
│  │         │                     │               │  │
│  │         └─────────┬───────────┘               │  │
│  │                   │                           │  │
│  │      ┌────────────▼────────────┐              │  │
│  │      │   Shared State Layer     │              │  │
│  │      │  ┌─────────────────┐    │              │  │
│  │      │  │  localStorage    │    │              │  │
│  │      │  │  hsbc_auth key   │    │              │  │
│  │      │  └─────────────────┘    │              │  │
│  │      │  ┌─────────────────┐    │              │  │
│  │      │  │  CSS Variables   │    │              │  │
│  │      │  │  HSBC tokens     │    │              │  │
│  │      │  └─────────────────┘    │              │  │
│  │      │  ┌─────────────────┐    │              │  │
│  │      │  │  Custom Events   │    │              │  │
│  │      │  │  cross-framework │    │              │  │
│  │      │  └─────────────────┘    │              │  │
│  │      └─────────────────────────┘              │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Route Ownership Rules

Feature flags control which framework serves each route:

| Route | Feature Flag | Default Owner | Wave |
|-------|-------------|---------------|------|
| `/login` | `ff_react_login` | Angular | 1 |
| `/profile` | `ff_react_profile` | Angular | 1 |
| `/dashboard` | `ff_react_dashboard` | Angular | 2 |
| `/loan-status` | `ff_react_loan_status` | Angular | 2 |
| `/loan-calculator` | `ff_react_loan_calculator` | Angular | 3 |
| `/loan-application` | `ff_react_loan_application` | Angular | 4 |

### Feature Flag Schema

```typescript
interface FeatureFlags {
  ff_react_login: boolean;
  ff_react_profile: boolean;
  ff_react_dashboard: boolean;
  ff_react_loan_status: boolean;
  ff_react_loan_calculator: boolean;
  ff_react_loan_application: boolean;
}

// Default: all false (Angular serves everything)
const DEFAULT_FLAGS: FeatureFlags = {
  ff_react_login: false,
  ff_react_profile: false,
  ff_react_dashboard: false,
  ff_react_loan_status: false,
  ff_react_loan_calculator: false,
  ff_react_loan_application: false,
};
```

## Shared Auth Contract

Both Angular and React MUST use the same auth mechanism:

```typescript
// Auth Contract — shared between Angular AuthService and React useAuth
const AUTH_CONTRACT = {
  storageKey: 'hsbc_auth',
  
  // Check if authenticated
  isAuthenticated: () => localStorage.getItem('hsbc_auth') === 'true',
  
  // Set authenticated (on login)
  setAuthenticated: () => localStorage.setItem('hsbc_auth', 'true'),
  
  // Clear authenticated (on logout)
  clearAuthenticated: () => localStorage.removeItem('hsbc_auth'),
  
  // Mock user data (shared)
  mockUser: {
    id: 'USR-001',
    firstName: 'James',
    lastName: 'Chen',
    email: 'james.chen@email.com',
    phone: '+44 7700 900123',
    role: 'Premier Customer',
    lastLogin: '2026-03-26T14:30:00Z',
    customerSince: '2018-05-15',
    preferredBranch: 'London Canary Wharf'
  }
};
```

### Cross-Framework Auth Events

```typescript
// When Angular logs in/out, notify React:
window.dispatchEvent(new CustomEvent('hsbc:auth:change', { 
  detail: { isAuthenticated: true, source: 'angular' } 
}));

// When React logs in/out, notify Angular:
window.dispatchEvent(new CustomEvent('hsbc:auth:change', { 
  detail: { isAuthenticated: false, source: 'react' } 
}));
```

## Shared CSS Variables

Both frameworks consume the same CSS custom properties:

```css
:root {
  /* HSBC Colors */
  --hsbc-red: #DB0011;
  --hsbc-red-dark: #AF000D;
  --hsbc-red-light: #FF1A2C;
  --hsbc-black: #333333;
  --hsbc-dark-gray: #575757;
  --hsbc-medium-gray: #767676;
  --hsbc-light-gray: #D7D8D6;
  --hsbc-pale-gray: #F3F3F3;
  --hsbc-white: #FFFFFF;
  --hsbc-success: #00847F;
  --hsbc-warning: #F2A900;
  --hsbc-error: #DB0011;
  --hsbc-info: #0073CF;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  /* Typography */
  --font-primary: 'Univers', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
```

## Rules for Coexistence

1. **Never import Angular code from React or vice versa** — use shared types package
2. **Never modify Angular source** — Angular code is READ-ONLY during migration
3. **All shared state goes through localStorage or CSS variables** — no direct references
4. **Feature flags are the ONLY route-switching mechanism** — no URL hacks
5. **Both apps must handle auth state changes from the other** — listen for custom events
6. **Zone.js awareness** — React components must not interfere with Angular's zone.js
7. **No shared npm dependencies at different versions** — use single version resolution
8. **CSS scoping** — Use CSS Modules or BEM in React to avoid class name collisions with Angular Material
