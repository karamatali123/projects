import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { SalaryIncreaseCalculator } from "@/components/calculators/SalaryIncreaseCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("salary-increase-calculator");

export default function SalaryIncreaseCalculatorPage() {
  return (
    <CalculatorPage slug="salary-increase-calculator">
      <SalaryIncreaseCalculator />
    </CalculatorPage>
  );
}
