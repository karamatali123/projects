import { z } from "zod";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, positiveAmount } from "@/lib/validation/schemas";

export const overtimeInputSchema = z.object({
  hourlyRate: positiveAmount("Please enter an hourly rate greater than $0."),
  regularHours: nonNegativeAmount("Please enter regular hours of 0 or more.").max(
    168,
    { error: "Regular hours cannot exceed 168 in a week." },
  ),
  overtimeHours: nonNegativeAmount("Please enter overtime hours of 0 or more.").max(
    168,
    { error: "Overtime hours cannot exceed 168 in a week." },
  ),
  overtimeMultiplier: z.coerce
    .number({ error: "Please enter an overtime multiplier." })
    .gt(0, { error: "Please enter an overtime multiplier greater than 0." })
    .max(10, { error: "Please enter a realistic overtime multiplier." }),
});

export type OvertimeInput = z.infer<typeof overtimeInputSchema>;

export type OvertimeResult = {
  regularPay: number;
  overtimePay: number;
  overtimeRate: number;
  totalPay: number;
};

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const overtimeRate = input.hourlyRate * input.overtimeMultiplier;
  const regularPay = input.hourlyRate * input.regularHours;
  const overtimePay = overtimeRate * input.overtimeHours;
  return {
    regularPay: roundToCents(regularPay),
    overtimePay: roundToCents(overtimePay),
    overtimeRate: roundToCents(overtimeRate),
    totalPay: roundToCents(regularPay + overtimePay),
  };
}
