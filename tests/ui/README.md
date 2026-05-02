# Mistral AI — UI Test Automation

Automated end-to-end tests for [Le Chat] built with Playwright and TypeScript.

---

## Tech Stack

- [Playwright](https://playwright.dev) — browser automation
- TypeScript — type-safe test code
- Page Object Model — maintainable test architecture
- Session management — automatic login and session reuse

---

## Project Structure

ui/
├── e2e/                    # Test files
│   ├── login.spec.ts       # Login test scenarios
│   └── chat.spec.ts        # Chat completion test scenarios
├── fixtures/
│   └── base.ts             # Shared fixtures — session management
├── pages/                  # Page Object Models
│   ├── LoginPage.ts        # Login page locators and actions
│   └── ChatPage.ts         # Chat page locators and actions
├── reports/                # HTML test reports
│   └── screenshots/        # Failure screenshots
├── .auth/                  # Saved session (gitignored)
├── paths.ts                # Application URL paths
├── .env                    # Environment variables (gitignored)
├── playwright.config.ts    # Playwright configuration
└── package.json            # Scripts and dependencies
---

## Prerequisites

- Node.js v20+
- npm v10+

---

## Installation

```bash
cd tests/ui
npm install
```

---

## Environment Setup

Create a `.env` file inside `tests/ui/`:

```bash
BASE_URL=https://chat.mistral.ai
MISTRAL_EMAIL=your_email@example.com
MISTRAL_PASSWORD=your_password
MISTRAL_WRONG_PASSWORD=WrongPassword999!
```

---

## Running Tests

### Run all tests (browser visible)
```bash
npm test
```

### Run all tests headless (no browser window)
```bash
npm run test:headless
```

### Run a specific file
```bash
npm run test:file -- e2e/login.spec.ts --headed
```

### Run a specific scenario by name
```bash
npm run test:grep -- "TC-UI-01"
```

### Open HTML report
```bash
npm run report
```

---

## Session Management

- Login tests always use a **fresh browser** with no session
- Chat tests automatically **create a session** on first run and reuse it for subsequent runs
- If the session expires, it is **automatically recreated**
- Session is saved to `.auth/session.json` (gitignored)

---

## Test Cases

### Login (`login.spec.ts`)

| Test ID | Description |
|---------|-------------|
| TC-UI-01 | Successful login with valid credentials |
| TC-UI-02 | Login fails with wrong password |
| TC-UI-03 | Login fails with empty email |
| TC-UI-04 | Login fails with empty password |

### Chat Completion (`chat.spec.ts`)

| Test ID | Description |
|---------|-------------|
| TC-UI-05 | Logged-in user can send a prompt and receive a response |
| TC-UI-06 | Response contains relevant keywords |
| TC-UI-07 | Response is delivered within 30 seconds |

---

## How to Add New Tests

### Step 1 — Create a Page Object (if new page)

Create a new file in `pages/`:

```typescript
// pages/SettingsPage.ts
import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly someElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.someElement = page.locator('[data-testid="some-element"]');
  }

  async doSomething() {
    await this.someElement.click();
  }
}
```

### Step 2 — Add URL path (if new page)

Add the new path to `paths.ts`:

```typescript
export const PATHS = {
  home: '/',
  chat: '/chat',
  agents: '/agents',
  settings: '/settings', // ← add here
};
```

### Step 3 — Add fixture (if new page)

Add a new fixture to `fixtures/base.ts`:

```typescript
settingsPage: async ({ browser, baseURL }, use) => {
  const { context, page } = await getValidContext(browser, baseURL!);
  await page.goto(PATHS.settings);
  await use(new SettingsPage(page));
  await context.close();
},
```

Also add to the type definition:
```typescript
export const test = base.extend<{
  loginPage: LoginPage;
  chatPage: ChatPage;
  settingsPage: SettingsPage; // ← add here
}>({
```

### Step 4 — Create the spec file

```typescript
// e2e/settings.spec.ts
import { test, expect } from '../fixtures/base';

test.describe('Settings', () => {

  test('TC-UI-08 | User can update settings', async ({ settingsPage }) => {
    // your test here
  });

});
```

### Step 5 — Add script to package.json (optional)

```json
"test:settings": "npx playwright test e2e/settings.spec.ts --headed"
```

---

## Architecture

This framework follows a 4-layer architecture:

1. **Spec files** — test scenarios written in plain English
2. **Page Objects** — centralised locators and actions per page
3. **Fixtures** — shared setup and teardown logic
4. **Paths** — centralised URL management

### Session Strategy

- `loginPage` fixture → always fresh browser, no session (for login tests)
- `chatPage` and future fixtures → session auto-created and reused

---