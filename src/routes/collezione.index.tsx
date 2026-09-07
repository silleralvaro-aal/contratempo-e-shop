import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/collezione/")({
  head: () => ({
    meta: [
      { title: "Collezione | Contratempo" },
      {
        name: "description",
        content:
          "La collezione Contratempo: quattro esemplari di alta orologeria italiana, dalla radica naturale allo scheletro in platino.",
      },
      { property: "og:title", content: "Collezione | Contratempo" },
      {
        property: "og:description",
        content: "Quattro esemplari di alta orologeria italiana, ciascuno irripetibile.",
      },
    ],
  }),
  component: Collezione,
});

function Collezione() {
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
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
