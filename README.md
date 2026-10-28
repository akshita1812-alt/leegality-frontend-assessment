# Catalogly — Leegality Frontend Engineer Assessment

A responsive, Amazon-inspired product listing and detail experience built with React, React Router, and the [DummyJSON Products API](https://dummyjson.com/docs/products).

## Features
- Product listing with image, title, price, rating, and discount badge.
- Category filter populated dynamically from `/products/categories`.
- Combined category + minimum/maximum price + multi-select brand filtering.
- Brand options derived from the products fetched for the current category.
- 12 products per page with previous/next pagination; page resets after filter changes.
- Product detail pages at `/product/:id` with image gallery, description, brand, category, price, and rating.
- Selected filters persist across detail navigation and browser back/forward using URL search parameters.
- Skeleton loading states, empty results, error handling, and retry actions.
- Mobile-responsive layout and accessible input labels.

## Tech stack
- React 19 (functional components and hooks)
- React Router 7
- Vite 6
- Plain CSS
- Lucide icons

## Local setup

**Prerequisites:** Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local address shown by Vite (typically http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## APIs

| Endpoint | Purpose |
| --- | --- |
| `GET /products?limit=0` | Load complete catalog |
| `GET /products/categories` | Populate category options |
| `GET /products/category/{slug}?limit=0` | Load selected category |
| `GET /products/{id}` | Load detail page |

## Assumptions
1. Product prices are displayed in USD, matching DummyJSON's numeric price examples.
2. Categories are single-select; brand filtering is multi-select.
3. Selecting a new category clears previously chosen brands, because brands are derived from the selected category's dataset. Price filters remain in place.
4. Product records lacking a `brand` do not appear in the brand checklist but remain visible when no brand filter is selected.
5. An empty minimum or maximum price means no bound. Both bounds are inclusive.
6. Read-only catalog: no checkout, authentication, or cart is required.

## Architecture & decisions

```text
src/
├── components/
│   ├── Filters.jsx        # Reusable filter controls
│   └── ProductCard.jsx    # Reusable product card
├── lib/
│   └── api.js             # Centralized API client and error handling
├── pages/
│   ├── ListingPage.jsx    # Fetching, filtering, pagination
│   └── DetailPage.jsx     # Item details and image gallery
├── main.jsx               # Routing and global layout
└── styles.css             # Responsive styling
```

**Client-side filtering and pagination:** DummyJSON supports `limit=0`, which fetches the complete collection. This is necessary to correctly combine price and brand filters across *all* products; server pagination followed by client filtering would hide valid products on other pages. For larger datasets, server-side filtering would be preferable.

**URL as source of truth for filters:** The listing stores category, min/max price, brand selections, and page in query parameters. Detail links preserve the full query string, and the detail page's Back link restores it. This also supports refresh and shareable filtered views.

**Async safety:** `AbortController` cancels obsolete requests during category changes, navigation, and unmounting; API errors provide retry UI.

**Derived state:** `useMemo` derives available brands and filtered products; filtered results are not duplicated in state.

## Potential improvements
- Add Vitest + React Testing Library tests for filter combinations, pagination resets, and navigation preservation.
- Add Playwright end-to-end tests and CI checks.
- Introduce caching with TanStack Query and skeleton-image fallbacks.
- Add sorting, search, ratings filters, and richer product metadata.
- Migrate to server-driven search/filtering if the product dataset grows substantially.
- Add image optimization, analytics, and accessibility audits.

## Deployment

**Vercel:** Import the GitHub repository, select Vite, use `npm run build`, and publish the `dist` directory. Vercel supports SPA fallback configuration through `vercel.json` included here.


## Submission

- **GitHub repository:** https://github.com/akshita1812-alt/leegality-frontend-assessment.
- **Live demo:** https://leegality-frontend-assessment-src.vercel.app/.

Assessment project built using public mock product data provided by DummyJSON.
