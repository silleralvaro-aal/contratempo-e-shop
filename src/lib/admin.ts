import { supabase } from "@/integrations/supabase/client";
import { toProduct, type Product, type ProductSpec } from "./products";

const SELECT =
  "id, slug, name, subtitle, eyebrow, description, price, images, specs, available, featured, inventory, sort_order";

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => toProduct(r as never));
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select(SELECT).eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toProduct(data as never) : null;
}

export type ProductInput = {
  slug: string;
  name: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  price: number;
  images: string[];
  specs: ProductSpec[];
  available: boolean;
  featured: boolean;
  inventory: number;
  sortOrder: number;
};

function toRow(input: ProductInput) {
  return {
    slug: input.slug,
    name: input.name,
    subtitle: input.subtitle,
    eyebrow: input.eyebrow,
    description: input.description,
    price: input.price,
    images: input.images,
    specs: input.specs as unknown as never,
    available: input.available,
    featured: input.featured,
    inventory: input.inventory,
    sort_order: input.sortOrder,
  };
}

export async function createProduct(input: ProductInput): Promise<string> {
  const { data, error } = await supabase.from("products").insert(toRow(input)).select("id").single();
  if (error) throw new Error(traduci(error.message));
  return data.id;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);
  if (error) throw new Error(traduci(error.message));
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(traduci(error.message));
}

export async function uploadProductImage(file: File, slug: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${slug || "esemplare"}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(traduci(error.message));
  return path;
}

export async function removeStoredImage(path: string): Promise<void> {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return;
  await supabase.storage.from("product-images").remove([path]);
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) return false;
  return Boolean(data);
}

export async function adminExists(): Promise<boolean> {
  const { data } = await supabase.rpc("admin_exists");
  return Boolean(data);
}

export async function claimAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("claim_admin");
  if (error) throw new Error(error.message);
  return Boolean(data);
}

function traduci(message: string): string {
  if (message.includes("duplicate key")) return "Esiste già un esemplare con questo slug.";
  if (message.toLowerCase().includes("row-level security")) {
    return "Permessi insufficienti: serve un account amministratore.";
  }
  return message;
}
