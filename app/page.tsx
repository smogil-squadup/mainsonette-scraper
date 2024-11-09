import { PriceComparisonTable } from "@/components/price-comparison-table";
import { scrapeProduct } from "@/lib/scrape-product";

export default async function Home() {
  // Initial fetch - could be from database instead of scraping
  const initialPrices = await scrapeProduct("734126195622");

  return (
    <main className="container mx-auto p-4">
      <PriceComparisonTable initialPrices={initialPrices} />
    </main>
  );
}
