import { cn } from "@/lib/cn";

export function Mark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-3.5 w-3.5 shrink-0 grid-cols-2 overflow-hidden rounded-[3px]",
        className,
      )}
    >
      <span className="bg-signal" />
      <span className="bg-flare" />
      <span className="bg-flare" />
      <span className="bg-signal" />
    </span>
  );
}
