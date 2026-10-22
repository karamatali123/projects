import { z } from "zod";

export const EMPTY_VALUE_MESSAGE = "Please enter a value.";

export function requiredNumber(invalidMessage = "Please enter a valid number.") {
  return z.coerce
    .number({ error: EMPTY_VALUE_MESSAGE })
    .finite({ error: invalidMessage });
}

export function positiveAmount(message: string) {
  return requiredNumber().gt(0, { error: message });
}

export function nonNegativeAmount(message = "Please enter an amount of $0 or more.") {
  return requiredNumber().min(0, { error: message });
}

export function percentValue(
  message = "Please enter a valid percentage.",
  max = 100,
) {
  return requiredNumber().min(0, { error: message }).max(max, { error: message });
}

export function interestRate(message = "Please enter a valid interest rate.") {
  return requiredNumber().min(0, { error: message }).max(50, { error: message });
}

export function wholeCount(message: string, min = 1, max = 100) {
  return requiredNumber()
    .int({ error: message })
    .min(min, { error: message })
    .max(max, { error: message });
}

export function fieldError(
  error: z.ZodError,
  path: PropertyKey,
): string | undefined {
  return error.issues.find((issue) => issue.path[0] === path)?.message;
}
