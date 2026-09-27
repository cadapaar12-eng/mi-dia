import { useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import {
  DEFAULT_REMINDER_TIME,
  SUGGESTED_MEDS,
  TIME_HINTS,
  TIME_LABELS,
  TIME_ORDER,
} from "@/lib/copy";
import { lastSevenKeys, relativeDayLabel } from "@/lib/dates";
import { emptyDay, useJournal, type Medicine, type TimeOfDay } from "@/lib/store";
import { effectiveReminderTime, notificationsSupported } from "@/lib/use-medicine-reminders";

type Draft = {
  id?: string;
  name: string;
  timeOfDay: TimeOfDay;
  reminderTime: string;
};

const EMPTY_DRAFT: Draft = { name: "", timeOfDay: "manana", reminderTime: DEFAULT_REMINDER_TIME.manana };

export function MedsPage() {
  const name = useJournal((state) => state.name);
  const setName = useJournal((state) => state.setName);
  const medicines = useJournal((state) => state.medicines);
  const addMedicine = useJournal((state) => state.addMedicine);
  const updateMedicine = useJournal((state) => state.updateMedicine);
  const removeMedicine = useJournal((state) => state.removeMedicine);
  const days = useJournal((state) => state.days);
  const remindersEnabled = useJournal((state) => state.remindersEnabled);
  const setRemindersEnabled = useJournal((state) => state.setRemindersEnabled);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState(name);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "unsupported">(
    () => (notificationsSupported() ? Notification.permission : "unsupported"),
  );

  function saveDraft() {
    if (!draft || !draft.name.trim()) return;
    if (draft.id) {
      updateMedicine(draft.id, {
        name: draft.name,
        timeOfDay: draft.timeOfDay,
        reminderTime: draft.reminderTime,
      });
    } else {
      addMedicine({ name: draft.name, timeOfDay: draft.timeOfDay, reminderTime: draft.reminderTime });
    }
    setDraft(null);
  }

  function startEdit(medicine: Medicine) {
    setPendingDelete(null);
    setDraft({
      id: medicine.id,
      name: medicine.name,
      timeOfDay: medicine.timeOfDay,
      reminderTime: effectiveReminderTime(medicine),
    });
  }

  function changeTimeOfDay(time: TimeOfDay) {
    if (!draft) return;
    const wasDefault = draft.reminderTime === DEFAULT_REMINDER_TIME[draft.timeOfDay];
    setDraft({
      ...draft,
      timeOfDay: time,
      reminderTime: wasDefault ? DEFAULT_REMINDER_TIME[time] : draft.reminderTime,
    });
  }

  async function handleEnableReminders() {
    if (!notificationsSupported()) return;
    if (Notification.permission === "granted") {
      setRemindersEnabled(true);
      return;
    }
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") setRemindersEnabled(true);
  }

  const unusedSuggestions = SUGGESTED_MEDS.filter(
    (item) => !medicines.some((medicine) => medicine.name.toLowerCase() === item.name.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-5">
      <header>
        <Wordmark size="sm" />
        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight">Medicinas</h1>
      </header>

      <section className="rounded-xl bg-surface p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Tus tomas</h2>
          <span className="text-base tabular-nums text-muted">{medicines.length}</span>
        </div>

        {draft ? (
          <div className="mb-5 rounded-lg bg-surface-2 p-4">
            <p className="mb-3 text-lg font-semibold">
              {draft.id ? "Cambiar medicina" : "Nueva medicina"}
            </p>
            <label className="text-base font-semibold" htmlFor="med-name">
              Nombre
            </label>
            <input
              id="med-name"
              className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-4 text-lg"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="Por ejemplo: Para la presión"
              autoCapitalize="sentences"
            />
            <p className="mb-2 mt-4 text-base font-semibold">¿Cuándo se toma?</p>
            <div className="grid gap-2">
              {TIME_ORDER.map((time) => (
                <button
                  key={time}
                  type="button"
                  aria-pressed={draft.timeOfDay === time}
                  onClick={() => changeTimeOfDay(time)}
                  className={
                    "flex min-h-16 flex-col items-start justify-center rounded-md px-4 text-left transition-[transform,background-color] duration-150 ease-out active:scale-[0.96] " +
                    (draft.timeOfDay === time ? "bg-primary text-primary-fg" : "bg-surface text-fg")
                  }
                >
                  <span className="text-lg font-semibold">{TIME_LABELS[time]}</span>
                  <span
                    className={
                      "text-base " +
                      (draft.timeOfDay === time ? "text-primary-fg/80" : "text-muted")
                    }
                  >
                    {TIME_HINTS[time]}
                  </span>
                </button>
              ))}
            </div>
            <label className="mb-2 mt-4 block text-base font-semibold" htmlFor="med-time">
              Hora del recordatorio
            </label>
            <input
              id="med-time"
              type="time"
              className="min-h-12 w-full rounded-md border border-border bg-surface px-4 text-lg"
              value={draft.reminderTime}
              onChange={(event) => setDraft({ ...draft, reminderTime: event.target.value })}
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="min-h-12 rounded-md bg-surface font-semibold shadow-[0_0_0_1px_var(--color-border)]"
                onClick={() => setDraft(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!draft.name.trim()}
                className="min-h-12 rounded-md bg-primary font-semibold text-primary-fg disabled:opacity-50"
                onClick={saveDraft}
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="mb-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-fg"
            onClick={() => {
              setPendingDelete(null);
              setDraft(EMPTY_DRAFT);
            }}
          >
            ＋ Añadir medicina
          </button>
        )}

        {medicines.length === 0 && !draft ? (
          <p className="break-words text-base text-muted">
            Todavía no hay medicinas. Añade las que tomas cada día, o elige alguna de las
            sugerencias.
          </p>
        ) : (
          <ul className="grid gap-3">
            {medicines.map((medicine) => {
              if (pendingDelete === medicine.id) {
                return (
                  <li key={medicine.id} className="rounded-md bg-warn/10 p-4 text-warn">
                    <p className="break-words text-lg font-semibold">
                      ¿Quitar {medicine.name}?
                    </p>
                    <p className="mt-1 break-words text-base">
                      Dejará de aparecer en el listado de hoy.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="min-h-12 rounded-md bg-surface-2 font-semibold text-fg"
                        onClick={() => setPendingDelete(null)}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        className="min-h-12 rounded-md bg-warn font-semibold text-white"
                        onClick={() => {
                          removeMedicine(medicine.id);
                          setPendingDelete(null);
                        }}
                      >
                        Sí, quitar
                      </button>
                    </div>
                  </li>
                );
              }

              return (
                <li
                  key={medicine.id}
                  className="flex items-center gap-3 rounded-md bg-surface-2 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-lg font-semibold leading-snug">
                      {medicine.name}
                    </p>
                    <p className="break-words text-base text-muted">
                      {TIME_LABELS[medicine.timeOfDay]} · {effectiveReminderTime(medicine)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex size-12 shrink-0 items-center justify-center rounded-sm text-lg text-muted"
                    aria-label={`Cambiar ${medicine.name}`}
                    onClick={() => startEdit(medicine)}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="flex size-12 shrink-0 items-center justify-center rounded-sm text-lg text-warn"
                    aria-label={`Quitar ${medicine.name}`}
                    onClick={() => {
                      setDraft(null);
                      setPendingDelete(medicine.id);
                    }}
                  >
                    🗑
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {unusedSuggestions.length > 0 && !draft ? (
          <div className="mt-6">
            <p className="mb-3 text-base font-semibold text-muted">Sugerencias</p>
            <div className="flex flex-wrap gap-2">
              {unusedSuggestions.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => addMedicine({ name: item.name, timeOfDay: item.timeOfDay })}
                  className="min-h-12 max-w-full rounded-md bg-surface px-4 text-base font-semibold shadow-[0_0_0_1px_var(--color-border)] transition-transform duration-150 active:scale-[0.96]"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl bg-surface p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lg">
            {remindersEnabled ? "🔔" : "🔕"}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-semibold">Recordatorios</h2>
            <p className="break-words text-base text-muted">
              {notifPermission === "unsupported"
                ? "Este navegador no admite avisos."
                : notifPermission === "denied"
                  ? "Bloqueados en el navegador. Actívalos desde los ajustes del sitio."
                  : remindersEnabled
                    ? "Activados: avisan a la hora de cada medicina."
                    : "Un aviso a la hora de cada medicina, mientras la app esté abierta."}
            </p>
          </div>
        </div>
        {notifPermission !== "unsupported" && notifPermission !== "denied" ? (
          <button
            type="button"
            className={
              "mt-4 min-h-12 w-full rounded-md font-semibold " +
              (remindersEnabled ? "bg-surface-2 text-fg" : "bg-primary text-primary-fg")
            }
            onClick={() => (remindersEnabled ? setRemindersEnabled(false) : handleEnableReminders())}
          >
            {remindersEnabled ? "Desactivar" : "Activar recordatorios"}
          </button>
        ) : null}
      </section>

      {medicines.length > 0 ? (
        <section className="rounded-xl bg-surface p-6 shadow-card">
          <h2 className="mb-4 font-display text-xl font-semibold">Historial de tomas</h2>
          <div className="grid gap-4">
            {medicines.map((medicine) => (
              <div key={medicine.id}>
                <p className="mb-2 break-words text-lg font-semibold leading-snug">
                  {medicine.name}
                </p>
                <div className="grid grid-cols-7 gap-1.5">
                  {lastSevenKeys().map((key) => {
                    const entry = days[key] ?? emptyDay(key);
                    const taken = Boolean(entry.taken[medicine.id]);
                    return (
                      <div key={key} className="flex flex-col items-center gap-1">
                        <span
                          className={
                            "flex size-9 items-center justify-center rounded-full text-sm " +
                            (taken ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted")
                          }
                          aria-hidden="true"
                        >
                          {taken ? "✓" : ""}
                        </span>
                        <span className="text-sm text-muted">
                          {relativeDayLabel(key).slice(0, 2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl bg-surface p-6 shadow-card">
        <label className="text-lg font-semibold" htmlFor="display-name">
          Cómo te llamas
        </label>
        <p className="mt-1 break-words text-base text-muted">Sale en el saludo de cada día.</p>
        <div className="mt-4 flex items-center gap-2">
          <input
            id="display-name"
            className="min-w-0 flex-1 rounded-md border border-border bg-surface px-4 py-3 text-lg"
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            placeholder="Tu nombre"
            autoCapitalize="words"
          />
          <button
            type="button"
            className="min-h-12 shrink-0 rounded-md bg-surface-2 px-5 font-semibold text-fg disabled:opacity-50"
            disabled={nameDraft.trim() === name}
            onClick={() => setName(nameDraft)}
          >
            Guardar
          </button>
        </div>
      </section>
    </div>
  );
}
