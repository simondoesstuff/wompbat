import { defineConfig, presetWind4, presetIcons, presetWebFonts } from "unocss";
import presetTheme from "unocss-preset-theme";
import { SHADE_SCALE } from "./src/lib/theme-scale";

function oklchScale(color: string) {
  return Object.fromEntries(
    SHADE_SCALE.map(({ label, l }) => [label, `oklch(from ${color} ${l} c h)`])
  );
}

export default defineConfig({
  shortcuts: {
    'id-link': 'font-mono font-semibold text-primary-700 hover:underline',
    'section-label': 'text-xs font-semibold uppercase tracking-widest text-neutral-500',
    'th-cell': 'px-3 py-2 font-semibold',
    'th-right': 'px-3 py-2 font-semibold text-right',
    'td-num': 'px-3 py-2 text-right font-mono text-neutral-700',
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
  ],
  presets: [
    presetWind4({ preflights: { reset: true } }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    presetTheme({
      theme: {
        dark: {
          colors: {
            primary: oklchScale("#2f3396"),
            secondary: oklchScale("#74ffcc"),
            neutral: oklchScale("#eaf3ff"),
            success: oklchScale("#0bff00"),
            failure: oklchScale("#ff0000"),
            bg: "#090B0E",
            fg: "#fff6ec",
          },
        },
      },
    }) as any,
    presetIcons(),
    presetWebFonts({
      fonts: {
        display: { name: "Fredoka", weights: ["500"] },
      },
    }),
  ],
  theme: {
    colors: {
      primary: oklchScale("#6a8290"),
      secondary: oklchScale("#85ffd4"),
      neutral: oklchScale("#fff9f2"),
      success: oklchScale("#8bff86"),
      failure: oklchScale("#c90000"),
      bg: "#fff6ec",
      fg: "#090B0E",
    },
  },
});
