import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { TipCalculator } from "@/components/calculators/TipCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("tip-calculator");

export default function TipCalculatorPage() {
  return (
    <CalculatorPage slug="tip-calculator">
      <TipCalculator />
    </CalculatorPage>
  );
}
