import { CategoryCatalog } from "@/components/home/CategoryCatalog";
import { categoryMetadata } from "@/lib/seo/metadata";

export const metadata = categoryMetadata("cars");

export default function CarsCalculatorsPage() {
  return <CategoryCatalog slug="cars" />;
}
