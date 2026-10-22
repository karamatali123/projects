import { CategoryCatalog } from "@/components/home/CategoryCatalog";
import { categoryMetadata } from "@/lib/seo/metadata";

export const metadata = categoryMetadata("debt");

export default function DebtCalculatorsPage() {
  return <CategoryCatalog slug="debt" />;
}
