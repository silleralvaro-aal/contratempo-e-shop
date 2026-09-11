import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/AdminGuard";
import { deleteProduct, fetchAllProducts } from "@/lib/admin";
import { formatEuro, productImage } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Amministrazione | Contro il Tempo" },
      { name: "description", content: "Gestione degli esemplari della manifattura Contro il Tempo." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Amministrazione | Contro il Tempo" },
      { property: "og:description", content: "Gestione degli esemplari Contro il Tempo." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <Pannello />
    </AdminGuard>
  ),
});

function Pannello() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: prodotti, isPending, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAllProducts,
  });

  const esci = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const elimina = async (id: string, nome: string) => {
    if (!confirm(`Eliminare definitivamente “${nome}”?`)) return;
    await deleteProduct(id);
    await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  return (
    <section className="px-6 pb-24 pt-36 md:px-12 md:pt-44">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Manifattura</p>
            <h1 className="mt-4 font-serif text-4xl font-light uppercase tracking-[0.2em] text-white">
              Amministrazione
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/$id"
              params={{ id: "nuovo" }}
              className="flex items-center gap-2 bg-primary px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140]"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Nuovo esemplare
            </Link>
            <button
              type="button"
              onClick={esci}
              className="border border-subtle px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Esci
            </button>
          </div>
        </div>

        {isPending && (
          <p className="mt-16 text-[11px] uppercase tracking-[0.25em] text-subtle">Caricamento…</p>
        )}
        {error && <p className="mt-16 text-sm text-red-400">{(error as Error).message}</p>}

        <div className="mt-12 space-y-4">
          {prodotti?.map((p) => (
            <article
              key={p.id}
              className="flex flex-wrap items-center gap-6 border border-border bg-surface p-5"
            >
              <img
                src={productImage(p)}
                alt={`${p.name} ${p.subtitle}`}
                loading="lazy"
                className="h-20 w-20 shrink-0 object-cover"
              />
              <div className="min-w-[180px] flex-1">
                <p className="font-serif text-xl uppercase tracking-[0.2em] text-white">{p.name}</p>
                <p className="font-serif text-sm italic text-primary">{p.subtitle}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-subtle">{p.slug}</p>
              </div>
              <div className="text-sm text-foreground">{formatEuro(p.price)}</div>
              <div className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.15em]">
                <span className={p.available ? "text-primary" : "text-subtle"}>
                  {p.available ? "Disponibile" : "Non disponibile"}
                </span>
                {p.featured && <span className="text-muted-foreground">In evidenza</span>}
                <span className="text-subtle">Scorte: {p.inventory}</span>
              </div>
              <div className="ml-auto flex gap-3">
                <Link
                  to="/admin/$id"
                  params={{ id: p.id }}
                  aria-label={`Modifica ${p.name}`}
                  className="border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.2} />
                </Link>
                <button
                  type="button"
                  aria-label={`Elimina ${p.name}`}
                  onClick={() => elimina(p.id, p.name)}
                  className="border border-border p-3 text-subtle transition-colors hover:border-red-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.2} />
                </button>
              </div>
            </article>
          ))}
          {prodotti?.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessun esemplare in archivio.</p>
          )}
        </div>
      </div>
    </section>
  );
}
