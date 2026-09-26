import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = new URL("/customer/booking-confirmed", request.url);

  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const reference =
    searchParams.get("reference") ||
    searchParams.get("booking_ref") ||
    "";
  if (reference && !targetUrl.searchParams.has("booking_ref")) {
    targetUrl.searchParams.set("booking_ref", reference);
  }

  return NextResponse.redirect(targetUrl, 307);
}

export async function POST(request: NextRequest) {
  return GET(request);
}
