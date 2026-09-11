import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manifattura")({
  head: () => ({
    meta: [
      { title: "Manifattura | Contro il Tempo" },
      {
        name: "description",
        content:
          "La manifattura Contro il Tempo a Milano: argento massiccio 925, radica intagliata a mano e movimenti svizzeri automatici.",
      },
      { property: "og:title", content: "Manifattura | Contro il Tempo" },
      {
        property: "og:description",
        content: "Argento, radica e movimenti svizzeri: come nasce un Contro il Tempo.",
      },
    ],
  }),
  component: Manifattura,
});

const fasi = [
  {
    n: "I",
    titolo: "La Materia",
    testo:
      "Selezioniamo lastre di radica stagionate almeno dieci anni. Solo una su venti possiede la venatura che cerchiamo.",
  },
  {
    n: "II",
    titolo: "L'Incisione",
    testo:
      "Il quadrante viene intagliato da legno massello e levigato a mano in ventisei passaggi successivi.",
  },
  {
    n: "III",
    titolo: "Il Movimento",
    testo:
      "Ogni calibro svizzero automatico viene regolato in cinque posizioni prima dell'incassatura.",
  },
  {
    n: "IV",
    titolo: "La Consegna",
    testo:
      "L'orologio viene consegnato a mano nel suo astuccio in pelle toscana, con certificato numerato.",
  },
];

function Manifattura() {
  return (
    <section className="px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
      <div className="mx-auto max-w-[900px]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Via Montenapoleone</p>
        <h1 className="mt-4 font-serif text-4xl font-light uppercase tracking-[0.2em] text-white md:text-6xl">
          Manifattura
        </h1>
        <p className="mt-8 text-base leading-[2.2] text-muted-foreground">
          Quattro artigiani, un laboratorio, meno di duecento orologi all'anno. La nostra misura non
          è la produttività, è la pazienza.
        </p>

        <div className="mt-16 divide-y divide-border border-y border-border">
          {fasi.map((f) => (
            <div key={f.n} className="flex flex-col gap-4 py-10 md:flex-row md:gap-12">
              <span className="font-display text-2xl tracking-[0.2em] text-primary md:w-24">
                {f.n}
              </span>
              <div>
                <h2 className="font-serif text-2xl italic text-white">{f.titolo}</h2>
                <p className="mt-3 text-base leading-[1.9] text-muted-foreground">{f.testo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
