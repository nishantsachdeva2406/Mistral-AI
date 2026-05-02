import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators
  readonly signInButton: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly chatInput: Locator;
  readonly newChatButton: Locator;
  readonly invalidPasswordError: Locator;
  readonly emptyPasswordError: Locator;
  readonly acceptTermsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInButton = page.getByText('Sign in', { exact: true });
    this.emailInput = page.locator('input[name="email"]');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.getByText('Continue with password', { exact: true });
    this.chatInput = page.locator('[data-placeholder="Type / for quick access"]');
    this.newChatButton = page.locator('[data-sidebar="menu-main-button"][href="/chat"]');
    this.invalidPasswordError = page.getByText('Invalid password. Please try again.');
    this.emptyPasswordError = page.getByText('Password is required');
    this.acceptTermsButton = page.getByText('Accept and continue', { exact: true });
  }

  async goto() {
  await this.page.goto('/');

  // Handle Terms of Service modal if it appears on landing
  try {
    await this.acceptTermsButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.acceptTermsButton.click();
  } catch {
    // Modal did not appear — continue normally
  }
}

  async login(email: string, password: string) {
    await this.signInButton.click();
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.passwordInput.fill(password);
    await this.submitButton.click();

  }

  async saveSession() {
  await this.page.context().storageState({ path: '.auth/session.json' });
  console.log('Session saved.');
}
}