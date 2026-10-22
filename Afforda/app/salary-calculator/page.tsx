import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { SalaryCalculator } from "@/components/calculators/SalaryCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("salary-calculator");

export default function SalaryCalculatorPage() {
  return (
    <CalculatorPage slug="salary-calculator">
      <SalaryCalculator />
    </CalculatorPage>
  );
}
