import { defineConfig, presetWind4, presetIcons, presetWebFonts } from "unocss";

// INFO: ----------------
//         Theming
// ----------------------

function oklchScale(cssVariable: string) {
  return {
    50: `oklch(from var(${cssVariable}) 0.95 c h)`,
    100: `oklch(from var(${cssVariable}) 0.90 c h)`,
    200: `oklch(from var(${cssVariable}) 0.80 c h)`,
    300: `oklch(from var(${cssVariable}) 0.70 c h)`,
    400: `oklch(from var(${cssVariable}) 0.60 c h)`,
    500: `oklch(from var(${cssVariable}) 0.50 c h)`,
    600: `oklch(from var(${cssVariable}) 0.40 c h)`,
    700: `oklch(from var(${cssVariable}) 0.30 c h)`,
    800: `oklch(from var(${cssVariable}) 0.20 c h)`,
    900: `oklch(from var(${cssVariable}) 0.10 c h)`,
    950: `oklch(from var(${cssVariable}) 0.05 c h)`,
  };
}

// INFO: ----------------
//         Config
// ----------------------

export default defineConfig({
  // Classes dynamically assembled at runtime (e.g. Badge variant lookup) won't be
  // scanned by svelte-scoped UnoCSS — list them explicitly so the global sheet includes them.
  safelist: [
    "bg-red-100",
    "text-red-700",
    "bg-secondary-100",
    "text-secondary-700",
    "bg-primary-100",
    "text-primary-700",
    "bg-neutral-100",
    "text-neutral-700",
    "dark:bg-neutral-800",
    "dark:text-neutral-300",
  ],
  presets: [
    presetWind4({ preflights: { reset: true } }),
    presetIcons(),
    presetWebFonts(),
  ],
  preflights: [
    {
      getCSS: () =>
        `
				html {
					--color-primary: #95d7ff;
					--color-secondary: #85ffd4;
					--color-neutral: #fff9f2;
					--color-success: #8bff86;
					--color-failure: #c90000;
					--color-bg: #fff6ec;
					--color-fg: #090B0E;
				}

				html.dark, .dark {
					--color-primary: #2f3396;
					--color-secondary: #74ffcc;
					--color-neutral: #eaf3ff;
					--color-success: #0bff00;
					--color-failure: #ff0000;
					--color-bg: #090B0E;
					--color-fg: #fff6ec;
				}
			`,
    },
  ],
  theme: {
    colors: {
      primary: oklchScale("--color-primary"),
      secondary: oklchScale("--color-secondary"),
      neutral: oklchScale("--color-neutral"),
      success: oklchScale("--color-success"),
      failure: oklchScale("--color-failure"),
      bg: "var(--color-bg)",
      fg: "var(--color-fg)",
    },
  },
});
