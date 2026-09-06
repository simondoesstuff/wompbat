import { defineConfig, presetWind4, presetIcons, presetWebFonts } from "unocss";
import presetTheme from "unocss-preset-theme";

function oklchScale(color: string) {
  return {
    50: `oklch(from ${color} 0.95 c h)`,
    100: `oklch(from ${color} 0.90 c h)`,
    200: `oklch(from ${color} 0.80 c h)`,
    300: `oklch(from ${color} 0.70 c h)`,
    400: `oklch(from ${color} 0.60 c h)`,
    500: `oklch(from ${color} 0.50 c h)`,
    600: `oklch(from ${color} 0.40 c h)`,
    700: `oklch(from ${color} 0.30 c h)`,
    800: `oklch(from ${color} 0.20 c h)`,
    900: `oklch(from ${color} 0.10 c h)`,
    950: `oklch(from ${color} 0.05 c h)`,
  };
}

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
