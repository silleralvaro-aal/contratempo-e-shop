import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/immagini/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = decodeURIComponent((params as { _splat?: string })._splat ?? "");
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const key =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ||
          import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]!;
        const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"]!;
        const supabase = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
                h.delete("Authorization");
              }
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });

        const { data, error } = await supabase.storage.from("product-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "image/jpeg",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
