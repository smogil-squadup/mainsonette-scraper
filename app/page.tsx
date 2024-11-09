// Remove the "use client" directive since this is a Server Component
import { scrapeProduct } from "@/lib/scrape-product";
import { PriceComparisonTable } from "@/components/price-comparison-table";

export default async function Page() {
  const productData = await scrapeProduct("734126195622");

  return (
    <div className="container mx-auto py-10">
      <PriceComparisonTable data={[productData]} />
    </div>
  );
}
