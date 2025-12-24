import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    timeout: 30 * 1000,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.workers ? parseInt(process.env.workers) : (process.env.CI ? 1 : undefined),
    grep: process.env.runThis ? new RegExp(process.env.runThis) : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list']
    ],
    use: {
        baseURL: 'https://demoqa.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        viewport: (process.env.VIEWPORT_WIDTH && process.env.VIEWPORT_HEIGHT)
            ? { width: parseInt(process.env.VIEWPORT_WIDTH), height: parseInt(process.env.VIEWPORT_HEIGHT) }
            : { width: 1280, height: 720 },
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
            },
        },
    ],
});
