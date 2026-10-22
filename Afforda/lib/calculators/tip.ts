import { z } from "zod";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, positiveAmount, wholeCount } from "@/lib/validation/schemas";

export const tipInputSchema = z.object({
  billAmount: positiveAmount("Please enter a bill amount greater than $0."),
  tipPercent: nonNegativeAmount("Please enter a tip percentage of 0 or more.").max(
    100,
    { error: "Please enter a tip percentage of 100% or less." },
  ),
  numberOfPeople: wholeCount("Please enter at least 1 person."),
});

export type TipInput = z.infer<typeof tipInputSchema>;

export type TipResult = {
  tipAmount: number;
  totalBill: number;
  amountPerPerson: number;
  tipPerPerson: number;
  billPerPerson: number;
};

export function calculateTip(input: TipInput): TipResult {
  const tipAmount = roundToCents(input.billAmount * (input.tipPercent / 100));
  const totalBill = roundToCents(input.billAmount + tipAmount);
  const people = input.numberOfPeople;
  return {
    tipAmount,
    totalBill,
    amountPerPerson: roundToCents(totalBill / people),
    tipPerPerson: roundToCents(tipAmount / people),
    billPerPerson: roundToCents(input.billAmount / people),
  };
}
