import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { HomeCalculator } from "@/components/calculators/HomeCalculator";
import { calculatorMetadata } from "@/lib/seo/metadata";

export const metadata = calculatorMetadata("home-affordability-calculator");

export default function HomeAffordabilityCalculatorPage() {
  return (
    <CalculatorPage slug="home-affordability-calculator">
      <HomeCalculator />
    </CalculatorPage>
  );
}
