# Convert Project Plan

## Current Status
- Status: active
- Snapshot date: April 4, 2026
- Current code-derived scope: `132` converters, `28` categories, `163` routes
- Route breakdown: `3` static routes (`/`, `/categories`, `/privacy`), `28` category routes, `132` converter routes
- Product stance: browser-only, static-first, no live external-data converters in the current app

## Stack
- React 18 + Vite
- React Router v6
- CSS custom properties for design tokens
- Vitest + Testing Library
- Playwright for browser flows
- PWA via `vite-plugin-pwa`
- Static hosting target: Cloudflare Pages

## Source Of Truth
- Converter catalog: [`src/data/converterRegistry.js`](/Users/pruthvikauticwar/Vibe_Code/Convert/src/data/converterRegistry.js)
- Category and route definitions: [`src/data/converterRoutes.js`](/Users/pruthvikauticwar/Vibe_Code/Convert/src/data/converterRoutes.js), [`src/data/categoryGroups.js`](/Users/pruthvikauticwar/Vibe_Code/Convert/src/data/categoryGroups.js)
- Conversion logic: [`src/lib/converterHandlers.js`](/Users/pruthvikauticwar/Vibe_Code/Convert/src/lib/converterHandlers.js), [`src/utils/conversions.js`](/Users/pruthvikauticwar/Vibe_Code/Convert/src/utils/conversions.js)
- Generated output: [`public/sitemap.xml`](/Users/pruthvikauticwar/Vibe_Code/Convert/public/sitemap.xml)

## What The App Already Does Well
- Uses a registry-driven architecture instead of hardcoded page-by-page logic
- Keeps search, routing, metadata, and converter pages aligned through shared data
- Supports search-first browsing from the homepage
- Covers both general-purpose converters and technical/developer tools
- Ships as a static PWA with offline support and generated sitemap output
- Has automated tests for registry invariants, shared UI behavior, and core browser flows

## Current Priorities
1. Keep docs and product claims synced with the codebase.
2. Add new converters only when there is clear search demand or user value.
3. Preserve the registry-driven architecture as the app grows.
4. Avoid one-off UI or logic branches that bypass shared patterns.

## How To Decide What To Build Next
- Run the reusable workflow in [`MARKET_RESEARCH.md`](/Users/pruthvikauticwar/Vibe_Code/Convert/MARKET_RESEARCH.md) before adding new categories or large batches of converters.
- Prefer additions that fit existing categories unless research supports a new category.
- Favor tools with repeat intent, clear SEO phrasing, and adjacency to what the app already does well.

## High-Confidence Expansion Areas
- Missing high-intent converters inside existing categories
- Search-driven calculator improvements inside `calculators`, `time`, `digital`, and `programmer`
- Better interlinking, metadata, and landing-page quality for already-shipped categories

## Out Of Scope Unless Deliberately Reintroduced
- Live currency or exchange-rate features
- Server-side dependencies or mandatory backend services
- SEO-only route expansion that adds maintenance burden without product value

## Verification
- Standard pass: `npm run verify`
- Full pass: `npm run verify:full`

## Notes
- Earlier project docs mentioned a currency feature, 29 categories, and 179 routes. Those claims do not match the current codebase and should be treated as historical drift, not current product scope.
