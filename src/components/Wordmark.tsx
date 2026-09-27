export function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-2 font-display font-bold text-fg">
      <span
        className={
          "flex items-center justify-center rounded-full bg-primary text-primary-fg " +
          (size === "sm" ? "size-7 text-sm" : "size-9 text-base")
        }
        aria-hidden="true"
      >
        ☀
      </span>
      <span className={size === "sm" ? "text-lg" : "text-xl"}>Mi Día</span>
    </div>
  );
}
