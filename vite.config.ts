import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from '@unocss/svelte-scoped/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

// UnoCSS svelte-scoped cannot parse svelteplot's <script generics="..."> syntax.
// Wrap its transform hook to skip node_modules files (works for both fn and ObjectHook forms).
function skipNodeModulesTransform(plugins: Plugin[]): Plugin[] {
  return plugins.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = p.transform as any;
    if (!t) return p;
    const wrap = (fn: (...a: unknown[]) => unknown) =>
      function (this: unknown, code: string, id: string, ...rest: unknown[]) {
        if (id.includes('/node_modules/')) return null;
        return fn.call(this, code, id, ...rest);
      };
    if (typeof t === 'function') return { ...p, transform: wrap(t) as Plugin['transform'] };
    if (typeof t.handler === 'function') return { ...p, transform: { ...t, handler: wrap(t.handler) } as Plugin['transform'] };
    return p;
  });
}

export default defineConfig({
  plugins: [
    ...skipNodeModulesTransform(UnoCSS({ injectReset: '@unocss/reset/tailwind-v4.css' }) as Plugin[]),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
      },
      adapter: adapter(),
    }),
  ],
});
