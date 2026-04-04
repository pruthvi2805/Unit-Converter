# Convert Repository Guidelines

- Follow the root `AGENTS.md` as the primary project guide.
- Treat `src/data/converterRegistry.js` as the converter source of truth.
- Prefer data-driven edits over one-off page hacks.
- Regenerate `public/sitemap.xml` through the build instead of editing it manually.
- Before finishing a task, run `npm run verify` for most changes and `npm run verify:full` for user-flow or routing changes.
- If counts or supported capabilities change, sync `README.md`, `PROJECT_PLAN.md`, and `TESTING_REPORT.md` with the code.
