import type { ReactNode } from "react";
import { useMedicineReminders } from "@/lib/use-medicine-reminders";

export type Tab = "hoy" | "semana" | "medicinas";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "hoy", label: "Hoy", icon: "☀" },
  { key: "semana", label: "Semana", icon: "🗓" },
  { key: "medicinas", label: "Medicinas", icon: "💊" },
];

export function AppShell({
  tab,
  onTabChange,
  children,
}: {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  children: ReactNode;
}) {
  useMedicineReminders();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <main className="flex-1 px-5 pb-40 pt-6">{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-lg border-t border-border bg-surface/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-nav backdrop-blur-sm"
        aria-label="Principal"
      >
        <div className="grid grid-cols-3 gap-2 px-4">
          {TABS.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onTabChange(item.key)}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-md px-2 text-base font-semibold transition-colors duration-150 " +
                  (active ? "bg-primary-soft text-primary" : "text-muted")
                }
              >
                <span className="text-xl" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
