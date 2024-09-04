import { NextResponse } from "next/server";
import axios from "axios";

// Custom CORS Handling
function handleCors(req) {
  const origin = req.headers.get("origin");
  const allowedOrigins = ["http://localhost:3000"];

  if (allowedOrigins.includes(origin || "")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization"
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      response.headers.set("Access-Control-Max-Age", "86400"); // Cache preflight request for 24 hours
      return new NextResponse(null, { status: 204 });
    }
    return response;
  }
  return null;
}

// Helper function to fetch data from the Directus API
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data from Directus API" },
      { status: 500 }
    );
  }
}

// Handler function to map paths to API URLs
function handleApiRequest(pathname) {
  const apiMap = {
    "/api/test": "http://75.119.130.218:8055/items/Global",
  };

  return apiMap[pathname] || null;
}

// Middleware function
export async function middleware(req) {
  // Run the custom CORS handling
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Handle API requests
  const apiUrl = handleApiRequest(req.nextUrl.pathname);
  if (apiUrl) {
    return fetchData(apiUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
