import { useEffect } from "react";
import { DEFAULT_REMINDER_TIME } from "@/lib/copy";
import { nowHHmm, todayKey } from "@/lib/dates";
import { emptyDay, useJournal, type Medicine } from "@/lib/store";

export function effectiveReminderTime(medicine: Medicine): string {
  return medicine.reminderTime ?? DEFAULT_REMINDER_TIME[medicine.timeOfDay];
}

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Recordatorios locales, sin servidor: mientras la app esté abierta (o
 * recién en segundo plano), revisa cada 30s si alguna medicina ya pasó su
 * hora y no se ha marcado como tomada, y muestra una notificación del
 * navegador una sola vez por día y por medicina.
 *
 * Limitación honesta: si el sistema cierra del todo la app (no solo la
 * manda a segundo plano), este aviso no llega. Para recordatorios
 * garantizados con la app cerrada haría falta un servidor de notificaciones
 * push (Web Push).
 */
export function useMedicineReminders() {
  const remindersEnabled = useJournal((state) => state.remindersEnabled);
  const medicines = useJournal((state) => state.medicines);
  const markNotified = useJournal((state) => state.markNotified);

  useEffect(() => {
    if (!remindersEnabled || !notificationsSupported()) return;
    if (Notification.permission !== "granted") return;

    const check = () => {
      const state = useJournal.getState();
      const today = state.days[todayKey()] ?? emptyDay(todayKey());
      const currentTime = nowHHmm();

      for (const medicine of medicines) {
        const due = effectiveReminderTime(medicine);
        const alreadyTaken = Boolean(today.taken[medicine.id]);
        const alreadyNotified = today.notified.includes(medicine.id);
        if (alreadyTaken || alreadyNotified) continue;
        if (currentTime < due) continue;

        try {
          new Notification("Hora de tu medicina", {
            body: medicine.name,
            tag: `med-${medicine.id}-${todayKey()}`,
          });
        } catch {
          continue;
        }
        markNotified(medicine.id);
      }
    };

    check();
    const interval = window.setInterval(check, 30_000);
    return () => window.clearInterval(interval);
  }, [remindersEnabled, medicines, markNotified]);
}
