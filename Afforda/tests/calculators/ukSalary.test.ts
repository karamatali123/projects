import { describe, expect, it } from "vitest";
import { calculateUkSalary, ukSalaryInputSchema } from "@/lib/calculators/ukSalary";
import { ukIncomeTax, ukPersonalAllowance } from "@/lib/calculators/ukTax";

const base = {
  payFrequency: "annually" as const,
  region: "england_wales_ni" as const,
  pensionSacrifice: 0,
  fullTimeHours: 37.5,
  hoursPerWeek: 37.5,
};

describe("calculateUkSalary", () => {
  it("estimates 2026/27 take-home on a £40,000 England salary", () => {
    const result = calculateUkSalary({ ...base, amount: 40000 });
    expect(result.annual).toBe(40000);
    expect(result.monthly).toBeCloseTo(40000 / 12, 2);
    expect(result.incomeTax).toBeCloseTo(5486, 2);
    expect(result.nationalInsurance).toBeCloseTo(2194.4, 2);
    expect(result.annualTakeHome).toBeCloseTo(32319.6, 2);
    expect(result.monthlyTakeHome).toBeCloseTo(32319.6 / 12, 2);
    expect(result.hourly).toBeCloseTo(40000 / (37.5 * 52), 2);
    expect(result.taxYear).toBe("2026/27");
  });

  it("uses a higher rate band on £60,000", () => {
    const result = calculateUkSalary({ ...base, amount: 60000 });
    expect(result.incomeTax).toBeCloseTo(11432, 2);
    expect(result.nationalInsurance).toBeCloseTo(3210.6, 2);
    expect(result.annualTakeHome).toBeCloseTo(45357.4, 2);
  });

  it("applies Scottish income tax bands", () => {
    const england = calculateUkSalary({ ...base, amount: 40000 });
    const scotland = calculateUkSalary({
      ...base,
      amount: 40000,
      region: "scotland",
    });
    expect(scotland.incomeTax).toBeGreaterThan(england.incomeTax);
    expect(scotland.nationalInsurance).toBe(england.nationalInsurance);
    expect(scotland.annualTakeHome).toBeLessThan(england.annualTakeHome);
  });

  it("reduces tax and NI with pension salary sacrifice", () => {
    const without = calculateUkSalary({ ...base, amount: 40000 });
    const withSacrifice = calculateUkSalary({
      ...base,
      amount: 40000,
      pensionSacrifice: 2000,
    });
    expect(withSacrifice.incomeTax).toBeLessThan(without.incomeTax);
    expect(withSacrifice.nationalInsurance).toBeLessThan(without.nationalInsurance);
    expect(withSacrifice.annualTakeHome).toBeLessThan(without.annualTakeHome);
    expect(withSacrifice.pensionSacrifice).toBe(2000);
  });

  it("pro-rates a full-time salary by hours", () => {
    const result = calculateUkSalary({
      ...base,
      amount: 37500,
      hoursPerWeek: 30,
    });
    expect(result.isProRata).toBe(true);
    expect(result.fteAnnual).toBe(37500);
    expect(result.annual).toBe(30000);
  });

  it("annualizes monthly salary", () => {
    const result = calculateUkSalary({
      ...base,
      amount: 3000,
      payFrequency: "monthly",
    });
    expect(result.annual).toBe(36000);
    expect(result.periodTakeHome).toBeCloseTo(result.monthlyTakeHome, 2);
  });

  it("tapers the personal allowance above £100,000", () => {
    expect(ukPersonalAllowance(100000)).toBe(12570);
    expect(ukPersonalAllowance(110000)).toBe(7570);
    expect(ukPersonalAllowance(125140)).toBe(0);
    expect(ukIncomeTax(110000, "england_wales_ni")).toBeGreaterThan(
      ukIncomeTax(100000, "england_wales_ni"),
    );
  });

  it("rejects a zero salary", () => {
    const parsed = ukSalaryInputSchema.safeParse({
      ...base,
      amount: 0,
    });
    expect(parsed.success).toBe(false);
  });
});
