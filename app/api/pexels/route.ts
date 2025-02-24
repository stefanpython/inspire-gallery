// app/api/pexels/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "80";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(PEXELS_API_URL, {
      params: {
        query,
        page: parseInt(page),
        per_page: parseInt(per_page),
      },
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
