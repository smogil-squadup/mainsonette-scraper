"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceData } from "@/lib/types";
import { ReloadIcon } from "@radix-ui/react-icons";

interface PriceComparisonTableProps {
  initialPrices: PriceData;
}

export function PriceComparisonTable({
  initialPrices,
}: PriceComparisonTableProps) {
  const [prices, setPrices] = useState<PriceData>(initialPrices);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/manual-scrape", {
        method: "POST",
      });
      const newPrices = await response.json();
      setPrices(newPrices);
    } catch (error) {
      console.error("Failed to refresh prices:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getPriceDifference = (
    retailPrice?: number,
    maisonettePrice?: number
  ) => {
    if (!retailPrice || !maisonettePrice) return null;
    const diff = ((retailPrice - maisonettePrice) / maisonettePrice) * 100;
    return diff.toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Price Comparison</h2>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm">
          {isRefreshing ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <ReloadIcon className="mr-2 h-4 w-4" />
              Refresh Prices
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>UPC</TableHead>
              <TableHead>Maisonette</TableHead>
              <TableHead>Amazon</TableHead>
              <TableHead>Wayfair</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Walmart</TableHead>
              <TableHead>CB Kids</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {prices.productName}
              </TableCell>
              <TableCell>{prices.upc}</TableCell>
              <TableCell>{formatPrice(prices.maisonettePrice)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{formatPrice(prices.amazonPrice)}</span>
                  {getPriceDifference(
                    prices.amazonPrice,
                    prices.maisonettePrice
                  ) && (
                    <Badge
                      variant={
                        Number(
                          getPriceDifference(
                            prices.amazonPrice,
                            prices.maisonettePrice
                          )
                        ) > 0
                          ? "destructive"
                          : "secondary"
                      }>
                      {getPriceDifference(
                        prices.amazonPrice,
                        prices.maisonettePrice
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{formatPrice(prices.wayfairPrice)}</span>
                  {getPriceDifference(
                    prices.wayfairPrice,
                    prices.maisonettePrice
                  ) && (
                    <Badge
                      variant={
                        Number(
                          getPriceDifference(
                            prices.wayfairPrice,
                            prices.maisonettePrice
                          )
                        ) > 0
                          ? "destructive"
                          : "secondary"
                      }>
                      {getPriceDifference(
                        prices.wayfairPrice,
                        prices.maisonettePrice
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{formatPrice(prices.targetPrice)}</span>
                  {getPriceDifference(
                    prices.targetPrice,
                    prices.maisonettePrice
                  ) && (
                    <Badge
                      variant={
                        Number(
                          getPriceDifference(
                            prices.targetPrice,
                            prices.maisonettePrice
                          )
                        ) > 0
                          ? "destructive"
                          : "secondary"
                      }>
                      {getPriceDifference(
                        prices.targetPrice,
                        prices.maisonettePrice
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{formatPrice(prices.walmartPrice)}</span>
                  {getPriceDifference(
                    prices.walmartPrice,
                    prices.maisonettePrice
                  ) && (
                    <Badge
                      variant={
                        Number(
                          getPriceDifference(
                            prices.walmartPrice,
                            prices.maisonettePrice
                          )
                        ) > 0
                          ? "destructive"
                          : "secondary"
                      }>
                      {getPriceDifference(
                        prices.walmartPrice,
                        prices.maisonettePrice
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{formatPrice(prices.cbKidsPrice)}</span>
                  {getPriceDifference(
                    prices.cbKidsPrice,
                    prices.maisonettePrice
                  ) && (
                    <Badge
                      variant={
                        Number(
                          getPriceDifference(
                            prices.cbKidsPrice,
                            prices.maisonettePrice
                          )
                        ) > 0
                          ? "destructive"
                          : "secondary"
                      }>
                      {getPriceDifference(
                        prices.cbKidsPrice,
                        prices.maisonettePrice
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {new Date(prices.lastUpdated).toLocaleDateString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
