import type { Tab } from "@/components/AppShell";
import { ChoiceButton } from "@/components/ChoiceButton";
import { MoodPicker } from "@/components/MoodPicker";
import { SectionCard } from "@/components/SectionCard";
import { Wordmark } from "@/components/Wordmark";
import {
  MEAL_ITEMS,
  SLEEP_HOURS,
  TIME_HINTS,
  TIME_LABELS,
  TIME_ORDER,
  moodLabel,
  sleepHoursLabel,
} from "@/lib/copy";
import { formatLongDate, greetingWord, todayKey } from "@/lib/dates";
import { dayProgress } from "@/lib/progress";
import { effectiveReminderTime } from "@/lib/use-medicine-reminders";
import { emptyDay, useJournal } from "@/lib/store";

export function TodayPage({ onGoTo }: { onGoTo: (tab: Tab) => void }) {
  const name = useJournal((state) => state.name);
  const medicines = useJournal((state) => state.medicines);
  const storedToday = useJournal((state) => state.days[todayKey()]);
  const today = storedToday ?? emptyDay(todayKey());
  const toggleTaken = useJournal((state) => state.toggleTaken);
  const setMood = useJournal((state) => state.setMood);
  const setSleepHours = useJournal((state) => state.setSleepHours);
  const setSleepQuality = useJournal((state) => state.setSleepQuality);
  const toggleMeal = useJournal((state) => state.toggleMeal);
  const progress = dayProgress(today, medicines);
  const hello = greetingWord();

  return (
    <div className="flex flex-col gap-5">
      <header>
        <Wordmark size="sm" />
        <p className="mt-6 break-words font-display text-3xl font-semibold leading-tight">
          {name ? (
            <>
              {hello},
              <br />
              {name}
            </>
          ) : (
            hello
          )}
        </p>
        <p className="mt-2 text-lg text-muted">{formatLongDate(new Date())}</p>
      </header>

      <div className="rounded-xl bg-surface px-5 py-4 shadow-card">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="font-semibold">El día de hoy</p>
          <p className="tabular-nums text-muted">
            {progress.done} de {progress.total}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2" aria-hidden="true">
          {[progress.medsDone, progress.moodDone, progress.sleepDone, progress.mealsDone].map(
            (done, index) => (
              <span
                key={index}
                className={"h-3 rounded-full " + (done ? "bg-primary" : "bg-surface-2")}
              />
            ),
          )}
        </div>
        {progress.complete ? (
          <p className="mt-3 text-base font-semibold text-primary">
            Hoy está completo. Lo has hecho muy bien.
          </p>
        ) : (
          <p className="mt-3 text-base text-muted">
            Completa cada apartado cuando puedas. No hay prisa.
          </p>
        )}
      </div>

      <SectionCard
        icon="💊"
        title="Medicinas"
        done={progress.medsDone}
        summary={
          medicines.length === 0
            ? "Aún no hay ninguna apuntada"
            : `${progress.takenCount} de ${medicines.length} tomadas`
        }
      >
        {medicines.length === 0 ? (
          <button
            type="button"
            className="min-h-14 w-full rounded-md bg-surface-2 text-lg font-semibold"
            onClick={() => onGoTo("medicinas")}
          >
            Añadir medicinas
          </button>
        ) : (
          <div className="grid gap-5">
            {TIME_ORDER.map((time) => {
              const group = medicines.filter((medicine) => medicine.timeOfDay === time);
              if (group.length === 0) return null;
              return (
                <div key={time}>
                  <p className="mb-2 text-base font-semibold text-muted">{TIME_LABELS[time]}</p>
                  <div className="grid gap-2">
                    {group.map((medicine) => {
                      const taken = Boolean(today.taken[medicine.id]);
                      return (
                        <button
                          key={medicine.id}
                          type="button"
                          aria-pressed={taken}
                          onClick={() => toggleTaken(medicine.id)}
                          className={
                            "flex min-h-20 items-center gap-4 rounded-md px-4 text-left transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.96] " +
                            (taken ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg")
                          }
                        >
                          <span
                            className={
                              "flex size-8 shrink-0 items-center justify-center rounded-sm border-2 " +
                              (taken ? "border-primary-fg bg-primary-fg text-primary" : "border-muted")
                            }
                            aria-hidden="true"
                          >
                            {taken ? "✓" : ""}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block break-words text-lg font-semibold leading-snug">
                              {medicine.name}
                            </span>
                            <span
                              className={
                                "block break-words text-base " +
                                (taken ? "text-primary-fg/80" : "text-muted")
                              }
                            >
                              {TIME_HINTS[time]} · {effectiveReminderTime(medicine)}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        icon="🙂"
        title="Ánimo"
        done={progress.moodDone}
        summary={progress.moodDone ? moodLabel(today.mood) : "¿Cómo te sientes hoy?"}
      >
        <MoodPicker name="Ánimo de hoy" value={today.mood} onChange={setMood} />
      </SectionCard>

      <SectionCard
        icon="🌙"
        title="Sueño"
        done={progress.sleepDone}
        summary={
          today.sleepHours == null ? "¿Cómo dormiste anoche?" : sleepHoursLabel(today.sleepHours)
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {SLEEP_HOURS.map((item) => (
            <ChoiceButton
              key={item.hours}
              selected={today.sleepHours === item.hours}
              title={item.title}
              subtitle={item.subtitle}
              onClick={() => setSleepHours(item.hours)}
            />
          ))}
        </div>
        <p className="mb-3 mt-6 text-base font-semibold text-muted">Calidad del sueño</p>
        <MoodPicker
          name="Calidad del sueño"
          layout="compact"
          value={today.sleepQuality}
          onChange={setSleepQuality}
        />
      </SectionCard>

      <SectionCard
        icon="🍽"
        title="Comidas"
        done={progress.mealsDone}
        summary={`${progress.mealCount} de 4 apuntadas`}
      >
        <div className="grid grid-cols-2 gap-2">
          {MEAL_ITEMS.map((meal) => (
            <ChoiceButton
              key={meal.key}
              selected={today.meals[meal.key]}
              title={meal.title}
              onClick={() => toggleMeal(meal.key)}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
