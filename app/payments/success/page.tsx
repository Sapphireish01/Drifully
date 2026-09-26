"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Spinner from "@/components/customer/Spinner";

function PaymentsSuccessRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const bookingRef =
      searchParams.get("booking_ref") ||
      searchParams.get("booking_reference") ||
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      "";

    const targetUrl = new URL("/customer/booking-confirmed", window.location.origin);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });
    if (bookingRef && !targetUrl.searchParams.has("booking_ref")) {
      targetUrl.searchParams.set("booking_ref", bookingRef);
    }

    router.replace(targetUrl.pathname + targetUrl.search);
  }, [searchParams, router]);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "#64748b",
      }}
    >
      <Spinner size={36} />
      <p>Redirecting to your booking confirmation...</p>
    </div>
  );
}

export default function PaymentsSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size={36} />
        </div>
      }
    >
      <PaymentsSuccessRedirect />
    </Suspense>
  );
}
