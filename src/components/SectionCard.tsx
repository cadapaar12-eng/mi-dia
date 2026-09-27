import type { ReactNode } from "react";

export function SectionCard({
  icon,
  title,
  summary,
  done,
  children,
}: {
  icon: string;
  title: string;
  summary?: string;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-surface p-6 shadow-card">
      <header className="mb-5 flex items-center gap-3">
        <span
          className={
            "flex size-12 shrink-0 items-center justify-center rounded-full text-xl " +
            (done ? "bg-primary text-primary-fg" : "bg-surface-2")
          }
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="break-words font-display text-xl font-semibold leading-tight">
            {title}
          </h2>
          {summary ? (
            <p className="mt-0.5 break-words text-base leading-snug text-muted">{summary}</p>
          ) : null}
        </div>
        {done ? (
          <span className="shrink-0 text-2xl text-primary" aria-label="Completado">
            ✓
          </span>
        ) : null}
      </header>
      {children}
    </section>
  );
}
