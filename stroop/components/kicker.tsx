import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.22em] text-mist",
        className,
      )}
    >
      {children}
    </p>
  );
}
