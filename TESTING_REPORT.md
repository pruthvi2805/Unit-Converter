# Convert Testing Report

## Current Snapshot
- Date: April 4, 2026
- Scope under test: `132` converters, `28` categories, `163` routes
- Testing status: current automated suite passes

## Latest Verified Commands
- `npm run build`
- `npm run test:run`
- `npm run test:e2e`
- `npm run verify:full`

## Latest Result
- Build: passed
- Vitest: `6` tests passed across `2` test files
- Playwright: `4` tests passed in Chromium
- Sitemap generation: passed, generating `163` URLs from the current registry

## What Is Covered Today

### Registry And Data Contract
- Site stats stay in sync with the category and converter registry
- Every converter exposes the metadata required by the shared UI
- Every registered converter has a working handler sample
- The current suite explicitly guards against reintroducing `/currency/*` paths

### Shared UI Behavior
- Homepage search can navigate to a converter
- Example chips populate converter inputs and produce a result summary
- Invalid duration input shows explicit validation guidance

### Browser Flows
- Homepage search flow works in a real browser
- Swap behavior works on converter pages
- Invalid input recovery works on a representative calculator flow
- Mobile category browsing still separates categories and converters correctly

## Current Gaps
- Not every converter has its own dedicated numeric regression test
- SEO metadata uniqueness is not currently asserted in automated tests
- There is no automated accessibility audit in the current suite
- There are no explicit performance budgets or Lighthouse checks in CI

## Recommendation
- Use `npm run verify` for most code changes
- Use `npm run verify:full` when changing routing, search, converter page behavior, or shared UI
- Keep this report aligned with the real automated suite instead of manually maintained “exhaustive” claims
