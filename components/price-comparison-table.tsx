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

interface PriceComparisonTableProps {
  data: PriceData[];
}

export function PriceComparisonTable({ data }: PriceComparisonTableProps) {
  const [sortField, setSortField] = useState<keyof PriceData>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field: keyof PriceData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getPriceDifference = (retailPrice?: number, maisonettePrice?: number) => {
    if (!retailPrice || !maisonettePrice) return null;
    const diff = ((retailPrice - maisonettePrice) / maisonettePrice) * 100;
    return diff.toFixed(1);
  };

  const filteredData = data.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) return 0;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? Number(aValue) - Number(bValue)
      : Number(bValue) - Number(aValue);
  });

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("productName")}
                  className="flex items-center"
                >
                  Product
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
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
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell>{formatPrice(item.maisonettePrice)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{formatPrice(item.amazonPrice)}</span>
                    {getPriceDifference(item.amazonPrice, item.maisonettePrice) && (
                      <Badge
                        variant={
                          Number(
                            getPriceDifference(
                              item.amazonPrice,
                              item.maisonettePrice
                            )
                          ) > 0
                            ? "destructive"
                            : "success"
                        }
                      >
                        {getPriceDifference(
                          item.amazonPrice,
                          item.maisonettePrice
                        )}
                        %
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{formatPrice(item.wayfairPrice)}</span>
                    {getPriceDifference(
                      item.wayfairPrice,
                      item.maisonettePrice
                    ) && (
                      <Badge
                        variant={
                          Number(
                            getPriceDifference(
                              item.wayfairPrice,
                              item.maisonettePrice
                            )
                          ) > 0
                            ? "destructive"
                            : "success"
                        }
                      >
                        {getPriceDifference(
                          item.wayfairPrice,
                          item.maisonettePrice
                        )}
                        %
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{formatPrice(item.targetPrice)}</span>
                    {getPriceDifference(
                      item.targetPrice,
                      item.maisonettePrice
                    ) && (
                      <Badge
                        variant={
                          Number(
                            getPriceDifference(
                              item.targetPrice,
                              item.maisonettePrice
                            )
                          ) > 0
                            ? "destructive"
                            : "success"
                        }
                      >
                        {getPriceDifference(
                          item.targetPrice,
                          item.maisonettePrice
                        )}
                        %
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{formatPrice(item.walmartPrice)}</span>
                    {getPriceDifference(
                      item.walmartPrice,
                      item.maisonettePrice
                    ) && (
                      <Badge
                        variant={
                          Number(
                            getPriceDifference(
                              item.walmartPrice,
                              item.maisonettePrice
                            )
                          ) > 0
                            ? "destructive"
                            : "success"
                        }
                      >
                        {getPriceDifference(
                          item.walmartPrice,
                          item.maisonettePrice
                        )}
                        %
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{formatPrice(item.cbKidsPrice)}</span>
                    {getPriceDifference(
                      item.cbKidsPrice,
                      item.maisonettePrice
                    ) && (
                      <Badge
                        variant={
                          Number(
                            getPriceDifference(
                              item.cbKidsPrice,
                              item.maisonettePrice
                            )
                          ) > 0
                            ? "destructive"
                            : "success"
                        }
                      >
                        {getPriceDifference(
                          item.cbKidsPrice,
                          item.maisonettePrice
                        )}
                        %
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}