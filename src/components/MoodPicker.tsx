import { MOODS, moodLabel } from "@/lib/copy";
import type { Mood } from "@/lib/store";

export function MoodPicker({
  value,
  onChange,
  layout = "list",
  name,
}: {
  value: Mood | null;
  onChange: (mood: Mood) => void;
  layout?: "list" | "compact";
  name: string;
}) {
  if (layout === "compact") {
    return (
      <div>
        <div className="flex justify-between gap-2">
          {MOODS.map((mood) => {
            const selected = value === mood.value;
            return (
              <button
                key={mood.value}
                type="button"
                aria-label={mood.label}
                aria-pressed={selected}
                onClick={() => onChange(mood.value)}
                className={
                  "flex size-14 flex-1 items-center justify-center rounded-md text-2xl transition-[transform,background-color] duration-150 ease-out active:scale-[0.96] " +
                  (selected ? "bg-primary text-primary-fg" : "bg-surface-2")
                }
              >
                {mood.emoji}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-lg font-semibold">{moodLabel(value)}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2" role="radiogroup" aria-label={name}>
      {MOODS.map((mood) => {
        const selected = value === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(mood.value)}
            className={
              "flex min-h-16 items-center gap-4 rounded-md px-4 text-left transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.96] " +
              (selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg")
            }
          >
            <span className="text-2xl shrink-0" aria-hidden="true">
              {mood.emoji}
            </span>
            <span className="break-words text-lg font-semibold">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}
