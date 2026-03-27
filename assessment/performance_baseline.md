# Performance Baseline — HSBC Loans Portal

## Angular Build Analysis

### Bundle Configuration (from angular.json)

```json
{
  "budgets": [
    { "type": "initial", "maximumWarning": "2mb", "maximumError": "5mb" },
    { "type": "anyComponentStyle", "maximumWarning": "6kb", "maximumError": "10kb" }
  ]
}
```

### Production Dependencies (bundle contributors)

| Package | Version | Estimated Size (gzipped) |
|---------|---------|------------------------|
| @angular/core | 13.3.11 | ~90KB |
| @angular/common | 13.3.11 | ~30KB |
| @angular/forms | 13.3.11 | ~25KB |
| @angular/router | 13.3.11 | ~25KB |
| @angular/material | 13.3.9 | ~50KB (subset used) |
| @angular/cdk | 13.3.9 | ~20KB |
| @angular/animations | 13.3.11 | ~15KB |
| @angular/platform-browser | 13.3.11 | ~15KB |
| rxjs | 7.5.0 | ~30KB |
| zone.js | 0.11.4 | ~15KB |
| chart.js | 3.7.0 | ~60KB (tree-shakeable) |
| ng2-charts | 3.1.0 | ~5KB |
| tslib | 2.3.0 | ~2KB |
| **Estimated Total** | | **~380KB gzipped** |

### Code Splitting (Lazy Loading)

All 6 page routes are lazy-loaded, producing separate chunks:
- `main.js` — Core Angular + shared module
- `login-module.js` — Login page
- `dashboard-module.js` — Dashboard page
- `loan-application-module.js` — Loan application wizard
- `loan-calculator-module.js` — Loan calculator
- `loan-status-module.js` — Loan status list
- `profile-module.js` — Profile page

### Performance Budgets for React Target

| Metric | Angular Estimate | React Target | React Max Allowed |
|--------|-----------------|-------------|-------------------|
| Initial Bundle (gzipped) | ~180KB | < 120KB | 150KB |
| Total Bundle (gzipped) | ~380KB | < 300KB | 400KB |
| First Contentful Paint | ~2.0s | < 1.5s | 1.8s |
| Largest Contentful Paint | ~2.5s | < 2.0s | 2.5s |
| Cumulative Layout Shift | ~0.05 | < 0.05 | 0.1 |
| Total Blocking Time | ~300ms | < 200ms | 300ms |
| Time to Interactive | ~3.0s | < 2.5s | 3.0s |

### Expected React Bundle Improvements

| Improvement Area | Estimated Savings |
|-----------------|------------------|
| React vs Angular core | -60KB (React ~35KB vs Angular ~90KB) |
| No zone.js | -15KB |
| No Angular compiler runtime | -20KB |
| Vite tree-shaking (better than Webpack) | -10-20KB |
| No Angular Material (custom components) | -50KB |
| react-icons vs Material full package | -30KB |
| **Total estimated savings** | **~150-200KB gzipped** |

### React Dependency Budget

| Package | Estimated Size (gzipped) |
|---------|------------------------|
| react + react-dom | ~40KB |
| react-router-dom | ~12KB |
| @tanstack/react-query | ~12KB |
| zustand | ~1KB |
| react-hook-form | ~9KB |
| zod | ~4KB |
| @hookform/resolvers | ~2KB |
| chart.js (if needed) | ~60KB |
| react-chartjs-2 (if needed) | ~3KB |
| react-icons (subset) | ~5KB |
| **Total** | **~148KB gzipped** |

### Route-Level Performance Targets

| Route | Key Metric | Target |
|-------|-----------|--------|
| `/login` | FCP (form visible) | < 1.0s |
| `/dashboard` | LCP (stats cards loaded) | < 2.0s |
| `/loan-application` | TTI (form interactive) | < 1.5s |
| `/loan-calculator` | TTI (inputs responsive) | < 1.5s |
| `/loan-status` | LCP (loan list rendered) | < 2.0s |
| `/profile` | FCP (profile card visible) | < 1.0s |

### Monitoring & CI Integration

- **Lighthouse CI**: Run on every PR via GitHub Actions
- **Bundle Size Check**: `vite-plugin-visualizer` report on every PR
- **Performance Regression**: Block PR if any metric regresses > 10%
- **Chunk Size Limit**: No single chunk > 250KB gzipped

### Notes

- Angular performance numbers are estimates (no Lighthouse baseline captured yet)
- Actual baselines should be captured by running Lighthouse against the deployed Angular app
- React targets assume Vite production build with proper code splitting
- chart.js may not be needed — HSBC Loans uses custom SVG for the donut chart in the calculator
- If chart.js is removed, total React bundle drops by ~60KB
