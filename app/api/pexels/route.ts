import { NextResponse } from "next/server";
import axios from "axios";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

export async function GET(request: Request) {
  // Get the query parameter from the URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(PEXELS_API_URL, {
      params: { query, per_page: 20 },
      headers: { Authorization: PEXELS_API_KEY },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Pexels API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
