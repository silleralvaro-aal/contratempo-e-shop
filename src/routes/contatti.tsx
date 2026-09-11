import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti | Contro il Tempo" },
      {
        name: "description",
        content:
          "Contatta l'atelier Contro il Tempo in Via Montenapoleone a Milano per una visita privata o una commissione su misura.",
      },
      { property: "og:title", content: "Contatti | Contro il Tempo" },
      {
        property: "og:description",
        content: "Atelier su appuntamento a Milano, Via Montenapoleone.",
      },
    ],
  }),
  component: Contatti,
});

function Contatti() {
  const [inviato, setInviato] = useState(false);

  return (
    <section className="px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
      <div className="mx-auto grid max-w-[1000px] gap-16 lg:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Atelier</p>
          <h1 className="mt-4 font-serif text-4xl font-light uppercase tracking-[0.2em] text-white md:text-5xl">
            Contatti
          </h1>
          <dl className="mt-10 space-y-6 text-sm leading-relaxed">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-subtle">Indirizzo</dt>
              <dd className="mt-1 text-foreground">Via Montenapoleone 12, 20121 Milano, Italia</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-subtle">Telefono</dt>
              <dd className="mt-1 text-foreground">+39 02 0000 0000</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-subtle">E-mail</dt>
              <dd className="mt-1 text-foreground">atelier@controiltempo.it</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-subtle">Orari</dt>
              <dd className="mt-1 text-foreground">Lunedì — Sabato, 10:00 — 19:00 (su appuntamento)</dd>
            </div>
          </dl>
          <p className="mt-8 text-[11px] uppercase tracking-[0.15em] text-subtle">
            Recapiti dimostrativi — inviaci quelli reali per sostituirli
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setInviato(true);
          }}
          className="border border-border bg-surface p-8"
        >
          <h2 className="font-serif text-2xl italic text-white">Richiedi una visita privata</h2>
          {inviato ? (
            <p className="mt-8 text-sm leading-relaxed text-primary">
              Grazie. Ti risponderemo entro due giorni lavorativi.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-subtle">Nome</span>
                <input
                  required
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-subtle">E-mail</span>
                <input
                  required
                  type="email"
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-subtle">Messaggio</span>
                <textarea
                  required
                  rows={4}
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-primary px-10 py-4 text-[13px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140]"
              >
                Invia
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
