import { test, expect } from '../fixtures/base';

test.describe('Chat Completion', () => {

  test('TC-UI-05 | Logged-in user can send a prompt and receive a response', async ({ chatPage }) => {
    await chatPage.sendPrompt('What is Page Object Model in Playwright?');
    const response = await chatPage.waitForResponse();
    expect(response.length).toBeGreaterThan(5);
  });

  test('TC-UI-06 | Response contains relevant keywords', async ({ chatPage }) => {
    await chatPage.sendPrompt('What is Page Object Model in Playwright?');
    const response = await chatPage.waitForResponse();
    const lowerResponse = response.toLowerCase();
    expect(lowerResponse).toContain('page');
    expect(lowerResponse).toContain('object');
    expect(lowerResponse).toContain('locator');
  });

  test('TC-UI-07 | Response is delivered within 30 seconds', async ({ chatPage }) => {
    const start = Date.now();
    await chatPage.sendPrompt('What is Page Object Model in Playwright?');
    const response = await chatPage.waitForResponse();
    const elapsed = Date.now() - start;
    expect(response.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(30000);
    console.log(`Response delivered in ${elapsed}ms`);
  });

});