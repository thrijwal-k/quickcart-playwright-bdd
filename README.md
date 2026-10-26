# QuickCart: Playwright + BDD test automation framework

UI and API test automation for **QuickCart**, a small ReactJS shop with a REST API, built to show how I design a
maintainable automation framework: **Playwright (TypeScript)**, **Cucumber-style BDD** with Gherkin feature files
(via [playwright-bdd](https://github.com/vitalets/playwright-bdd)), the **Page Object Model**, API tests, and CI
pipelines for **Jenkins** and **GitHub Actions**.

| | |
|---|---|
| UI scenarios (Gherkin, Chromium) | 21 across 4 features: sign-in, products, cart, checkout |
| API tests | 15: contract, status codes, validation rules, totals |
| Smoke pack (`@smoke`) | 5 critical journeys |
| Stability | 108 / 108 passed over 3 repeated runs, no retries |

## What is tested

- **Sign-in:** happy path, wrong password, unknown user, locked account, empty fields (Scenario Outline), sign-out.
- **Products:** listing, case-insensitive search (Scenario Outline), no-results message, sold-out items blocked,
  cart badge updates.
- **Cart:** line items and subtotal, quantity changes, removing lines, empty cart.
- **Checkout (end to end):** sign in → add products → cart → checkout → order confirmation and total; field
  validation for name, email and UK postcode (Scenario Outline).
- **API:** response contract for every product, search, 404s, login 401/403, order creation and read-back,
  total calculation, and seven order-validation rules returning 422.

## Framework design

```
app/                    ReactJS shop (Vite) - the application under test
server/api.mjs          REST API (no dependencies) used by the app and the API tests
tests/
  features/*.feature    Gherkin scenarios (Given / When / Then), tagged @smoke @regression @e2e
  steps/shop.steps.ts   Step definitions - thin, readable, no selectors
  pages/*.ts            Page Objects - all locators and page actions live here
  fixtures.ts           Injects Page Objects into steps as Playwright fixtures
  api/*.spec.ts         API tests with Playwright's request context
playwright.config.ts    Projects (ui-chromium, api), reporters (list, HTML, JUnit), retries,
                        trace / screenshot / video on failure, starts the app and API automatically
Jenkinsfile             Declarative pipeline in the official Playwright Docker image, JUnit + HTML artefacts
.github/workflows/      Same pipeline on GitHub Actions
```

Design choices:

- **Stable locators:** `data-testid` and accessible roles only, no CSS chains or XPath.
- **Steps stay business-readable:** step definitions call Page Object methods, so a UI change is fixed in one place.
- **Data-driven:** Scenario Outlines and parameterised API tests cover the negative cases without duplicated code.
- **Fast feedback:** `@smoke` runs the 5 critical journeys; `npm test` runs everything in parallel.
- **Debuggable failures:** trace on retry, screenshot and video on failure, JUnit XML for CI dashboards.

## Run it

```bash
npm ci
npx playwright install chromium
npm test             # all API + UI tests (starts the app and API for you)
npm run test:smoke   # @smoke journeys only
npm run test:api     # API tests only
npm run report       # open the HTML report
```

In Jenkins, create a Pipeline job pointing at this repository; the `Jenkinsfile` runs in
`mcr.microsoft.com/playwright:v1.56.1-noble` and offers a `SUITE` parameter (all, smoke, api).

## Use of AI

I used AI assistants (Claude, GitHub Copilot) to speed up scaffolding and draft step definitions, then reviewed,
ran and corrected the output myself. For example, the first run failed four scenarios because regex step parameters
arrive as numbers, not strings; I traced it from the Playwright error and fixed the step.
