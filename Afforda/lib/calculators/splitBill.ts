import { z } from "zod";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, positiveAmount, wholeCount } from "@/lib/validation/schemas";

export const splitBillInputSchema = z.object({
  billAmount: positiveAmount("Please enter a bill amount greater than $0."),
  tipPercent: nonNegativeAmount("Please enter a tip percentage of 0 or more.").max(
    100,
    { error: "Please enter a tip percentage of 100% or less." },
  ),
  numberOfPeople: wholeCount("Please enter at least 1 person."),
  unequal: z.boolean().default(false),
  customAmounts: z.array(nonNegativeAmount()).optional(),
});

export type SplitBillInput = {
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
  unequal?: boolean;
  customAmounts?: number[];
};

export type SplitShare = {
  index: number;
  amount: number;
  isCustom: boolean;
};

export type SplitBillResult = {
  tipAmount: number;
  total: number;
  equalShare: number;
  shares: SplitShare[];
};

export function calculateSplitBill(input: SplitBillInput): SplitBillResult {
  const tipAmount = roundToCents(input.billAmount * (input.tipPercent / 100));
  const total = roundToCents(input.billAmount + tipAmount);
  const people = input.numberOfPeople;
  const equalShare = roundToCents(total / people);

  if (!input.unequal || !input.customAmounts?.length) {
    return {
      tipAmount,
      total,
      equalShare,
      shares: Array.from({ length: people }, (_, index) => ({
        index,
        amount: equalShare,
        isCustom: false,
      })),
    };
  }

  const amounts = Array.from({ length: people }, (_, index) => {
    const custom = input.customAmounts?.[index];
    return typeof custom === "number" && custom > 0 ? roundToCents(custom) : null;
  });
  const customTotal = amounts.reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  const unassigned = amounts.filter((value) => value === null).length;
  const remaining = Math.max(total - customTotal, 0);
  const fallback = unassigned > 0 ? roundToCents(remaining / unassigned) : 0;

  const shares = amounts.map((value, index) => ({
    index,
    amount: value ?? fallback,
    isCustom: value !== null,
  }));

  return { tipAmount, total, equalShare, shares };
}
