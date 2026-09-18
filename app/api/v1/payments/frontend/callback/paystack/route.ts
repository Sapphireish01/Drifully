import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = new URL("/customer/booking-confirmed", request.url);

  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(targetUrl, 307);
}
