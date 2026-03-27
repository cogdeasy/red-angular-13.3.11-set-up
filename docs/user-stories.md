# User Stories — HSBC Loans Portal Migration

## Format
Each story follows: **As a [role], I want [feature], so that [benefit].**
Acceptance criteria are testable assertions for E2E parity testing.

---

## Wave 0 — Foundation

### US-F01: React Project Scaffold
**As a** developer, **I want** a React 18 project scaffolded with Vite and TypeScript strict mode, **so that** I can begin building React components.

**Acceptance Criteria:**
- [ ] `npm run dev` starts dev server on port 5173
- [ ] TypeScript strict mode enabled (no `any` allowed)
- [ ] Path aliases working (`@/components`, `@/hooks`, `@/types`)
- [ ] ESLint + Prettier configured
- [ ] Vitest configured and running

### US-F02: Shared Types Package
**As a** developer, **I want** TypeScript interfaces shared between Angular and React, **so that** both apps use identical type definitions.

**Acceptance Criteria:**
- [ ] All 12 interfaces/enums from Angular models available in shared package
- [ ] Both Angular and React import from the same source
- [ ] No type duplication

### US-F03: Auth Bridge
**As a** user, **I want** my login state preserved when navigating between Angular and React routes, **so that** I don't have to log in again.

**Acceptance Criteria:**
- [ ] Login in Angular → React reads `hsbc_auth` from localStorage
- [ ] Login in React → Angular reads `hsbc_auth` from localStorage
- [ ] Logout in either framework clears state in both
- [ ] No auth flicker during cross-framework navigation

### US-F04: Design Tokens
**As a** designer, **I want** HSBC design tokens available as CSS custom properties, **so that** both Angular and React use identical visual styling.

**Acceptance Criteria:**
- [ ] All 13 color tokens available as `--hsbc-*` variables
- [ ] All spacing tokens available
- [ ] React components render with HSBC brand colors
- [ ] No visual difference between Angular and React styling

---

## Wave 1 — Leaf Pages

### US-101: Login Page Display
**As a** user, **I want** to see a login form with email and password fields, **so that** I can sign into the portal.

**Acceptance Criteria:**
- [ ] Page displays "Sign in to your account" heading
- [ ] Email input with label "Email address"
- [ ] Password input with label "Password" and show/hide toggle
- [ ] "Sign in" button
- [ ] "Forgot Password?" link
- [ ] HSBC branding (red accent, logo area)

### US-102: Login Authentication
**As a** user, **I want** to log in with valid credentials, **so that** I can access the portal.

**Acceptance Criteria:**
- [ ] Entering email and password and clicking "Sign in" triggers loading state
- [ ] Loading spinner appears during authentication (1.2s mock delay)
- [ ] On success, redirect to `/dashboard`
- [ ] Auth state persisted in localStorage (`hsbc_auth`)
- [ ] Error state shown for invalid credentials

### US-103: Login Validation
**As a** user, **I want** validation feedback on the login form, **so that** I know what I need to fix.

**Acceptance Criteria:**
- [ ] Empty email shows "Please enter your email and password"
- [ ] Invalid email format shows validation error
- [ ] Empty password shows validation error
- [ ] Submit button disabled during loading

### US-104: Profile View
**As a** user, **I want** to view my profile information, **so that** I can verify my details.

**Acceptance Criteria:**
- [ ] Page displays "My Profile" heading
- [ ] User avatar with initials (JC)
- [ ] Full name: "James Chen"
- [ ] Role badge: "Premier Customer"
- [ ] Customer since date
- [ ] Customer ID, preferred branch, last login
- [ ] Personal info: first name, last name, email, phone
- [ ] Security section: password, 2FA, biometric
- [ ] Communication preferences: email notifications, SMS alerts, marketing

### US-105: Profile Edit
**As a** user, **I want** to edit my profile information, **so that** I can keep my details up to date.

**Acceptance Criteria:**
- [ ] "Edit" button toggles to edit mode
- [ ] Edit mode shows input fields for first name, last name, email, phone
- [ ] "Save Changes" button saves and exits edit mode
- [ ] "Cancel" button discards changes and exits edit mode

---

## Wave 2 — Read-Only Pages

### US-201: Dashboard Overview
**As a** user, **I want** to see a dashboard with my loan summary, **so that** I can quickly understand my financial position.

**Acceptance Criteria:**
- [ ] Welcome message: "Welcome back, James"
- [ ] Stats cards: Total Borrowed, Active Loans, Monthly Payments, Next Payment
- [ ] Quick actions: Apply for a Loan, Loan Calculator, View My Loans
- [ ] Recent loans table (up to 4 loans)
- [ ] Loading spinner during data fetch

### US-202: Dashboard Stats Accuracy
**As a** user, **I want** accurate dashboard statistics, **so that** I can trust the numbers.

**Acceptance Criteria:**
- [ ] Total Borrowed amount matches sum of loan amounts
- [ ] Active Loans count matches number of active/approved/disbursed loans
- [ ] Monthly Payments total matches sum of monthly payments for active loans
- [ ] Next Payment date shows the soonest upcoming payment

### US-203: Loan Status List
**As a** user, **I want** to see all my loans in a filterable list, **so that** I can find and track specific loans.

**Acceptance Criteria:**
- [ ] Page displays "My Loans" heading with "New Application" button
- [ ] Search input with placeholder "Search by ID, type, or purpose..."
- [ ] Filter tabs: All Loans, Active, Approved, Under Review, Submitted, Closed
- [ ] Loan cards show: type, status badge, ID, purpose, amount, monthly payment, rate
- [ ] Filtering by status works correctly
- [ ] Search by ID, type, or purpose works correctly

### US-204: Loan Status Detail
**As a** user, **I want** to expand a loan card to see detailed information, **so that** I can track the loan's progress.

**Acceptance Criteria:**
- [ ] Clicking a loan card expands it to show details
- [ ] Details show: application date, approval date, term, interest rate
- [ ] Payment summary: remaining balance, total paid, next payment date
- [ ] Repayment progress bar (percentage)
- [ ] Application timeline with steps (Submitted, Under Review, Decision, Funds Disbursed)
- [ ] Timeline steps show correct completed/active state based on loan status

---

## Wave 3 — Interactive Pages

### US-301: Loan Calculator Input
**As a** user, **I want** to enter loan parameters, **so that** I can estimate monthly payments.

**Acceptance Criteria:**
- [ ] Loan type dropdown with 6 types (Personal, Mortgage, Auto, Business, Education, Home Equity)
- [ ] Loan amount input with range slider ($1,000 - $5,000,000)
- [ ] Loan term input with range slider (6 - 360 months)
- [ ] Interest rate input (auto-filled based on loan type, editable)
- [ ] "Apply for This Loan" button linking to /loan-application

### US-302: Loan Calculator Results
**As a** user, **I want** to see calculated loan results, **so that** I can make informed borrowing decisions.

**Acceptance Criteria:**
- [ ] Monthly payment amount displayed prominently
- [ ] Total repayment amount
- [ ] Total interest amount (in red)
- [ ] Principal amount
- [ ] Payment breakdown donut chart (principal vs interest percentages)
- [ ] Results update in real-time as inputs change

### US-303: Amortization Schedule
**As a** user, **I want** to see a detailed amortization schedule, **so that** I can understand my payment breakdown over time.

**Acceptance Criteria:**
- [ ] Expandable "Amortization Schedule" section
- [ ] Table with columns: Month, Payment, Principal, Interest, Balance
- [ ] Pagination (12 rows per page)
- [ ] Previous/Next page navigation
- [ ] Page indicator (e.g., "Page 1 of 5")

---

## Wave 4 — Complex Pages

### US-401: Loan Application - Personal Info (Step 1)
**As a** user, **I want** to enter my personal information, **so that** I can begin a loan application.

**Acceptance Criteria:**
- [ ] Step indicator shows step 1 of 4 active
- [ ] Fields: title, first name, last name, date of birth, email, phone, address fields
- [ ] All fields validate on blur and submit
- [ ] "Next" button enabled only when step is valid
- [ ] Field errors shown with descriptive messages

### US-402: Loan Application - Employment (Step 2)
**As a** user, **I want** to enter my employment details, **so that** HSBC can assess my income.

**Acceptance Criteria:**
- [ ] Step indicator shows step 2 of 4 active
- [ ] Fields: employment status, employer, job title, annual income, years employed
- [ ] "Previous" button returns to step 1 with data preserved
- [ ] "Next" button advances to step 3

### US-403: Loan Application - Loan Details (Step 3)
**As a** user, **I want** to specify loan details, **so that** I can request the right amount.

**Acceptance Criteria:**
- [ ] Step indicator shows step 3 of 4 active
- [ ] Fields: loan type, loan amount, loan term, purpose
- [ ] Estimated monthly payment shown (calculated from amount/term/rate)
- [ ] "Previous" button returns to step 2 with data preserved
- [ ] "Next" button advances to step 4 (review)

### US-404: Loan Application - Review & Submit (Step 4)
**As a** user, **I want** to review and submit my application, **so that** I can confirm everything is correct.

**Acceptance Criteria:**
- [ ] Step indicator shows step 4 of 4 active
- [ ] Summary of all entered data (personal, employment, loan details)
- [ ] "Edit" links to go back to specific steps
- [ ] Terms and conditions checkbox
- [ ] "Submit Application" button
- [ ] Success confirmation after submission

---

## Wave 5 — Shell & Cleanup

### US-501: Application Shell
**As a** user, **I want** a consistent layout with header, sidebar, and footer, **so that** I can navigate the portal easily.

**Acceptance Criteria:**
- [ ] Header visible on all authenticated pages (not login)
- [ ] Sidebar visible on all authenticated pages (not login)
- [ ] Footer visible on all authenticated pages
- [ ] Login page shows only the login form (no header/sidebar/footer)

### US-502: Header Functionality
**As a** user, **I want** a header with notifications and user menu, **so that** I can manage my account.

**Acceptance Criteria:**
- [ ] HSBC Loans Portal title
- [ ] Notification bell with unread count badge
- [ ] Clicking bell opens notification panel
- [ ] Notifications list with read/unread status
- [ ] "Mark all as read" button
- [ ] User avatar and name
- [ ] User dropdown menu with Profile and Logout options

### US-503: Sidebar Navigation
**As a** user, **I want** a sidebar with navigation links, **so that** I can access all sections of the portal.

**Acceptance Criteria:**
- [ ] 5 nav items: Dashboard, My Loans, Apply for Loan, Loan Calculator, My Profile
- [ ] Active route highlighted
- [ ] Sidebar collapsible via toggle
- [ ] Collapsed sidebar shows only icons
- [ ] Material icons for each nav item

### US-504: Angular Removal Complete
**As a** developer, **I want** all Angular code removed, **so that** the application is a clean React project.

**Acceptance Criteria:**
- [ ] Zero Angular dependencies in package.json
- [ ] Zero Angular source files in src/
- [ ] All routes served by React
- [ ] E2E test suite passes on React-only build
- [ ] Lighthouse scores meet or exceed baseline
- [ ] Bundle size <= Angular baseline
