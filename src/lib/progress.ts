import type { DayEntry, Medicine } from "@/lib/store";

export type DayProgress = {
  medsDone: boolean;
  moodDone: boolean;
  sleepDone: boolean;
  mealsDone: boolean;
  takenCount: number;
  mealCount: number;
  done: number;
  total: 4;
  complete: boolean;
};

export function dayProgress(entry: DayEntry, medicines: Medicine[]): DayProgress {
  const takenCount = medicines.filter((medicine) => entry.taken[medicine.id]).length;
  const medsDone = medicines.length === 0 || takenCount === medicines.length;
  const moodDone = entry.mood != null;
  const sleepDone = entry.sleepHours != null && entry.sleepQuality != null;
  const mealCount = Object.values(entry.meals).filter(Boolean).length;
  const mealsDone = mealCount >= 2;
  const flags = [medsDone, moodDone, sleepDone, mealsDone];
  const done = flags.filter(Boolean).length;
  return {
    medsDone,
    moodDone,
    sleepDone,
    mealsDone,
    takenCount,
    mealCount,
    done,
    total: 4,
    complete: done === 4,
  };
}
