import { scrapeProduct } from "@/lib/scrape-product";
import { NextResponse } from "next/server";

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST() {
  try {
    const data = await scrapeProduct("734126195622");
    const response = NextResponse.json(data);
    return setCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json(
      { error: "Failed to scrape prices" },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

export function OPTIONS() {
  const response = NextResponse.json({}, { status: 204 });
  return setCorsHeaders(response);
}
