import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-[#09665c]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#c85a32]",
        accent: "bg-primary text-primary-foreground hover:bg-[#09665c]",
        outline:
          "border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary-soft",
        ghost: "text-foreground shadow-none hover:bg-primary-soft hover:text-primary",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
