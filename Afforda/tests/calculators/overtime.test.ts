import { describe, expect, it } from "vitest";
import { calculateOvertime, overtimeInputSchema } from "@/lib/calculators/overtime";

describe("calculateOvertime", () => {
  it("calculates time-and-a-half", () => {
    const result = calculateOvertime({
      hourlyRate: 22,
      regularHours: 40,
      overtimeHours: 6,
      overtimeMultiplier: 1.5,
    });
    expect(result.regularPay).toBe(880);
    expect(result.overtimePay).toBe(198);
    expect(result.totalPay).toBe(1078);
    expect(result.overtimeRate).toBe(33);
  });

  it("handles zero overtime", () => {
    const result = calculateOvertime({
      hourlyRate: 15,
      regularHours: 40,
      overtimeHours: 0,
      overtimeMultiplier: 1.5,
    });
    expect(result.overtimePay).toBe(0);
    expect(result.totalPay).toBe(600);
  });

  it("handles double time", () => {
    const result = calculateOvertime({
      hourlyRate: 20,
      regularHours: 0,
      overtimeHours: 8,
      overtimeMultiplier: 2,
    });
    expect(result.totalPay).toBe(320);
  });

  it("rejects a zero hourly rate", () => {
    expect(
      overtimeInputSchema.safeParse({
        hourlyRate: 0,
        regularHours: 40,
        overtimeHours: 0,
        overtimeMultiplier: 1.5,
      }).success,
    ).toBe(false);
  });
});
