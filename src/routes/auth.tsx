import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Accesso Riservato | Contro il Tempo" },
      { name: "description", content: "Area riservata alla manifattura Contro il Tempo." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Accesso Riservato | Contro il Tempo" },
      { property: "og:description", content: "Area riservata alla manifattura Contro il Tempo." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"accedi" | "registrati">("accedi");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [avviso, setAvviso] = useState<string | null>(null);
  const [attesa, setAttesa] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const invia = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    setAvviso(null);
    setAttesa(true);
    try {
      if (modo === "accedi") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin", replace: true });
        else setAvviso("Controlla la tua e-mail per confermare l'account.");
      }
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setAttesa(false);
    }
  };

  const googleDisponibile =
    typeof window !== "undefined" &&
    (window.location.hostname.endsWith("lovable.app") ||
      window.location.hostname.endsWith("lovableproject.com") ||
      window.location.hostname === "localhost");

  const recupera = async () => {
    setErrore(null);
    setAvviso(null);
    if (!email) {
      setErrore("Inserisci prima la tua e-mail.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (error) {
      setErrore(error.message);
      return;
    }
    setAvviso("Ti abbiamo inviato un'e-mail per impostare la password.");
  };

  const google = async () => {

    setErrore(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setErrore("Accesso con Google non riuscito.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pb-24 pt-36">
      <div className="w-full max-w-[420px] border border-border bg-surface p-8 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Area Riservata</p>
        <h1 className="mt-4 font-serif text-3xl font-light uppercase tracking-[0.2em] text-white">
          {modo === "accedi" ? "Accedi" : "Registrati"}
        </h1>

        <form onSubmit={invia} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-subtle">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-subtle">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {errore && <p className="text-sm text-red-400">{errore}</p>}
          {avviso && <p className="text-sm text-primary">{avviso}</p>}

          <button
            type="submit"
            disabled={attesa}
            className="w-full bg-primary px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-[#8a6140] disabled:opacity-40"
          >
            {attesa ? "Attendere…" : modo === "accedi" ? "Accedi" : "Crea account"}
          </button>
        </form>

        <button
          type="button"
          onClick={recupera}
          className="mt-4 w-full text-center text-[11px] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-primary"
        >
          Password dimenticata?
        </button>

        {googleDisponibile && (
          <>
            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-subtle">oppure</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={google}
              className="w-full border border-subtle px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Continua con Google
            </button>
          </>
        )}


        <button
          type="button"
          onClick={() => setModo(modo === "accedi" ? "registrati" : "accedi")}
          className="mt-6 w-full text-center text-[11px] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-primary"
        >
          {modo === "accedi" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </button>
      </div>
    </section>
  );
}
