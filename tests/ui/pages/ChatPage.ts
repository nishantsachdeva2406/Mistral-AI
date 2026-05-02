import { Page, Locator } from '@playwright/test';

export class ChatPage {
  readonly page: Page;
  readonly chatInput: Locator;
  readonly responseContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chatInput = page.locator('[data-placeholder="Type / for quick access"]');
    this.responseContainer = page.locator('[data-testid="text-message-part"]').last();
  }

  // Handle Memory modal if it appears
async dismissMemoryModalIfVisible() {
  try {
    const notNowButton = this.page.getByRole('button', { name: 'Not now' });
    await notNowButton.waitFor({ state: 'visible', timeout: 5000 });
    await notNowButton.click();
    console.log('Memory modal dismissed.');
  } catch {
    // Modal did not appear — continue
  }
}

  // Type prompt and press Enter to submit
  async sendPrompt(prompt: string) {
    await this.dismissMemoryModalIfVisible();
    await this.chatInput.waitFor({ state: 'visible' });
    await this.chatInput.click();
    await this.chatInput.fill(prompt);
    await this.page.keyboard.press('Enter');
  }

  // Wait for streaming response to finish and return the text
  async waitForResponse(): Promise<string> {
    await this.responseContainer.waitFor({ state: 'visible', timeout: 30000 });

    // Wait for streaming to finish — poll until text stops changing
    let previousText = '';
    let stableCount = 0;

    while (stableCount < 3) {
      await this.page.waitForTimeout(1500);
      const currentText = await this.responseContainer.innerText();

      if (currentText === previousText && currentText.length > 0) {
        stableCount++;
      } else {
        stableCount = 0;
        previousText = currentText;
      }
    }
    return previousText;
  }
}