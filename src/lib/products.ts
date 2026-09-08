import venatura from "@/assets/watch-venatura.jpg";
import notturno from "@/assets/watch-notturno.jpg";
import aurora from "@/assets/watch-aurora.jpg";
import meccanica from "@/assets/watch-meccanica.jpg";

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
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

/** Immagini di riserva per gli esemplari storici della manifattura. */
const fallbackImages: Record<string, string> = {
  "venatura-radica": venatura,
  "notturno-ardesia": notturno,
  "aurora-champagne": aurora,
  "meccanica-scheletro": meccanica,
};

export const placeholderImage = venatura;

/** Trasforma un percorso dell'archivio immagini in un URL utilizzabile. */
export function imageUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
  return `/api/public/immagini/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function productImage(product: Pick<Product, "slug" | "images">): string {
  const first = product.images.find((i) => i.trim().length > 0);
  if (first) return imageUrl(first);
  return fallbackImages[product.slug] ?? placeholderImage;
}

export function productImages(product: Pick<Product, "slug" | "images">): string[] {
  const list = product.images.filter((i) => i.trim().length > 0).map(imageUrl);
  return list.length > 0 ? list : [productImage(product)];
}

export const formatEuro = (value: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);

type Row = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  eyebrow: string | null;
  description: string | null;
  price: number | string;
  images: string[] | null;
  specs: unknown;
  available: boolean;
  featured: boolean;
  inventory: number;
  sort_order: number;
};

export function toProduct(row: Row): Product {
  const specs = Array.isArray(row.specs)
    ? (row.specs as ProductSpec[]).filter((s) => s && typeof s.label === "string")
    : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle ?? "",
    eyebrow: row.eyebrow ?? "",
    description: row.description ?? "",
    price: Number(row.price),
    images: row.images ?? [],
    specs,
    available: row.available,
    featured: row.featured,
    inventory: row.inventory,
    sortOrder: row.sort_order,
  };
}
