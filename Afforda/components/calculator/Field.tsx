import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

type FieldWrapProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

function FieldWrap({ id, label, error, hint, children }: FieldWrapProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
};

export function NumberField({
  id,
  label,
  error,
  hint,
  prefix,
  suffix,
  className,
  ...props
}: NumberFieldProps) {
  const describedBy = [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <FieldWrap id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          inputMode="decimal"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(prefix && "pl-7", suffix && "pr-10", className)}
          {...props}
        />
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </FieldWrap>
  );
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function SelectField({
  id,
  label,
  error,
  hint,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <FieldWrap id={id} label={label} error={error} hint={hint}>
      <Select id={id} aria-invalid={Boolean(error)} {...props}>
        {children}
      </Select>
    </FieldWrap>
  );
}
