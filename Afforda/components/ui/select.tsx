import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-3 text-base text-foreground transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
