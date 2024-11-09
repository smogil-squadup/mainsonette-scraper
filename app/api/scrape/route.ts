import { NextResponse } from 'next/server';

const FIRECRAWL_API_KEY = 'fc-012f1ef9f5a64a54b0771a4be3bccf92';
const RETAILERS = ['amazon', 'wayfair', 'target', 'walmart', 'crate-and-barrel-kids'];

async function scrapeProduct(upc: string) {
  try {
    const response = await fetch('https://api.firecrawl.dev/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        upc,
        retailers: RETAILERS
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error scraping UPC ${upc}:`, error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { upcs } = await request.json();
    const results = await Promise.all(upcs.map(scrapeProduct));
    
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape prices' }, { status: 500 });
  }
}