import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayKey } from "@/lib/dates";

export type TimeOfDay = "manana" | "tarde" | "noche";

export type Medicine = {
  id: string;
  name: string;
  timeOfDay: TimeOfDay;
  /** Hora del recordatorio, "HH:mm". Si falta, se usa el valor por defecto
   * del momento del día (ver DEFAULT_REMINDER_TIME en lib/copy.ts). */
  reminderTime?: string;
};

export type Mood = 1 | 2 | 3 | 4 | 5;

export type Meals = {
  desayuno: boolean;
  almuerzo: boolean;
  cena: boolean;
  merienda: boolean;
};

export type DayEntry = {
  date: string;
  taken: Record<string, boolean>;
  mood: Mood | null;
  sleepHours: number | null;
  sleepQuality: Mood | null;
  meals: Meals;
  /** IDs de medicinas ya avisadas hoy, para no repetir la notificación. */
  notified: string[];
};

type JournalState = {
  name: string;
  onboardingDone: boolean;
  medicines: Medicine[];
  days: Record<string, DayEntry>;
  remindersEnabled: boolean;
};

type JournalActions = {
  completeOnboarding: (name: string) => void;
  setName: (name: string) => void;
  addMedicine: (input: { name: string; timeOfDay: TimeOfDay; reminderTime?: string }) => void;
  updateMedicine: (
    id: string,
    input: { name: string; timeOfDay: TimeOfDay; reminderTime?: string },
  ) => void;
  removeMedicine: (id: string) => void;
  toggleTaken: (medicineId: string) => void;
  setMood: (mood: Mood) => void;
  setSleepHours: (hours: number) => void;
  setSleepQuality: (quality: Mood) => void;
  toggleMeal: (meal: keyof Meals) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  markNotified: (medicineId: string) => void;
};

export type JournalStore = JournalState & JournalActions;

function emptyMeals(): Meals {
  return { desayuno: false, almuerzo: false, cena: false, merienda: false };
}

export function emptyDay(date: string): DayEntry {
  return {
    date,
    taken: {},
    mood: null,
    sleepHours: null,
    sleepQuality: null,
    meals: emptyMeals(),
    notified: [],
  };
}

function patchToday(
  days: Record<string, DayEntry>,
  updater: (entry: DayEntry) => DayEntry,
): Record<string, DayEntry> {
  const key = todayKey();
  const current = days[key] ?? emptyDay(key);
  return { ...days, [key]: updater(current) };
}

function newId(): string {
  return crypto.randomUUID();
}

const initialState: JournalState = {
  name: "",
  onboardingDone: false,
  medicines: [],
  days: {},
  remindersEnabled: false,
};

export const useJournal = create<JournalStore>()(
  persist(
    (set) => ({
      ...initialState,
      completeOnboarding: (name) => set({ name: name.trim(), onboardingDone: true }),
      setName: (name) => set({ name: name.trim() }),
      addMedicine: ({ name, timeOfDay, reminderTime }) =>
        set((state) => ({
          medicines: [
            ...state.medicines,
            { id: newId(), name: name.trim(), timeOfDay, reminderTime },
          ],
        })),
      updateMedicine: (id, { name, timeOfDay, reminderTime }) =>
        set((state) => ({
          medicines: state.medicines.map((medicine) =>
            medicine.id === id
              ? { ...medicine, name: name.trim(), timeOfDay, reminderTime }
              : medicine,
          ),
        })),
      removeMedicine: (id) =>
        set((state) => ({
          medicines: state.medicines.filter((medicine) => medicine.id !== id),
        })),
      toggleTaken: (medicineId) =>
        set((state) => ({
          days: patchToday(state.days, (entry) => ({
            ...entry,
            taken: { ...entry.taken, [medicineId]: !entry.taken[medicineId] },
          })),
        })),
      setMood: (mood) =>
        set((state) => ({
          days: patchToday(state.days, (entry) => ({ ...entry, mood })),
        })),
      setSleepHours: (hours) =>
        set((state) => ({
          days: patchToday(state.days, (entry) => ({ ...entry, sleepHours: hours })),
        })),
      setSleepQuality: (quality) =>
        set((state) => ({
          days: patchToday(state.days, (entry) => ({ ...entry, sleepQuality: quality })),
        })),
      toggleMeal: (meal) =>
        set((state) => ({
          days: patchToday(state.days, (entry) => ({
            ...entry,
            meals: { ...entry.meals, [meal]: !entry.meals[meal] },
          })),
        })),
      setRemindersEnabled: (enabled) => set({ remindersEnabled: enabled }),
      markNotified: (medicineId) =>
        set((state) => ({
          days: patchToday(state.days, (entry) => ({
            ...entry,
            notified: entry.notified.includes(medicineId)
              ? entry.notified
              : [...entry.notified, medicineId],
          })),
        })),
    }),
    { name: "mi-dia-v1", version: 1 },
  ),
);
