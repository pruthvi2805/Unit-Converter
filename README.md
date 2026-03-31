# Convert

Convert is a privacy-first converter app built with React and Vite. It covers everyday units, developer tools, calculators, and scientific workflows in a single browser-only experience.

Current scope:
- 28 categories
- 132 converter tools
- no live external-data converters
- search-first homepage and standardized converter pages

## Highlights

- Canonical registry-driven routing and metadata in `src/data/converterRegistry.js`
- Shared handler layer for every tool in `src/lib/converterHandlers.js`
- Search-first homepage and reusable combobox search
- Explicit validation states, example chips, and result summaries across converter pages
- Registry-wide automated coverage plus Playwright end-to-end tests

## Development

```bash
git clone https://github.com/pruthvi2805/Unit-Converter.git
cd Unit-Converter
npm install
npm run dev
```

## Commands

```bash
npm run dev
npm run build
npm run test:run
npm run test:e2e
```

## Project Structure

```text
src/
  components/   shared UI
  data/         canonical converter registry + category group data
  lib/          converter handler contract
  pages/        routed screens
  utils/        conversion math and parser utilities
tests/          Vitest + Testing Library coverage
e2e/            Playwright browser flows
scripts/        sitemap generation
```

## Quality Notes

- All converters are expected to have registry metadata, input examples, aliases, and a mapped handler.
- `npm run build` regenerates `public/sitemap.xml` from the registry data instead of parsing source text.
- `npm run test:run` verifies the registry contract and key UI behavior.
- `npm run test:e2e` covers the homepage search, converter interactions, invalid-input recovery, and mobile browse flow.

## Deployment

The app is designed for static hosting and currently targets Cloudflare Pages.
