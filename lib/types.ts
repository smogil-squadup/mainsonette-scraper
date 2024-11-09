export interface PriceData {
  productName: string;
  upc: string;
  maisonettePrice?: number;
  amazonPrice?: number;
  wayfairPrice?: number;
  targetPrice?: number;
  walmartPrice?: number;
  cbKidsPrice?: number;
  lastUpdated: string;
}

export interface Column {
  id: string;
  label: string;
}
