import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { CarCalculator } from "@/components/calculators/CarCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("car-affordability-calculator");

export default function CarAffordabilityCalculatorPage() {
  return (
    <CalculatorPage slug="car-affordability-calculator">
      <CarCalculator />
    </CalculatorPage>
  );
}
