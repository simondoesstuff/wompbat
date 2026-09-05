import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import UnoCSS from "@unocss/svelte-scoped/vite";
import { createReadStream, statSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

// Serve data/megatable.db at /megatable.db in dev mode with Range request support.
function serveLocalDB(): Plugin {
  return {
    name: "serve-local-db",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/megatable.db", (req, res) => {
        const dbPath = resolve("data/megatable.db");
        const stat = statSync(dbPath);
        const range = req.headers["range"];

        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Type", "application/octet-stream");

        if (range) {
          const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
          const start = parseInt(startStr, 10);
          const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${stat.size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "application/octet-stream",
          });
          createReadStream(dbPath, { start, end }).pipe(res);
        } else {
          res.writeHead(200, {
            "Accept-Ranges": "bytes",
            "Content-Length": stat.size,
            "Content-Type": "application/octet-stream",
          });
          createReadStream(dbPath).pipe(res);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    serveLocalDB(),
    UnoCSS({
      injectReset: "@unocss/reset/tailwind-v4.css",
    }),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },

      // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
      // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
      // See https://svelte.dev/docs/kit/adapters for more information about adapters.
      adapter: adapter(),
    }),
  ],
});
