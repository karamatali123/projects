import { describe, expect, it } from "vitest";
import { calculateTip, tipInputSchema } from "@/lib/calculators/tip";

describe("calculateTip", () => {
  it("calculates a 20% tip", () => {
    const result = calculateTip({
      billAmount: 86.4,
      tipPercent: 20,
      numberOfPeople: 1,
    });
    expect(result.tipAmount).toBe(17.28);
    expect(result.totalBill).toBe(103.68);
    expect(result.amountPerPerson).toBe(103.68);
  });

  it("splits among multiple people", () => {
    const result = calculateTip({
      billAmount: 100,
      tipPercent: 18,
      numberOfPeople: 4,
    });
    expect(result.tipAmount).toBe(18);
    expect(result.totalBill).toBe(118);
    expect(result.amountPerPerson).toBe(29.5);
  });

  it("allows a 0% tip", () => {
    const result = calculateTip({
      billAmount: 50,
      tipPercent: 0,
      numberOfPeople: 2,
    });
    expect(result.tipAmount).toBe(0);
    expect(result.amountPerPerson).toBe(25);
  });

  it("rejects an empty people count", () => {
    const parsed = tipInputSchema.safeParse({
      billAmount: 20,
      tipPercent: 20,
      numberOfPeople: 0,
    });
    expect(parsed.success).toBe(false);
  });

  it("handles large bills", () => {
    const result = calculateTip({
      billAmount: 1_000_000,
      tipPercent: 15,
      numberOfPeople: 10,
    });
    expect(result.tipAmount).toBe(150000);
    expect(result.amountPerPerson).toBe(115000);
  });
});
