import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatEuro, productImage, productImages } from "@/lib/products";
import { getCatalogProduct, listCatalog } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/collezione/$slug")({
  loader: async ({ params }) => {
    const [product, tutti] = await Promise.all([
      getCatalogProduct({ data: { slug: params.slug } }),
      listCatalog(),
    ]);
    if (!product) throw notFound();
    return { product, altri: tutti.filter((p) => p.slug !== product.slug).slice(0, 3) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Esemplare non trovato | Contro il Tempo" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} ${product.subtitle} | Contro il Tempo`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description.slice(0, 155) },
      ],
    };
  },
  errorComponent: () => (
    <p className="px-6 pt-40 text-center text-sm text-muted-foreground">
      Esemplare momentaneamente non disponibile.
    </p>
  ),
  notFoundComponent: () => (
    <div className="px-6 pt-40 text-center">
      <p className="text-sm text-muted-foreground">Questo esemplare non esiste più.</p>
      <Link to="/collezione" className="mt-6 inline-block text-[11px] uppercase tracking-[0.25em] text-primary">
        Torna alla collezione
      </Link>
    </div>
  ),
  component: Dettaglio,
});

function Dettaglio() {
  const { product, altri } = Route.useLoaderData();
  const { add } = useCart();
  const gallery = productImages(product);
  const [attiva, setAttiva] = useState(0);
  const esaurito = product.inventory <= 0;

  return (
    <section className="px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <Link
          to="/collezione"
          className="text-[11px] uppercase tracking-[0.25em] text-subtle transition-colors hover:text-primary"
        >
          ← Collezione
        </Link>

        <div className="mt-10 flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="w-full flex-1">
            <img
              src={gallery[attiva] ?? gallery[0]}
              alt={`Orologio ${product.name} ${product.subtitle}`}
              width={1024}
              height={1024}
              className="w-full border border-border object-cover"
            />
            {gallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setAttiva(i)}
                    aria-label={`Immagine ${i + 1}`}
                    className={`border ${i === attiva ? "border-primary" : "border-border"}`}
                  >
                    <img src={src} alt="" className="h-20 w-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            <span className="mb-4 block text-[12px] uppercase tracking-[0.25em] text-primary">
              {product.eyebrow}
            </span>
            <h1 className="font-serif text-[42px] font-light uppercase leading-none tracking-[0.3em] text-white md:text-[56px]">
              {product.name}
            </h1>
            <p className="mt-3 font-serif text-2xl italic text-primary">{product.subtitle}</p>
            <p className="mt-8 text-base leading-[1.9] text-muted-foreground">
              {product.description}
            </p>

            {product.specs.length > 0 && (
              <div className="my-10 grid grid-cols-1 gap-5 border-y border-border py-6 sm:grid-cols-2">
                {product.specs.map((s) => (
                  <div key={s.label}>
                    <h4 className="mb-1 text-[11px] uppercase tracking-[0.1em] text-subtle">
                      {s.label}
                    </h4>
                    <p className="text-[15px] font-semibold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="mb-3 font-serif text-3xl text-white">{formatEuro(product.price)}</p>
            <p className="mb-8 text-[11px] uppercase tracking-[0.2em] text-subtle">
              {esaurito ? "Esaurito" : `Disponibilità: ${product.inventory} esemplari`}
            </p>
            <button
              type="button"
              onClick={() => add(product)}
              disabled={esaurito}
              className="bg-primary px-10 py-4 text-[14px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {esaurito ? "Esaurito" : "Acquista il Tuo Unico"}
            </button>
          </div>
        </div>

        {altri.length > 0 && (
          <div className="mt-28">
            <h2 className="font-serif text-2xl font-light uppercase tracking-[0.25em] text-white">
              Altri Esemplari
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {altri.map((p) => (
                <Link
                  key={p.slug}
                  to="/collezione/$slug"
                  params={{ slug: p.slug }}
                  className="group border border-border bg-surface"
                >
                  <img
                    src={productImage(p)}
                    alt={`Orologio ${p.name} ${p.subtitle}`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <p className="font-serif text-xl uppercase tracking-[0.25em] text-white">
                      {p.name}
                    </p>
                    <p className="font-serif text-sm italic text-primary">{p.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
