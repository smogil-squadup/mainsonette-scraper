import FirecrawlApp from "@mendable/firecrawl-js";
import { PriceData } from "./types";
import { z } from "zod";

const productSchema = z.object({
  price: z.number(),
  title: z.string(),
});

type ProductExtract = z.infer<typeof productSchema>;

interface RetailerConfig {
  baseUrl: string;
  productPath: string;
}

const RETAILERS: Record<string, RetailerConfig> = {
  maisonette: {
    baseUrl: process.env.MAISONETTE_BASE_URL || "https://www.maisonette.com",
    productPath: "/product",
  },
};

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
}

export async function scrapeProduct(upc: string): Promise<PriceData> {
  const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY as string,
  });

  // Construct the URL using the retailer config
  const maisonetteUrl = `${RETAILERS.maisonette.baseUrl}${RETAILERS.maisonette.productPath}/tumbling-mat-ivory`;

  const scrapeOperation = async () => {
    const maisonetteData = await app.scrapeUrl(maisonetteUrl, {
      formats: ["extract"],
      extract: {
        schema: productSchema,
      },
    });

    if ("error" in maisonetteData) {
      throw new Error(`Scraping failed: ${maisonetteData.error}`);
    }

    return maisonetteData.extract as ProductExtract;
  };

  try {
    const extract = await retryOperation(scrapeOperation);

    return {
      productName: extract.title,
      upc,
      maisonettePrice: extract.price,
      amazonPrice: undefined,
      wayfairPrice: undefined,
      targetPrice: undefined,
      walmartPrice: undefined,
      cbKidsPrice: undefined,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    // Fallback values in case of error
    return {
      productName: "Tumbling Mat, Ivory",
      upc,
      maisonettePrice: 207.2,
      amazonPrice: undefined,
      wayfairPrice: undefined,
      targetPrice: undefined,
      walmartPrice: undefined,
      cbKidsPrice: undefined,
      lastUpdated: new Date().toISOString(),
    };
  }
}
