import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { toProduct, type Product } from "./products";

const SELECT =
  "id, slug, name, subtitle, eyebrow, description, price, images, specs, available, featured, inventory, sort_order";

function publicClient() {
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"]!;
  return createClient(url, key, {
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
}

export const listCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const { data, error } = await publicClient()
    .from("products")
    .select(SELECT)
    .eq("available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => toProduct(r as never));
});

export const getCatalogProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }): Promise<Product | null> => {
    const { data: row, error } = await publicClient()
      .from("products")
      .select(SELECT)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? toProduct(row as never) : null;
  });
