import venatura from "@/assets/watch-venatura.jpg";
import notturno from "@/assets/watch-notturno.jpg";
import aurora from "@/assets/watch-aurora.jpg";
import meccanica from "@/assets/watch-meccanica.jpg";

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  eyebrow: string;
  price: number;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "venatura-radica",
    name: "Venatura",
    subtitle: "Radica",
    eyebrow: "Esemplare Unico — Pezzo Unico",
    price: 4200,
    image: venatura,
    description:
      "La perfezione geometrica dell'argento incontra l'imperfezione sublime della natura. Ogni quadrante è intagliato da legno massello. La \u201cRadica\u201d con i suoi nodi naturali rende ogni orologio una creazione irripetibile. Nessuno sarà uguale al tuo.",
    specs: [
      { label: "Cassa (Case)", value: "Argento massiccio 925" },
      { label: "Movimento", value: "ETA Svizzero Automatico" },
      { label: "Quadrante (Dial)", value: "Legno Radica Naturale" },
      { label: "Cinturino", value: "Pelle toscana marrone" },
    ],
  },
  {
    slug: "notturno-ardesia",
    name: "Notturno",
    subtitle: "Ardesia",
    eyebrow: "Edizione Limitata — 50 Esemplari",
    price: 3650,
    image: notturno,
    description:
      "Il silenzio della notte milanese fissato in un quadrante di ardesia levigata a mano. Linee severe, luce discreta: un orologio che non chiede attenzione, la ottiene.",
    specs: [
      { label: "Cassa (Case)", value: "Acciaio spazzolato 316L" },
      { label: "Movimento", value: "Automatico Svizzero 42h" },
      { label: "Quadrante (Dial)", value: "Ardesia naturale" },
      { label: "Cinturino", value: "Alligatore nero" },
    ],
  },
  {
    slug: "aurora-champagne",
    name: "Aurora",
    subtitle: "Champagne",
    eyebrow: "Collezione Permanente",
    price: 5100,
    image: aurora,
    description:
      "Un quadrante guilloché color champagne che cattura la prima luce del mattino. Oro rosa e pelle cognac per chi misura il tempo in momenti, non in ore.",
    specs: [
      { label: "Cassa (Case)", value: "Oro rosa 18kt" },
      { label: "Movimento", value: "Automatico manifattura" },
      { label: "Quadrante (Dial)", value: "Guilloché champagne" },
      { label: "Cinturino", value: "Pelle cognac cucita a mano" },
    ],
  },
  {
    slug: "meccanica-scheletro",
    name: "Meccanica",
    subtitle: "Scheletro",
    eyebrow: "Alta Complicazione",
    price: 7800,
    image: meccanica,
    description:
      "Nulla da nascondere: il movimento è esposto, ogni ruota è visibile. Duecento ore di finitura manuale per mostrare il cuore che batte contro il tempo.",
    specs: [
      { label: "Cassa (Case)", value: "Platino 950" },
      { label: "Movimento", value: "Scheletrato a carica manuale" },
      { label: "Quadrante (Dial)", value: "Aperto, ponti rodiati" },
      { label: "Cinturino", value: "Pelle verde bosco" },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const formatEuro = (value: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
