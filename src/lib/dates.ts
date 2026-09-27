const WEEKDAYS_FULL = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const WEEKDAYS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function todayKey(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function parseLocalDate(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatLongDate(date: Date): string {
  return capitalize(
    `${WEEKDAYS_FULL[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`,
  );
}

export function formatShortDay(key: string): string {
  const date = parseLocalDate(key);
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

export function greetingWord(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function lastSevenKeys(now: Date = new Date()): string[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index - 6);
    return todayKey(date);
  });
}

export function relativeDayLabel(key: string, now: Date = new Date()): string {
  const today = todayKey(now);
  if (key === today) return "Hoy";
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (key === todayKey(yesterday)) return "Ayer";
  return capitalize(WEEKDAYS_FULL[parseLocalDate(key).getDay()]);
}

export function shortWeekdayLabel(key: string): string {
  return WEEKDAYS_SHORT[parseLocalDate(key).getDay()];
}

export function nowHHmm(now: Date = new Date()): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
