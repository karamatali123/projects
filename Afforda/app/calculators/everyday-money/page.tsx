import { CategoryCatalog } from "@/components/home/CategoryCatalog";
import { categoryMetadata } from "@/lib/seo/metadata";

export const metadata = categoryMetadata("everyday-money");

export default function EverydayMoneyCalculatorsPage() {
  return <CategoryCatalog slug="everyday-money" />;
}
