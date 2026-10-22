import { describe, expect, it } from "vitest";
import {
  calculateHourlyToSalary,
  calculateSalaryToHourly,
  hourlyToSalarySchema,
} from "@/lib/calculators/hourly";

describe("calculateHourlyToSalary", () => {
  it("converts a standard full-time wage", () => {
    const result = calculateHourlyToSalary({
      hourlyWage: 25,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      overtimeHours: 0,
      overtimeMultiplier: 1.5,
    });
    expect(result.weeklyIncome).toBe(1000);
    expect(result.annualIncome).toBe(52000);
    expect(result.monthlyIncome).toBeCloseTo(52000 / 12, 2);
    expect(result.annualOvertime).toBe(0);
  });

  it("adds overtime income", () => {
    const result = calculateHourlyToSalary({
      hourlyWage: 20,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      overtimeHours: 5,
      overtimeMultiplier: 1.5,
    });
    expect(result.weeklyRegular).toBe(800);
    expect(result.weeklyOvertime).toBe(150);
    expect(result.weeklyIncome).toBe(950);
    expect(result.annualOvertime).toBe(7800);
    expect(result.annualIncome).toBe(49400);
  });

  it("handles decimal wages", () => {
    const result = calculateHourlyToSalary({
      hourlyWage: 18.75,
      hoursPerWeek: 32,
      weeksPerYear: 50,
      overtimeHours: 0,
      overtimeMultiplier: 1.5,
    });
    expect(result.annualRegular).toBe(30000);
  });

  it("rejects a negative hourly wage", () => {
    const parsed = hourlyToSalarySchema.safeParse({
      hourlyWage: -10,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      overtimeHours: 0,
      overtimeMultiplier: 1.5,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("calculateSalaryToHourly", () => {
  it("divides salary by 2080 hours", () => {
    const result = calculateSalaryToHourly({
      annualSalary: 85000,
      hoursPerWeek: 40,
      weeksPerYear: 52,
    });
    expect(result.hourlyRate).toBeCloseTo(40.87, 2);
  });

  it("returns zero-safe hourly when hours are valid", () => {
    const result = calculateSalaryToHourly({
      annualSalary: 40000,
      hoursPerWeek: 20,
      weeksPerYear: 52,
    });
    expect(result.hourlyRate).toBeCloseTo(40000 / 1040, 2);
  });
});
