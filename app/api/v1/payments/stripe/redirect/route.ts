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

  // Pre-confirm session with backend if sessionId is present
  if (sessionId) {
    const candidatePaths = [
      `${BACKEND_URL}/api/v1/payments/stripe/redirect/`,
      `${BACKEND_URL}/api/v1/payments/frontend/stripe/redirect/`,
      `${BACKEND_URL}/api/v1/frontend/payments/stripe/redirect/`,
    ];

    for (const backendPath of candidatePaths) {
      try {
        const headers: Record<string, string> = {
          'Accept': 'application/json',
        };
        if (API_KEY) {
          headers['X-API-KEY'] = API_KEY;
        }

        await axios.get(backendPath, {
          params: { session_id: sessionId, reference, booking_ref: reference },
          headers,
          timeout: 8000,
        });
        break; // Successfully confirmed with backend
      } catch (err: any) {
        console.warn(`Server-side Stripe redirect pre-confirmation note (${backendPath}):`, err?.response?.data || err.message);
      }
    }
  }

  // 1. Check if a return path cookie was set when leaving to Stripe (e.g. /customer/vehicles/12)
  const cookiePath = request.cookies.get("stripe_booking_path")?.value;
  let targetPath = cookiePath ? decodeURIComponent(cookiePath) : "";

  // 2. Fallback: if no cookie was set, default to customer vehicles directory
  if (!targetPath || !targetPath.startsWith("/")) {
    targetPath = "/customer/vehicles";
  }

  const targetUrl = new URL(targetPath, request.url);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  if (reference && !targetUrl.searchParams.has("booking_ref")) {
    targetUrl.searchParams.set("booking_ref", reference);
  }
  targetUrl.searchParams.set("step", "confirmed");

  const response = NextResponse.redirect(targetUrl, 307);
  response.cookies.delete("stripe_booking_path");
  response.cookies.delete("stripe_booking_ref");
  return response;
}

export async function POST(request: NextRequest) {
  return GET(request);
}
