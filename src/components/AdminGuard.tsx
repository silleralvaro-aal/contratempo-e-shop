import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminExists, claimAdmin, isAdmin } from "@/lib/admin";

export function AdminGuard({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [errore, setErrore] = useState<string | null>(null);

  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-access"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return { admin: false, esisteAdmin: true, email: "" };
      const [admin, esisteAdmin] = await Promise.all([isAdmin(user.id), adminExists()]);
      return { admin, esisteAdmin, email: user.email ?? "" };
    },
    retry: 2,
    retryDelay: (attempt) => 1_000 * (attempt + 1),
  });

  if (isPending) {
    return (
      <p className="px-6 pt-40 text-center text-[11px] uppercase tracking-[0.25em] text-subtle">
        Verifica in corso…
      </p>
    );
  }

  if (data?.admin) return <>{children}</>;

  if (isError) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pb-24 pt-36">
        <div className="w-full max-w-[460px] border border-border bg-surface p-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Connessione interrotta</p>
          <h1 className="mt-4 font-serif text-3xl font-light uppercase tracking-[0.2em] text-white">
            Area Amministrazione
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Non è stato possibile verificare i permessi. La sessione è ancora attiva.
          </p>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="mt-8 w-full bg-primary px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-40"
          >
            {isFetching ? "Verifica in corso…" : "Riprova"}
          </button>
        </div>
      </section>
    );
  }

  const rivendica = async () => {
    setErrore(null);
    try {
      const ok = await claimAdmin();
      if (!ok) setErrore("Un amministratore è già stato designato.");
      await queryClient.invalidateQueries({ queryKey: ["admin-access"] });
    } catch (e) {
      setErrore(e instanceof Error ? e.message : "Errore imprevisto.");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pb-24 pt-36">
      <div className="w-full max-w-[460px] border border-border bg-surface p-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Accesso Negato</p>
        <h1 className="mt-4 font-serif text-3xl font-light uppercase tracking-[0.2em] text-white">
          Area Amministrazione
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          L'account {data?.email} non dispone dei permessi di amministratore.
        </p>

        {data && !data.esisteAdmin && (
          <button
            type="button"
            onClick={rivendica}
            className="mt-8 w-full bg-primary px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140]"
          >
            Diventa amministratore
          </button>
        )}

        {errore && <p className="mt-4 text-sm text-red-400">{errore}</p>}

        <Link
          to="/"
          className="mt-6 block text-[11px] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-primary"
        >
          Torna al sito
        </Link>
      </div>
    </section>
  );
}
