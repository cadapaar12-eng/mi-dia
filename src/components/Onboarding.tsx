import { useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { useJournal } from "@/lib/store";

export function Onboarding() {
  const completeOnboarding = useJournal((state) => state.completeOnboarding);
  const [name, setName] = useState("");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-6 px-6 py-10">
      <Wordmark />
      <div>
        <h1 className="font-display text-3xl font-semibold leading-tight">
          Una libreta sencilla
          <br />
          para cada día.
        </h1>
        <p className="mt-4 text-lg leading-snug text-muted">
          Aquí puedes apuntar las medicinas, cómo te sientes, cómo dormiste y si comiste bien.
        </p>
      </div>
      <div>
        <label className="text-lg font-semibold" htmlFor="onboarding-name">
          ¿Cómo te llamas?
        </label>
        <input
          id="onboarding-name"
          className="mt-2 min-h-14 w-full rounded-md border border-border bg-surface px-4 text-lg text-fg"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tu nombre"
          autoCapitalize="words"
        />
        <p className="mt-2 break-words text-base text-muted">
          Si prefieres, puedes dejarlo en blanco.
        </p>
      </div>
      <button
        type="button"
        className="min-h-14 rounded-md bg-primary text-lg font-bold text-primary-fg transition-transform duration-150 ease-out active:scale-[0.98]"
        onClick={() => completeOnboarding(name)}
      >
        Continuar
      </button>
    </div>
  );
}
