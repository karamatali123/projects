import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
};

export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-3 text-base text-foreground shadow-[inset_0_1px_1px_rgb(22_32_42/0.03)] placeholder:text-muted-foreground transition-colors",
        "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
