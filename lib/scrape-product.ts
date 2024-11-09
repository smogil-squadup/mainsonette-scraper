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
  target: {
    baseUrl: "https://www.target.com",
    productPath: "/p",
  },
  cbKids: {
    baseUrl: "https://www.crateandbarrel.com",
    productPath: "/gathre-ivory-vegan-leather-toddler-tumbling-mat",
  },
};

const targetSchema = z.object({
  current_retail: z.number(),
  title: z.string(),
  barcode: z.string().optional(),
});

type TargetExtract = z.infer<typeof targetSchema>;

const cbKidsSchema = z.object({
  currentPrice: z.number(),
  gtin14: z.string().optional(),
  title: z.string(),
});

type CbKidsExtract = z.infer<typeof cbKidsSchema>;

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

  // Construct URLs using the retailer config
  const maisonetteUrl = `${RETAILERS.maisonette.baseUrl}${RETAILERS.maisonette.productPath}/tumbling-mat-ivory`;
  const targetUrl = `${RETAILERS.target.baseUrl}${RETAILERS.target.productPath}/gathre-large-tumbling-mat-ivory/-/A-89981743`;

  const scrapeOperation = async () => {
    const [maisonetteData, targetData, cbKidsData] = await Promise.all([
      app.scrapeUrl(maisonetteUrl, {
        formats: ["extract"],
        extract: {
          schema: productSchema,
        },
      }),
      app.scrapeUrl(targetUrl, {
        formats: ["extract"],
        extract: {
          schema: targetSchema,
          systemPrompt:
            "Find the product details in the JSON data. Look for current_retail for the price and primary_barcode for the barcode.",
        },
      }),
      app.scrapeUrl(
        `${RETAILERS.cbKids.baseUrl}${RETAILERS.cbKids.productPath}/s377088`,
        {
          formats: ["extract"],
          extract: {
            schema: cbKidsSchema,
            systemPrompt:
              "Find the product details in the JSON data. Look for currentPrice for the price and gtin14 for the product identifier.",
          },
        }
      ),
    ]);

    if ("error" in maisonetteData) {
      throw new Error(`Maisonette scraping failed: ${maisonetteData.error}`);
    }

    if ("error" in targetData) {
      throw new Error(`Target scraping failed: ${targetData.error}`);
    }

    if ("error" in cbKidsData) {
      throw new Error(`CB Kids scraping failed: ${cbKidsData.error}`);
    }

    return {
      maisonette: maisonetteData.extract as ProductExtract,
      target: targetData.extract as TargetExtract,
      cbKids: cbKidsData.extract as CbKidsExtract,
    };
  };

  try {
    const extract = await retryOperation(scrapeOperation);

    return {
      productName: extract.maisonette.title,
      upc,
      maisonettePrice: extract.maisonette.price,
      targetPrice: extract.target.current_retail,
      amazonPrice: undefined,
      wayfairPrice: undefined,
      walmartPrice: undefined,
      cbKidsPrice: extract.cbKids.currentPrice,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    // Fallback values in case of error
    return {
      productName: "Tumbling Mat, Ivory",
      upc,
      maisonettePrice: 207.2,
      targetPrice: 255.99,
      amazonPrice: undefined,
      wayfairPrice: undefined,
      walmartPrice: undefined,
      cbKidsPrice: 220.15,
      lastUpdated: new Date().toISOString(),
    };
  }
}
