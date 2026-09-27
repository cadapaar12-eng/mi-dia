import { Wordmark } from "@/components/Wordmark";
import { moodLabel, sleepHoursLabel } from "@/lib/copy";
import { formatShortDay, lastSevenKeys, relativeDayLabel } from "@/lib/dates";
import { dayProgress } from "@/lib/progress";
import { emptyDay, useJournal, type Mood } from "@/lib/store";

const MARKS = [
  { key: "meds", label: "Tomas", icon: "💊" },
  { key: "mood", label: "Ánimo", icon: "🙂" },
  { key: "sleep", label: "Sueño", icon: "🌙" },
  { key: "meals", label: "Comida", icon: "🍽" },
] as const;

export function WeekPage() {
  const medicines = useJournal((state) => state.medicines);
  const days = useJournal((state) => state.days);
  const keys = lastSevenKeys();
  const entries = keys.map((key) => days[key] ?? emptyDay(key));
  const summaries = entries.map((entry) => dayProgress(entry, medicines));
  const medsDays = summaries.filter((item) => item.medsDone && medicines.length > 0).length;
  const moodValues = entries
    .map((entry) => entry.mood)
    .filter((value): value is Mood => value != null);
  const moodAvg =
    moodValues.length > 0
      ? moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length
      : null;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <Wordmark size="sm" />
        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight">Esta semana</h1>
        <p className="mt-2 break-words text-lg text-muted">
          Un resumen de los últimos siete días, para ti o para quien te cuida.
        </p>
      </header>

      <section className="rounded-xl bg-surface p-6 shadow-card">
        {medicines.length > 0 ? (
          <p className="break-words text-lg leading-snug">
            Medicinas completas en{" "}
            <span className="font-semibold tabular-nums">{medsDays} de 7</span> días.
          </p>
        ) : (
          <p className="break-words text-lg leading-snug text-muted">
            Cuando añadas medicinas, aquí verás si se tomaron cada día.
          </p>
        )}
        {moodAvg != null ? (
          <p className="mt-3 break-words text-lg leading-snug">
            Ánimo medio:{" "}
            <span className="font-semibold">{moodLabel(Math.round(moodAvg) as Mood)}</span>
          </p>
        ) : (
          <p className="mt-3 break-words text-lg leading-snug text-muted">
            Aún no hay ánimo registrado esta semana.
          </p>
        )}
      </section>

      <ol className="grid gap-3">
        {[...keys].reverse().map((key) => {
          const entry = days[key] ?? emptyDay(key);
          const progress = dayProgress(entry, medicines);
          return (
            <li key={key} className="rounded-xl bg-surface p-5 shadow-card">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl font-semibold">
                  {relativeDayLabel(key)}
                </h2>
                <p className="shrink-0 text-base text-muted">{formatShortDay(key)}</p>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {MARKS.map((mark) => {
                  const done =
                    mark.key === "meds"
                      ? progress.medsDone
                      : mark.key === "mood"
                        ? progress.moodDone
                        : mark.key === "sleep"
                          ? progress.sleepDone
                          : progress.mealsDone;
                  return (
                    <div
                      key={mark.key}
                      className={
                        "flex min-h-16 flex-col items-center justify-center gap-1 rounded-md " +
                        (done ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted")
                      }
                    >
                      <span className="text-lg" aria-hidden="true">
                        {mark.icon}
                      </span>
                      <span className="text-sm font-semibold">{mark.label}</span>
                    </div>
                  );
                })}
              </div>
              <dl className="mt-4 grid gap-1 text-base text-muted">
                <div className="flex justify-between gap-3">
                  <dt>Ánimo</dt>
                  <dd className="break-words text-right font-semibold text-fg">
                    {moodLabel(entry.mood)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Sueño</dt>
                  <dd className="break-words text-right font-semibold text-fg">
                    {sleepHoursLabel(entry.sleepHours)}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
