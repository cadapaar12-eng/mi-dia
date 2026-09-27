import type { Mood, TimeOfDay } from "@/lib/store";

export const TIME_ORDER: TimeOfDay[] = ["manana", "tarde", "noche"];

export const TIME_LABELS: Record<TimeOfDay, string> = {
  manana: "Mañana",
  tarde: "Tarde",
  noche: "Noche",
};

export const TIME_HINTS: Record<TimeOfDay, string> = {
  manana: "Al despertar",
  tarde: "Después de comer",
  noche: "Antes de dormir",
};

/** Hora por defecto del recordatorio para cada momento del día (HH:mm, 24h). */
export const DEFAULT_REMINDER_TIME: Record<TimeOfDay, string> = {
  manana: "08:00",
  tarde: "15:00",
  noche: "21:00",
};

export const MEAL_ITEMS = [
  { key: "desayuno", title: "Desayuno" },
  { key: "almuerzo", title: "Almuerzo" },
  { key: "cena", title: "Cena" },
  { key: "merienda", title: "Merienda" },
] as const;

export const SLEEP_HOURS = [
  { hours: 5, title: "Poco", subtitle: "Menos de 6 horas" },
  { hours: 7, title: "Normal", subtitle: "6 a 7 horas" },
  { hours: 8, title: "Bien", subtitle: "8 a 9 horas" },
  { hours: 10, title: "Mucho", subtitle: "10 horas o más" },
] as const;

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 1, label: "Muy mal", emoji: "😠" },
  { value: 2, label: "Mal", emoji: "🙁" },
  { value: 3, label: "Regular", emoji: "😐" },
  { value: 4, label: "Bien", emoji: "🙂" },
  { value: 5, label: "Muy bien", emoji: "😄" },
];

export const SUGGESTED_MEDS: { name: string; timeOfDay: TimeOfDay }[] = [
  { name: "Para la presión", timeOfDay: "manana" },
  { name: "Para el azúcar", timeOfDay: "manana" },
  { name: "Vitamina", timeOfDay: "manana" },
  { name: "Para el corazón", timeOfDay: "manana" },
  { name: "Para el dolor", timeOfDay: "tarde" },
  { name: "Para dormir", timeOfDay: "noche" },
];

export function sleepHoursLabel(hours: number | null): string {
  const match = SLEEP_HOURS.find((item) => item.hours === hours);
  if (!match) return "Sin registrar";
  return `${match.title} · ${match.subtitle}`;
}

export function moodLabel(value: Mood | null): string {
  return MOODS.find((mood) => mood.value === value)?.label ?? "Sin registrar";
}

export function moodEmoji(value: Mood | null): string {
  return MOODS.find((mood) => mood.value === value)?.emoji ?? "—";
}
