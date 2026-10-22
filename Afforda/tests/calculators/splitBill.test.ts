import { describe, expect, it } from "vitest";
import { calculateSplitBill } from "@/lib/calculators/splitBill";

describe("calculateSplitBill", () => {
  it("splits equally by default", () => {
    const result = calculateSplitBill({
      billAmount: 120,
      tipPercent: 18,
      numberOfPeople: 4,
    });
    expect(result.total).toBe(141.6);
    expect(result.equalShare).toBe(35.4);
    expect(result.shares).toHaveLength(4);
  });

  it("keeps custom amounts and splits the remainder", () => {
    const result = calculateSplitBill({
      billAmount: 100,
      tipPercent: 20,
      numberOfPeople: 3,
      unequal: true,
      customAmounts: [50, 0, 0],
    });
    expect(result.total).toBe(120);
    expect(result.shares[0]?.amount).toBe(50);
    expect(result.shares[1]?.amount).toBe(35);
    expect(result.shares[2]?.amount).toBe(35);
  });
});
