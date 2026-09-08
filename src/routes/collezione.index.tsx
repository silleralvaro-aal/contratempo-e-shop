import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { listCatalog } from "@/lib/catalog.functions";

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => listCatalog(),
});

export const Route = createFileRoute("/collezione/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { title: "Collezione | Contratempo" },
      {
        name: "description",
        content:
          "La collezione Contratempo: esemplari di alta orologeria italiana, dalla radica naturale allo scheletro in platino.",
      },
      { property: "og:title", content: "Collezione | Contratempo" },
      {
        property: "og:description",
        content: "Esemplari di alta orologeria italiana, ciascuno irripetibile.",
      },
    ],
  }),
  errorComponent: () => (
    <p className="px-6 pt-40 text-center text-sm text-muted-foreground">
      Collezione momentaneamente non disponibile.
    </p>
  ),
  component: Collezione,
});

function Collezione() {
  const { data: prodotti } = useSuspenseQuery(catalogQuery);

  return (
    <section className="px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Milano — Manifattura</p>
        <h1 className="mt-4 font-serif text-4xl font-light uppercase tracking-[0.2em] text-white md:text-6xl">
          Collezione
        </h1>
        <p className="mt-6 max-w-[640px] text-base leading-[2] text-muted-foreground">
          Ogni Contratempo nasce da una singola lastra di materia naturale. Le immagini mostrano
          esemplari rappresentativi: il tuo avrà una venatura irripetibile.
        </p>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {prodotti.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        {prodotti.length === 0 && (
          <p className="mt-14 text-sm text-muted-foreground">
            Nessun esemplare disponibile in questo momento.
          </p>
        )}
      </div>
    </section>
  );
}
