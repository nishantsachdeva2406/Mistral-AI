import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 1,

  reporter: [['html', { outputFolder: './reports', open: 'on-failure' }]],

 use: {
  baseURL: process.env.BASE_URL,
  viewport: { width: 1280, height: 800 },
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
},

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});