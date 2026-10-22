import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { SplitBillCalculator } from "@/components/calculators/SplitBillCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("split-bill-calculator");

export default function SplitBillCalculatorPage() {
  return (
    <CalculatorPage slug="split-bill-calculator">
      <SplitBillCalculator />
    </CalculatorPage>
  );
}
