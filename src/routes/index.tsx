import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { catalogQuery } from "./collezione.index";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  errorComponent: () => (
    <p className="px-6 pt-40 text-center text-sm text-muted-foreground">
      Contenuto momentaneamente non disponibile.
    </p>
  ),
  head: () => ({
    meta: [
      { title: "Contratempo | Alta Orologeria Italiana" },
      {
        name: "description",
        content:
          "Contratempo: orologi d'alta orologeria italiana, quadranti in radica e argento massiccio. Il Tempo Elegante, da Milano.",
      },
      { property: "og:title", content: "Contratempo | Alta Orologeria Italiana" },
      {
        property: "og:description",
        content: "Orologi italiani realizzati a mano. Ogni esemplare è irripetibile.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: catalogo } = useSuspenseQuery(catalogQuery);
  const evidenza = catalogo.filter((p) => p.featured);
  const vetrina = (evidenza.length > 0 ? evidenza : catalogo).slice(0, 3);

  return (
    <>
      <section className="hero-radial flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <p className="mb-10 font-serif text-lg uppercase italic tracking-[0.3em] text-muted-foreground md:text-[22px]">
          Il Tempo Elegante
        </p>
        <h1 className="flex flex-col items-center font-display text-[52px] uppercase leading-[0.9] tracking-[0.15em] text-white md:text-[100px]">
          <span>Contra</span>
          <span className="my-4 block h-px w-16 bg-primary" aria-hidden />
          <span>Tempo</span>
        </h1>
        <Link
          to="/collezione"
          className="mt-14 border border-subtle px-10 py-4 text-[12px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Scopri la Collezione
        </Link>
      </section>

      <section className="border-y border-border bg-surface px-5 py-32 text-center md:py-44">
        <h2 className="mb-10 font-serif text-3xl font-light italic text-white md:text-[42px]">
          Il Tempo Elegante
        </h2>
        <p className="mx-auto max-w-[650px] text-base leading-[2.2] text-muted-foreground">
          Nella vita, gli imprevisti accadono. È il momento in cui il mondo trattiene il respiro.{" "}
          <span className="italic text-primary">Contratempo</span> non è solo un orologio, è la tua
          risposta al destino. Andare contro il tempo, superare l'ostacolo, dettare il proprio
          ritmo. Alta orologeria italiana per chi non aspetta il futuro, ma lo crea.
        </p>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary">La Collezione</p>
          <h2 className="mt-4 font-serif text-3xl font-light uppercase tracking-[0.2em] text-white md:text-5xl">
            Esemplari
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/collezione"
              className="border border-subtle px-10 py-4 text-[12px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Tutta la Collezione
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
