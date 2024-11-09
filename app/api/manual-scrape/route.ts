import { scrapeProduct } from "@/lib/scrape-product";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await scrapeProduct("734126195622");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to scrape prices" },
      { status: 500 }
    );
  }
}
