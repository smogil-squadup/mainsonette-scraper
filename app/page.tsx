"use client";

import { useState, useEffect } from 'react';
import { PriceComparisonTable } from '@/components/price-comparison-table';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { PriceData } from '@/lib/types';

// Sample UPCs - replace with your actual list
const SAMPLE_UPCS = [
  "123456789012",
  "234567890123",
  // Add your UPCs here
];

export default function Home() {
  const [data, setData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upcs: SAMPLE_UPCS }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const { results } = await response.json();
      setData(results);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Price Comparison Dashboard</h1>
        <Button
          onClick={fetchPrices}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Prices
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-lg p-6">
        <PriceComparisonTable data={data} />
      </div>
    </main>
  );
}