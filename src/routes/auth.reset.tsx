import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/reset")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nuova Password | Contro il Tempo" },
      { name: "description", content: "Imposta una nuova password per l'area riservata Contro il Tempo." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Nuova Password | Contro il Tempo" },
      { property: "og:description", content: "Imposta una nuova password per l'area riservata Contro il Tempo." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [attesa, setAttesa] = useState(false);

  const invia = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    setAttesa(true);
    const { error } = await supabase.auth.updateUser({ password });
    setAttesa(false);
    if (error) {
      setErrore(error.message);
      return;
    }
    navigate({ to: "/admin", replace: true });
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pb-24 pt-36">
      <form onSubmit={invia} className="w-full max-w-[420px] border border-border bg-surface p-8 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Area Riservata</p>
        <h1 className="mt-4 font-serif text-3xl font-light uppercase tracking-[0.2em] text-white">
          Nuova password
        </h1>
        <label htmlFor="nuova" className="mb-2 mt-8 block text-[11px] uppercase tracking-[0.2em] text-subtle">
          Password
        </label>
        <input
          id="nuova"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
        />
        {errore && <p className="mt-4 text-sm text-red-400">{errore}</p>}
        <button
          type="submit"
          disabled={attesa}
          className="mt-6 w-full bg-primary px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140] disabled:opacity-40"
        >
          {attesa ? "Attendere…" : "Salva password"}
        </button>
      </form>
    </section>
  );
}
