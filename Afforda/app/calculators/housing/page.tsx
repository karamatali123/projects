import { CategoryCatalog } from "@/components/home/CategoryCatalog";
import { categoryMetadata } from "@/lib/seo/metadata";

export const metadata = categoryMetadata("housing");

export default function HousingCalculatorsPage() {
  return <CategoryCatalog slug="housing" />;
}
