import { defineConfig, presetWind4, presetIcons, presetWebFonts } from "unocss";
import { SHADE_SCALE } from "./src/lib/theme-scale";

// INFO: ----------------
//         Theming
// ----------------------

function oklchScale(cssVariable: string) {
  return {
    50: `oklch(from var(${cssVariable}) 0.95 c h)`,
    100: `oklch(from var(${cssVariable}) 0.9 c h)`,
    200: `oklch(from var(${cssVariable}) 0.8 c h)`,
    300: `oklch(from var(${cssVariable}) 0.7 c h)`,
    400: `oklch(from var(${cssVariable}) 0.6 c h)`,
    500: `oklch(from var(${cssVariable}) 0.5 c h)`,
    600: `oklch(from var(${cssVariable}) 0.4 c h)`,
    700: `oklch(from var(${cssVariable}) 0.3 c h)`,
    800: `oklch(from var(${cssVariable}) 0.2 c h)`,
    900: `oklch(from var(${cssVariable}) 0.1 c h)`,
    950: `oklch(from var(${cssVariable}) 0.05 c h)`,
  };
}

// Neutral scale uses CSS vars so lightness can be inverted in dark mode.
// --neutral-l-base + --neutral-l-dir * L gives 0.9 in light and 0.1 in dark for shade-100, etc.
function oklchNeutralScale(cssVariable: string) {
  const shade = (l: number) =>
    `oklch(from var(${cssVariable}) calc(var(--neutral-l-base, 0) + var(--neutral-l-dir, 1) * ${l}) c h)`;
  return {
    50: shade(0.95),
    100: shade(0.9),
    200: shade(0.8),
    300: shade(0.7),
    400: shade(0.6),
    500: shade(0.5),
    600: shade(0.4),
    700: shade(0.3),
    800: shade(0.2),
    900: shade(0.1),
    950: shade(0.05),
  };
}

// INFO: ----------------
//         Config
// ----------------------

export default defineConfig({
  shortcuts: {
    "id-link":
      "font-mono font-semibold text-primary-700 hover:text-primary-900 hover:underline dark:text-primary-200 dark:hover:text-primary-400",
    "section-label":
      "text-xs font-semibold uppercase tracking-widest text-neutral-500",
    "th-cell": "px-3 py-2 font-semibold",
    "th-right": "px-3 py-2 font-semibold text-right",
    "td-num": "px-3 py-2 text-right font-mono text-neutral-700",
  },
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
    // Theme page: ensure all color scale CSS vars are generated
    ...["primary", "secondary", "neutral", "success", "failure"].flatMap(
      (name) => SHADE_SCALE.map(({ label }) => `bg-${name}-${label}`),
    ),
  ],
  presets: [
    presetWind4({ preflights: { reset: true } }),
    presetIcons(),
    presetWebFonts({
      fonts: {
        display: { name: "Fredoka", weights: ["500"] },
      },
    }),
  ],
  preflights: [
    {
      getCSS: () =>
        `
				html {
					--color-primary: #6a8290;
					--color-secondary: #85ffd4;
					--color-neutral: #fff9f2;
					--color-success: #8bff86;
					--color-failure: #c90000;
					--color-bg: #fff6ec;
					--color-fg: #090B0E;
					--neutral-l-base: 0;
					--neutral-l-dir: 1;
				}

				html.dark, .dark {
					--color-primary: #2f3396;
					--color-secondary: #74ffcc;
					--color-neutral: #eaf3ff;
					--color-success: #0bff00;
					--color-failure: #ff0000;
					--color-bg: #0f0f0d;
					--color-fg: #fff6ec;
					--neutral-l-base: 1;
					--neutral-l-dir: -1;
				}
			`,
    },
  ],
  theme: {
    colors: {
      primary: oklchScale("--color-primary"),
      secondary: oklchScale("--color-secondary"),
      neutral: oklchNeutralScale("--color-neutral"),
      success: oklchScale("--color-success"),
      failure: oklchScale("--color-failure"),
      bg: "var(--color-bg)",
      fg: "var(--color-fg)",
    },
  },
});
