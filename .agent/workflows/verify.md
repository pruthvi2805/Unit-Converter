# Verify Changes

Use this workflow after implementing a change in the Convert repo.

## Default
1. Run `npm run verify`.
2. Review any failures before making more edits.

## Full Pass
Use the full pass when routing, search, shared converter behavior, or major UI flows changed.

1. Run `npm run verify:full`.
2. Confirm the app still builds, the registry tests pass, and Playwright covers the changed behavior.
