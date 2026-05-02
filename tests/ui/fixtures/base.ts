import { test as base, Browser } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ChatPage } from '../pages/ChatPage';
import { PATHS } from '../paths';
import * as fs from 'fs';

const SESSION_PATH = '.auth/session.json';

// Create a new session by logging in
async function createSession(browser: Browser, baseURL: string) {
  console.log('Creating session...');
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.MISTRAL_EMAIL!,
    process.env.MISTRAL_PASSWORD!
  );
  await page.locator('[data-sidebar="menu-main-button"][href="/chat"]')
    .waitFor({ state: 'visible', timeout: 30000 });
  await context.storageState({ path: SESSION_PATH });
  await context.close();
  console.log('Session saved.');
}

// Get a valid context with session
async function getValidContext(browser: Browser, baseURL: string) {
  // No session — create one
  if (!fs.existsSync(SESSION_PATH)) {
    await createSession(browser, baseURL);
  }

  // Load session
  const context = await browser.newContext({
    baseURL,
    storageState: SESSION_PATH,
  });
  const page = await context.newPage();
  await page.goto(PATHS.chat);

  // Check if session is still valid
  const isLoggedIn = await page.locator('[data-sidebar="menu-main-button"][href="/chat"]')
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (!isLoggedIn) {
    // Session expired — recreate
    console.log('Session expired — recreating...');
    await context.close();
    fs.unlinkSync(SESSION_PATH);
    await createSession(browser, baseURL);

    // Load fresh session
    const newContext = await browser.newContext({
      baseURL,
      storageState: SESSION_PATH,
    });
    const newPage = await newContext.newPage();
    await newPage.goto(PATHS.chat);
    return { context: newContext, page: newPage };
  }

  return { context, page };
}

export const test = base.extend<{
  loginPage: LoginPage;
  chatPage: ChatPage;
}>({

  // Login tests — always fresh browser, no session
  loginPage: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: undefined,
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
    await context.close();
  },

  // Chat and future tests — session handled automatically
  chatPage: async ({ browser, baseURL }, use) => {
    const { context, page } = await getValidContext(browser, baseURL!);
    await use(new ChatPage(page));
    await context.close();
  },

});

export { expect } from '@playwright/test';