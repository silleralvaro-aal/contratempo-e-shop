import { Link } from "@tanstack/react-router";
import { formatEuro, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="group border border-border bg-surface">
      <Link
        to="/collezione/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-black"
      >
        <img
          src={product.image}
          alt={`Orologio ${product.name} ${product.subtitle}`}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary">{product.eyebrow}</p>
        <Link to="/collezione/$slug" params={{ slug: product.slug }}>
          <h3 className="mt-3 font-serif text-3xl font-light uppercase tracking-[0.3em] text-white">
            {product.name}
          </h3>
          <p className="font-serif text-base italic text-primary">{product.subtitle}</p>
        </Link>
        <p className="mt-4 font-serif text-xl text-white">{formatEuro(product.price)}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => add(product)}
            className="bg-primary px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140]"
          >
            Aggiungi
          </button>
          <Link
            to="/collezione/$slug"
            params={{ slug: product.slug }}
            className="border border-subtle px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Dettagli
          </Link>
        </div>
      </div>
    </article>
  );
}
