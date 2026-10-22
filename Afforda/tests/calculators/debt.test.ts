import { describe, expect, it } from "vitest";
import { calculateDebtPayoff, debtInputSchema } from "@/lib/calculators/debt";

describe("calculateDebtPayoff", () => {
  it("pays off a 0% APR balance in ceil(balance/payment) months", () => {
    const result = calculateDebtPayoff({
      balance: 1200,
      apr: 0,
      minimumPayment: 100,
      additionalPayment: 0,
    });
    expect(result.minimumOnly.months).toBe(12);
    expect(result.minimumOnly.totalInterest).toBe(0);
    expect(result.minimumOnly.totalPaid).toBe(1200);
  });

  it("saves interest with extra payments", () => {
    const result = calculateDebtPayoff({
      balance: 8000,
      apr: 19.99,
      minimumPayment: 200,
      additionalPayment: 100,
    });
    expect(result.withExtra.months).toBeLessThan(result.minimumOnly.months);
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.withExtra.neverPaysOff).toBe(false);
  });

  it("reports never when payment does not cover interest", () => {
    const result = calculateDebtPayoff({
      balance: 10000,
      apr: 24,
      minimumPayment: 10,
      additionalPayment: 0,
    });
    expect(result.minimumOnly.neverPaysOff).toBe(true);
  });

  it("handles decimal balances", () => {
    const result = calculateDebtPayoff({
      balance: 99.5,
      apr: 0,
      minimumPayment: 25,
      additionalPayment: 0,
    });
    expect(result.minimumOnly.months).toBe(4);
  });

  it("rejects a negative balance", () => {
    expect(
      debtInputSchema.safeParse({
        balance: -1,
        apr: 10,
        minimumPayment: 50,
        additionalPayment: 0,
      }).success,
    ).toBe(false);
  });

  it("treats extra payment of 0 as identical to minimum-only", () => {
    const result = calculateDebtPayoff({
      balance: 5000,
      apr: 12,
      minimumPayment: 150,
      additionalPayment: 0,
    });
    expect(result.interestSaved).toBe(0);
    expect(result.monthsSaved).toBe(0);
  });
});
