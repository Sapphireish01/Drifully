import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") || searchParams.get("error") || "payment_cancelled";
  const bookingRef =
    searchParams.get("booking_ref") ||
    searchParams.get("booking_reference") ||
    searchParams.get("reference") ||
    "";

  // Redirect to trips page or customer vehicle with query info
  const targetPath = bookingRef
    ? `/customer/trips/${bookingRef}?payment_error=${encodeURIComponent(reason)}`
    : `/customer/trips?payment_error=${encodeURIComponent(reason)}`;

  const targetUrl = new URL(targetPath, request.url);
  return NextResponse.redirect(targetUrl, 307);
}
