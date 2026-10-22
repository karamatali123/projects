import { CategoryCatalog } from "@/components/home/CategoryCatalog";
import { categoryMetadata } from "@/lib/seo/metadata";

export const metadata = categoryMetadata("income");

export default function IncomeCalculatorsPage() {
  return (
    <CategoryCatalog
      slug="income"
      heading="Salary, take-home pay, and hourly calculators"
    />
  );
}
