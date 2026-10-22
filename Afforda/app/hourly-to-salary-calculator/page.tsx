import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { HourlyCalculator } from "@/components/calculators/HourlyCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("hourly-to-salary-calculator");

export default function HourlyToSalaryCalculatorPage() {
  return (
    <CalculatorPage slug="hourly-to-salary-calculator">
      <HourlyCalculator />
    </CalculatorPage>
  );
}
