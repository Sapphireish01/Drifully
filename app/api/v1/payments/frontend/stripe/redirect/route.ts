import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drifully-backend-1qa6.onrender.com';
const API_KEY = process.env.DRIFULLY_BACKEND_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId =
    searchParams.get("session_id") ||
    searchParams.get("sessionId") ||
    searchParams.get("checkout_session_id") ||
    "";
  const reference =
    searchParams.get("reference") ||
    searchParams.get("booking_ref") ||
    searchParams.get("booking_reference") ||
    "";

  // Pre-confirm session with backend if credentials exist
  if (sessionId && reference && API_KEY) {
    try {
      await axios.get(`${BACKEND_URL}/api/v1/payments/frontend/stripe/redirect/`, {
        params: { session_id: sessionId, reference },
        headers: {
          'X-API-KEY': API_KEY,
          'Accept': 'application/json',
        },
        timeout: 15000,
      });
    } catch (err: any) {
      console.warn("Server-side Stripe redirect confirmation note:", err?.response?.data || err.message);
    }
  }

  const targetUrl = new URL("/customer/booking-confirmed", request.url);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  if (reference && !targetUrl.searchParams.has("booking_ref")) {
    targetUrl.searchParams.set("booking_ref", reference);
  }

  return NextResponse.redirect(targetUrl, 307);
}
