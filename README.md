# Palm Outsourcing Assessment

Playwright and TypeScript tests for the public [Practice Software Testing](https://practicesoftwaretesting.com/) toolshop.

## Layout

| Path | What it holds |
| --- | --- |
| `tests/api.spec.ts` | Login, then read products through the API |
| `tests/api-ui.spec.ts` | Create a favorite through the API, then check it in the UI |
| `tests/e2e.spec.ts` | Sign in, add a product, and complete checkout |
| `pages/` | Page objects |
| `utils/api/` | API client |
| `utils/fixtures/` | Fixtures, including the `api` client |
| `data/data.json` | Checkout and registration data |
| `env/.env` | Local URLs and the customer login. This folder is not committed |

## Setup

```bash
npm ci
npx playwright install chromium
```

Create `env/.env`:

```bash
BASE_URL=https://practicesoftwaretesting.com/
API_URL=https://api.practicesoftwaretesting.com
CUSTOMER2_EMAIL=customer2@practicesoftwaretesting.com
CUSTOMER2_PASSWORD=<your customer password>
```

`customer2` is a public demo account from the toolshop docs.

## Run

```bash
npm run test:api
npm run test:api-ui
npm run test:e2e
```

`npm test` runs all three. GitHub Actions uses the same three commands, in that order, in `.github/workflows/tests.yml`. A failed run uploads the Playwright report.

The workflow does not store URLs or the login. Add them on the repository under **Settings → Secrets and variables → Actions**:

| Name | Where | Value |
| --- | --- | --- |
| `BASE_URL` | Variables | `https://practicesoftwaretesting.com/` |
| `API_URL` | Variables | `https://api.practicesoftwaretesting.com` |
| `CUSTOMER2_EMAIL` | Secrets | `customer2@practicesoftwaretesting.com` |
| `CUSTOMER2_PASSWORD` | Secrets | `<your customer password>` |
