import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.js', fullyParallel: true, workers: 2,
  use: { baseURL: 'http://127.0.0.1:4173', launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] }, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-390', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
  ],
  webServer: { command: 'npm start', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI }
});
