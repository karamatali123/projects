import type { FormEventHandler, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CalculatorShellProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  results: ReactNode;
  submitLabel?: string;
};

export function CalculatorShell({
  onSubmit,
  children,
  results,
  submitLabel = "Calculate",
}: CalculatorShellProps) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <Card className="border-primary/15 p-5 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {children}
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            {submitLabel}
          </Button>
        </form>
      </Card>
      <div id="results">{results}</div>
    </div>
  );
}
