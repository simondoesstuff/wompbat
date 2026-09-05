import { browser } from '$app/environment';
import type { SQLiteHTTPPool } from 'sqlite-wasm-http';

let poolPromise: Promise<SQLiteHTTPPool> | null = null;

export function getDB(): Promise<SQLiteHTTPPool> {
	if (!browser) return Promise.reject(new Error('DB unavailable in SSR'));
	if (!poolPromise) {
		poolPromise = (async () => {
			// Vite dev mode serves workers with ES module imports but creates them as
			// classic workers, which can't use import statements. Patch Worker to force
			// module type and rewrite Vite's worker URL accordingly.
			if (import.meta.env.DEV) {
				const Orig = globalThis.Worker;
				(globalThis as unknown as { Worker: typeof Worker }).Worker = class extends Orig {
					constructor(url: string | URL, opts?: WorkerOptions) {
						super(String(url).replace('type=classic', 'type=module'), {
							...opts,
							type: 'module',
						});
					}
				};
			}

			const { createSQLiteHTTPPool } = await import('sqlite-wasm-http');
			const pool = await createSQLiteHTTPPool({
				workers: 1,
				httpOptions: {
					maxPageSize: 1024,
					cacheSize: 8192,
					timeout: 30000,
				},
			});
			await pool.open('/megatable.db');
			return pool;
		})();
	}
	return poolPromise;
}
