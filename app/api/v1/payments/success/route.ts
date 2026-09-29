import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookingRef =
    searchParams.get("booking_ref") ||
    searchParams.get("booking_reference") ||
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    "";

  const targetUrl = new URL("/customer/booking-confirmed", request.url);
  if (bookingRef) {
    targetUrl.searchParams.set("booking_ref", bookingRef);
  }

  // Preserve any additional query params if present
  searchParams.forEach((value, key) => {
    if (!targetUrl.searchParams.has(key)) {
      targetUrl.searchParams.set(key, value);
    }
  });

  return NextResponse.redirect(targetUrl, 307);
}
