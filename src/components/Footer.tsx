import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const [connesso, setConnesso] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setConnesso(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setConnesso(Boolean(session)),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <footer className="border-t border-border px-5 py-16 text-center text-[11px] tracking-[0.2em] text-subtle">
      <p>
        © {new Date().getFullYear()} CONTRATEMPO S.r.l. — Via Montenapoleone, Milano, Italia. P.IVA:
        01234567890
      </p>
      <Link
        to={connesso ? "/admin" : "/auth"}
        className="mt-6 inline-block uppercase tracking-[0.25em] transition-colors hover:text-primary"
      >
        {connesso ? "Amministrazione" : "Area riservata"}
      </Link>
    </footer>
  );
}
