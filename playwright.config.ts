import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.INTEGRATION_BASE_URL;

export default defineConfig({
	testDir: './tests/integration',
	testMatch: '**/*.pw.ts',
	fullyParallel: false,
	workers: 1,
	retries: 0,
	timeout: 60_000,
	outputDir: 'data/integration-test-results/browser',
	reporter: [
		['list'],
		['html', { outputFolder: 'data/integration-test-results/report', open: 'never' }],
		['json', { outputFile: 'data/integration-test-results/results.json' }],
	],
	use: {
		...devices['Desktop Chrome'],
		baseURL: baseURL ?? 'http://127.0.0.1:4173',
		acceptDownloads: true,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	webServer: baseURL ? undefined : {
		command: 'bun run build && bun run preview --host 127.0.0.1 --port 4173 --strictPort',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: false,
		timeout: 120_000,
	},
});
