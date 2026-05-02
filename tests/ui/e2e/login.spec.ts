import { test, expect } from '../fixtures/base';

test.use({ storageState: undefined }); // override — no session for login tests

test.describe('Login', () => {

  test('TC-UI-01 | Successful login with valid credentials', async ({ loginPage }) => {
    await loginPage.login(
      process.env.MISTRAL_EMAIL!,
      process.env.MISTRAL_PASSWORD!
    );
    await expect(loginPage.page).toHaveURL(/.*chat/);
    await expect(loginPage.chatInput).toBeVisible();
    await expect(loginPage.newChatButton).toBeVisible();
    await loginPage.saveSession();
  });

  test('TC-UI-02 | Login fails with wrong password', async ({ loginPage }) => {
    await loginPage.login(
      process.env.MISTRAL_EMAIL!,
      process.env.MISTRAL_WRONG_PASSWORD!
    );
    await expect(loginPage.invalidPasswordError).toBeVisible();
    await expect(loginPage.page).not.toHaveURL(/.*chat/);
  });

  test('TC-UI-03 | Login fails with empty email', async ({ loginPage }) => {
    await loginPage.signInButton.click();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.continueButton).not.toBeVisible();
  });

  test('TC-UI-04 | Login fails with empty password', async ({ loginPage }) => {
    await loginPage.signInButton.click();
    await loginPage.emailInput.waitFor({ state: 'visible' });
    await loginPage.emailInput.click();
    await loginPage.emailInput.fill(process.env.MISTRAL_EMAIL!);
    await loginPage.continueButton.click();
    await loginPage.passwordInput.fill('');
    await loginPage.submitButton.click();
    await expect(loginPage.emptyPasswordError).toBeVisible();
    await expect(loginPage.page).not.toHaveURL(/.*chat/);
  });

});