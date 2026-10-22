import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { UkSalaryCalculator } from "@/components/calculators/UkSalaryCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("uk-salary-calculator");

export default function UkSalaryCalculatorPage() {
  return (
    <CalculatorPage slug="uk-salary-calculator">
      <UkSalaryCalculator />
    </CalculatorPage>
  );
}
