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

    const target = bookingRef
      ? `/customer/booking-confirmed?booking_ref=${encodeURIComponent(bookingRef)}`
      : "/customer/booking-confirmed";

    router.replace(target);
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
