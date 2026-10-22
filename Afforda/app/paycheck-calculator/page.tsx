import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { PaycheckCalculator } from "@/components/calculators/PaycheckCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("paycheck-calculator");

export default function PaycheckCalculatorPage() {
  return (
    <CalculatorPage slug="paycheck-calculator">
      <PaycheckCalculator />
    </CalculatorPage>
  );
}
