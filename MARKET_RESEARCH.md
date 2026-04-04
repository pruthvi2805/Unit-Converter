# Converter Market Research Workflow

Use this before adding a new converter, calculator, or category. The goal is to avoid building low-value tools just to increase the count.

## Paste-Ready Prompt

```text
You are helping prioritize the next converters for Convert, a static React + Vite converter app with 132 converters across 28 categories.

Your job is not to brainstorm randomly. Your job is to recommend the next highest-value converters to build based on likely search demand, user usefulness, and fit with the existing product.

Current product constraints:
- Browser-only, static-first app
- No live external-data converters
- Prefer additions that fit existing categories before creating new ones
- Avoid niche tools that add maintenance without clear demand

Please do the following:
1. Inspect the current category coverage in the repo docs and identify the product's strongest existing clusters.
2. Research likely high-intent converter and calculator queries that are still missing.
3. Group opportunities into:
   - existing-category additions
   - new-category candidates
   - improvements to already-shipped tools
4. For each opportunity, estimate:
   - user intent strength
   - SEO/search phrasing clarity
   - implementation complexity
   - maintenance burden
   - whether it requires live external data
5. Recommend the top 10 opportunities, then narrow to the top 3 that should actually be built next.
6. Explain why each top 3 choice beats the alternatives.
7. Flag anything that looks high-volume but is a bad fit for this product.

Output format:
- Product read
- Opportunity list
- Top 10 ranked table
- Top 3 recommendation
- Bad-fit ideas to avoid
- Suggested slugs/routes for the top 3
```

## What A Good Recommendation Looks Like
- It prefers specific, high-intent tools over vague category sprawl
- It respects the app's static-first constraints
- It calls out when a tempting idea really wants live data or a backend
- It gives route/slug suggestions that fit the current registry-driven structure

## Quick Scoring Rubric
- Search demand: `high`, `medium`, `low`
- Product fit: `strong`, `okay`, `weak`
- Build effort: `small`, `medium`, `large`
- Maintenance risk: `low`, `medium`, `high`

## Default Tiebreakers
If two ideas seem similar, prefer the one that:
1. Fits an existing category
2. Has clearer search phrasing
3. Reuses existing handler or UI patterns
4. Does not need live external data
