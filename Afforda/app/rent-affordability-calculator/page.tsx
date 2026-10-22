import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { RentCalculator } from "@/components/calculators/RentCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("rent-affordability-calculator");

export default function RentAffordabilityCalculatorPage() {
  return (
    <CalculatorPage slug="rent-affordability-calculator">
      <RentCalculator />
    </CalculatorPage>
  );
}
