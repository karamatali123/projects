import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { IncomeTaxCalculator } from "@/components/calculators/IncomeTaxCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("income-tax-calculator");

export default function IncomeTaxCalculatorPage() {
  return (
    <CalculatorPage slug="income-tax-calculator">
      <IncomeTaxCalculator />
    </CalculatorPage>
  );
}
