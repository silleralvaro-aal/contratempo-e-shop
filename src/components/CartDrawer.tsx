import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatEuro } from "@/lib/products";

export function CartDrawer() {
  const { isOpen, close, lines, total, setQuantity, remove, clear } = useCart();
  const [stato, setStato] = useState<"carrello" | "elaborazione" | "confermato">("carrello");

  useEffect(() => {
    if (isOpen) setStato("carrello");
  }, [isOpen]);

  const checkout = () => {
    setStato("elaborazione");
    setTimeout(() => {
      setStato("confermato");
      clear();
    }, 1600);
  };

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-black/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Carrello"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-[420px] flex-col border-l border-border bg-surface transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <h2 className="font-serif text-xl italic text-white">Il Tuo Carrello</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi il carrello"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <X className="h-5 w-5" strokeWidth={1} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {stato === "confermato" ? (
            <div className="mt-16 text-center">
              <p className="font-serif text-2xl italic text-primary">Ordine confermato</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Grazie. Riceverai una conferma via e-mail. Ogni Contratempo viene consegnato a mano
                nel suo astuccio in pelle toscana.
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-subtle">
                Pagamento simulato — nessun addebito
              </p>
            </div>
          ) : lines.length === 0 ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              Il carrello è vuoto.
            </p>
          ) : (
            <ul className="space-y-6">
              {lines.map(({ product, quantity }) => (
                <li key={product.slug} className="flex gap-4 border-b border-border pb-6">
                  <img
                    src={product.image}
                    alt={`${product.name} ${product.subtitle}`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-20 w-20 shrink-0 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-serif text-lg uppercase tracking-[0.2em] text-white">
                      {product.name}
                    </p>
                    <p className="font-serif text-xs italic text-primary">{product.subtitle}</p>
                    <p className="mt-2 text-sm text-foreground">{formatEuro(product.price)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Riduci quantità"
                        onClick={() => setQuantity(product.slug, quantity - 1)}
                        className="border border-border p-1 text-muted-foreground hover:border-primary hover:text-primary"
                      >
                        <Minus className="h-3 w-3" strokeWidth={1.5} />
                      </button>
                      <span className="text-sm text-foreground">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Aumenta quantità"
                        onClick={() => setQuantity(product.slug, quantity + 1)}
                        className="border border-border p-1 text-muted-foreground hover:border-primary hover:text-primary"
                      >
                        <Plus className="h-3 w-3" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        aria-label="Rimuovi dal carrello"
                        onClick={() => remove(product.slug)}
                        className="ml-auto text-subtle transition-colors hover:text-primary"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {stato !== "confermato" && (
          <div className="border-t border-border px-6 py-6">
            <div className="mb-5 flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-subtle">Totale</span>
              <span className="font-serif text-2xl text-white">{formatEuro(total)}</span>
            </div>
            <button
              type="button"
              disabled={lines.length === 0 || stato === "elaborazione"}
              onClick={checkout}
              className="w-full bg-primary px-10 py-4 text-[13px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {stato === "elaborazione" ? "Elaborazione…" : "Checkout"}
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.15em] text-subtle">
              Checkout dimostrativo
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
