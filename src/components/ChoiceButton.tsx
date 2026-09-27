export function ChoiceButton({
  selected,
  title,
  subtitle,
  onClick,
  className = "",
}: {
  selected: boolean;
  title: string;
  subtitle?: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        "flex min-h-16 items-center gap-3 rounded-md px-4 py-3 text-left transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.96] " +
        (selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg") +
        " " +
        className
      }
    >
      <span className="min-w-0 flex-1">
        <span className="block break-words text-lg font-semibold leading-snug">{title}</span>
        {subtitle ? (
          <span
            className={
              "mt-0.5 block break-words text-base leading-snug " +
              (selected ? "text-primary-fg/80" : "text-muted")
            }
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </button>
  );
}
