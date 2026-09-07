import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatEuro, getProduct, products } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/collezione/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Esemplare non trovato | Contratempo" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} ${product.subtitle} | Contratempo`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description.slice(0, 155) },
      ],
    };
  },
  component: Dettaglio,
});

function Dettaglio() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const altri = products.filter((p) => p.slug !== product.slug).slice(0, 3);

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
              src={product.image}
              alt={`Orologio ${product.name} ${product.subtitle}`}
              width={1024}
              height={1024}
              className="w-full border border-border object-cover"
            />
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

            <p className="mb-8 font-serif text-3xl text-white">{formatEuro(product.price)}</p>
            <button
              type="button"
              onClick={() => add(product)}
              className="bg-primary px-10 py-4 text-[14px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140]"
            >
              Acquista il Tuo Unico
            </button>
          </div>
        </div>

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
                  src={p.image}
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
      </div>
    </section>
  );
}
