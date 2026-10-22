import { z } from "zod";
import { roundToCents } from "@/lib/formatting/currency";
import {
  interestRate,
  nonNegativeAmount,
  positiveAmount,
} from "@/lib/validation/schemas";

export const debtInputSchema = z.object({
  balance: positiveAmount("Please enter a debt balance greater than $0."),
  apr: interestRate("Please enter a valid interest rate."),
  minimumPayment: positiveAmount("Please enter a monthly payment greater than $0."),
  additionalPayment: nonNegativeAmount(
    "Please enter an additional payment of $0 or more.",
  ),
});

export type DebtInput = z.infer<typeof debtInputSchema>;

export type DebtPayoffPath = {
  months: number;
  totalInterest: number;
  totalPaid: number;
  neverPaysOff: boolean;
};

export type DebtResult = {
  withExtra: DebtPayoffPath;
  minimumOnly: DebtPayoffPath;
  interestSaved: number;
  monthsSaved: number;
};

const MAX_MONTHS = 600;

export function payoffSchedule(
  balance: number,
  apr: number,
  payment: number,
): DebtPayoffPath {
  if (balance <= 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0, neverPaysOff: false };
  }
  if (payment <= 0) {
    return {
      months: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      neverPaysOff: true,
    };
  }

  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) {
    const months = Math.ceil(balance / payment);
    return {
      months,
      totalInterest: 0,
      totalPaid: roundToCents(balance),
      neverPaysOff: false,
    };
  }

  const firstInterest = balance * monthlyRate;
  if (payment <= firstInterest + 0.000001) {
    return {
      months: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      neverPaysOff: true,
    };
  }

  let remaining = balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  while (remaining > 0.01 && months < MAX_MONTHS) {
    const interest = remaining * monthlyRate;
    let paymentThisMonth = payment;
    if (paymentThisMonth > remaining + interest) {
      paymentThisMonth = remaining + interest;
    }
    remaining = remaining + interest - paymentThisMonth;
    totalInterest += interest;
    totalPaid += paymentThisMonth;
    months += 1;
  }

  if (remaining > 0.01) {
    return {
      months: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      neverPaysOff: true,
    };
  }

  return {
    months,
    totalInterest: roundToCents(totalInterest),
    totalPaid: roundToCents(totalPaid),
    neverPaysOff: false,
  };
}

export function calculateDebtPayoff(input: DebtInput): DebtResult {
  const minimumOnly = payoffSchedule(
    input.balance,
    input.apr,
    input.minimumPayment,
  );
  const withExtra = payoffSchedule(
    input.balance,
    input.apr,
    input.minimumPayment + input.additionalPayment,
  );
  const interestSaved =
    !minimumOnly.neverPaysOff && !withExtra.neverPaysOff
      ? roundToCents(minimumOnly.totalInterest - withExtra.totalInterest)
      : 0;
  const monthsSaved =
    !minimumOnly.neverPaysOff && !withExtra.neverPaysOff
      ? Math.max(minimumOnly.months - withExtra.months, 0)
      : 0;

  return { withExtra, minimumOnly, interestSaved, monthsSaved };
}
