import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { AdminGuard } from "@/components/AdminGuard";
import {
  createProduct,
  fetchProductById,
  removeStoredImage,
  updateProduct,
  uploadProductImage,
  type ProductInput,
} from "@/lib/admin";
import { imageUrl, type ProductSpec } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  head: () => ({
    meta: [
      { title: "Scheda esemplare | Contratempo" },
      { name: "description", content: "Modifica di un esemplare della manifattura Contratempo." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Scheda esemplare | Contratempo" },
      { property: "og:description", content: "Modifica di un esemplare Contratempo." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <Editor />
    </AdminGuard>
  ),
});

const vuoto: ProductInput = {
  slug: "",
  name: "",
  subtitle: "",
  eyebrow: "",
  description: "",
  price: 0,
  images: [],
  specs: [],
  available: true,
  featured: false,
  inventory: 0,
  sortOrder: 0,
};

const sluggify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function Editor() {
  const { id } = Route.useParams();
  const nuovo = id === "nuovo";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: esistente, isPending } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => fetchProductById(id),
    enabled: !nuovo,
  });

  const [form, setForm] = useState<ProductInput>(vuoto);
  const [errore, setErrore] = useState<string | null>(null);
  const [salvataggio, setSalvataggio] = useState(false);
  const [caricamento, setCaricamento] = useState(false);

  useEffect(() => {
    if (esistente) {
      const { id: _id, ...resto } = esistente;
      setForm(resto);
    }
  }, [esistente]);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validazione = (): string | null => {
    if (form.name.trim().length < 2) return "Il nome deve contenere almeno 2 caratteri.";
    if (!/^[a-z0-9-]+$/.test(form.slug)) return "Lo slug può contenere solo lettere minuscole, numeri e trattini.";
    if (!Number.isFinite(form.price) || form.price < 0) return "Il prezzo deve essere un numero positivo.";
    if (!Number.isInteger(form.inventory) || form.inventory < 0)
      return "L'inventario deve essere un numero intero positivo.";
    if (form.description.trim().length < 10) return "La descrizione deve contenere almeno 10 caratteri.";
    return null;
  };

  const salva = async (e: React.FormEvent) => {
    e.preventDefault();
    const problema = validazione();
    if (problema) {
      setErrore(problema);
      return;
    }
    setErrore(null);
    setSalvataggio(true);
    try {
      if (nuovo) await createProduct(form);
      else await updateProduct(id, form);
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-product", id] });
      navigate({ to: "/admin" });
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setSalvataggio(false);
    }
  };

  const carica = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCaricamento(true);
    setErrore(null);
    try {
      const percorsi: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) throw new Error("Sono ammesse solo immagini.");
        if (file.size > 10 * 1024 * 1024) throw new Error("Ogni immagine deve pesare meno di 10 MB.");
        percorsi.push(await uploadProductImage(file, form.slug || sluggify(form.name)));
      }
      setForm((f) => ({ ...f, images: [...f.images, ...percorsi] }));
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Caricamento non riuscito.");
    } finally {
      setCaricamento(false);
    }
  };

  const rimuoviImmagine = async (path: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== path) }));
    await removeStoredImage(path);
  };

  const aggiornaSpec = (index: number, campo: keyof ProductSpec, valore: string) =>
    setForm((f) => ({
      ...f,
      specs: f.specs.map((s, i) => (i === index ? { ...s, [campo]: valore } : s)),
    }));

  if (!nuovo && isPending) {
    return (
      <p className="px-6 pt-40 text-center text-[11px] uppercase tracking-[0.25em] text-subtle">
        Caricamento…
      </p>
    );
  }

  const campo = "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary";
  const etichetta = "mb-2 block text-[11px] uppercase tracking-[0.2em] text-subtle";

  return (
    <section className="px-6 pb-24 pt-36 md:px-12 md:pt-44">
      <div className="mx-auto max-w-[860px]">
        <Link
          to="/admin"
          className="text-[11px] uppercase tracking-[0.25em] text-subtle transition-colors hover:text-primary"
        >
          ← Amministrazione
        </Link>
        <h1 className="mt-6 font-serif text-4xl font-light uppercase tracking-[0.2em] text-white">
          {nuovo ? "Nuovo esemplare" : form.name || "Esemplare"}
        </h1>

        <form onSubmit={salva} className="mt-10 space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="nome" className={etichetta}>Nome</label>
              <input
                id="nome"
                className={campo}
                value={form.name}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name: v,
                    slug: nuovo && (f.slug === "" || f.slug === sluggify(f.name)) ? sluggify(v) : f.slug,
                  }));
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className={etichetta}>Slug (indirizzo)</label>
              <input
                id="slug"
                className={campo}
                value={form.slug}
                onChange={(e) => set("slug", sluggify(e.target.value))}
                required
              />
            </div>
            <div>
              <label htmlFor="sottotitolo" className={etichetta}>Sottotitolo</label>
              <input
                id="sottotitolo"
                className={campo}
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="occhiello" className={etichetta}>Occhiello</label>
              <input
                id="occhiello"
                className={campo}
                value={form.eyebrow}
                onChange={(e) => set("eyebrow", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="prezzo" className={etichetta}>Prezzo (EUR)</label>
              <input
                id="prezzo"
                type="number"
                min={0}
                step="0.01"
                className={campo}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="inventario" className={etichetta}>Inventario</label>
              <input
                id="inventario"
                type="number"
                min={0}
                step="1"
                className={campo}
                value={form.inventory}
                onChange={(e) => set("inventory", Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="ordine" className={etichetta}>Ordine di visualizzazione</label>
              <input
                id="ordine"
                type="number"
                step="1"
                className={campo}
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
              />
            </div>
            <div className="flex items-end gap-8">
              <label className="flex items-center gap-3 text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => set("available", e.target.checked)}
                  className="h-4 w-4 accent-[#a8794d]"
                />
                Disponibile
              </label>
              <label className="flex items-center gap-3 text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4 w-4 accent-[#a8794d]"
                />
                In evidenza
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="descrizione" className={etichetta}>Descrizione</label>
            <textarea
              id="descrizione"
              rows={6}
              className={campo}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div>
            <p className={etichetta}>Immagini</p>
            <div className="flex flex-wrap gap-4">
              {form.images.map((path) => (
                <div key={path} className="relative">
                  <img
                    src={imageUrl(path)}
                    alt="Immagine esemplare"
                    className="h-28 w-28 border border-border object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Rimuovi immagine"
                    onClick={() => rimuoviImmagine(path)}
                    className="absolute -right-2 -top-2 bg-background p-1 text-subtle transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.2} />
                  </button>
                </div>
              ))}
              <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border text-[10px] uppercase tracking-[0.15em] text-subtle transition-colors hover:border-primary hover:text-primary">
                <Upload className="h-5 w-5" strokeWidth={1} />
                {caricamento ? "Carico…" : "Carica"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => carica(e.target.files)}
                />
              </label>
            </div>
          </div>

          <div>
            <p className={etichetta}>Specifiche tecniche</p>
            <div className="space-y-3">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex flex-wrap gap-3">
                  <input
                    aria-label="Etichetta specifica"
                    className={`${campo} flex-1`}
                    placeholder="Cassa (Case)"
                    value={spec.label}
                    onChange={(e) => aggiornaSpec(i, "label", e.target.value)}
                  />
                  <input
                    aria-label="Valore specifica"
                    className={`${campo} flex-1`}
                    placeholder="Argento massiccio 925"
                    value={spec.value}
                    onChange={(e) => aggiornaSpec(i, "value", e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label="Rimuovi specifica"
                    onClick={() => set("specs", form.specs.filter((_, x) => x !== i))}
                    className="border border-border px-4 text-subtle transition-colors hover:border-red-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.2} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set("specs", [...form.specs, { label: "", value: "" }])}
              className="mt-4 border border-subtle px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Aggiungi specifica
            </button>
          </div>

          {errore && <p className="text-sm text-red-400">{errore}</p>}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={salvataggio}
              className="bg-primary px-10 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140] disabled:opacity-40"
            >
              {salvataggio ? "Salvataggio…" : "Salva esemplare"}
            </button>
            <Link
              to="/admin"
              className="border border-subtle px-10 py-4 text-[12px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Annulla
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
