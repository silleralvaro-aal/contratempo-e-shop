import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/", label: "Home" },
  { to: "/manifattura", label: "Manifattura" },
  { to: "/collezione", label: "Collezione" },
  { to: "/contatti", label: "Contatti" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, open: openCart } = useCart();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-5 md:px-12 md:py-6">
        <Link
          to="/"
          className="flex items-center font-display text-2xl tracking-[0.25em] text-white"
          onClick={() => setOpen(false)}
        >
          C<span className="mx-2 font-light text-primary">|</span>T
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-10">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={openCart}
            aria-label="Apri il carrello"
            className="relative text-muted-foreground transition-colors hover:text-primary"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-primary text-[10px] text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-primary md:hidden"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <ul className="flex flex-col px-6 py-4">
            {links.map((l) => (
              <li key={l.to} className="border-b border-border last:border-b-0">
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-[12px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
