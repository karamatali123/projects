import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { DebtCalculator } from "@/components/calculators/DebtCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("debt-payoff-calculator");

export default function DebtPayoffCalculatorPage() {
  return (
    <CalculatorPage slug="debt-payoff-calculator">
      <DebtCalculator />
    </CalculatorPage>
  );
}
