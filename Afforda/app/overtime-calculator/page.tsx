import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { OvertimeCalculator } from "@/components/calculators/OvertimeCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("overtime-calculator");

export default function OvertimeCalculatorPage() {
  return (
    <CalculatorPage slug="overtime-calculator">
      <OvertimeCalculator />
    </CalculatorPage>
  );
}
