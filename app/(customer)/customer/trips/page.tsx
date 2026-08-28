"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { bookingsService, ApiTrip } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import TripFilterModal from "@/components/customer/TripFilterModal";
import ReadyForPickupModal from "@/components/customer/ReadyForPickupModal";
import styles from "./TripsPage.module.css";

interface TripItem {
  id: string;
  reference?: string;
  vehicle: string;
  dates: string;
  pickup: string;
  status: "Scheduled" | "Ongoing" | "Completed" | "Cancelled";
  mode: "Drive Yourself" | "Chauffeur Service";
  readyForPickup?: boolean;
  code?: string;
}

const MOCK_TRIPS: TripItem[] = [
  {
    id: "DRF-2047",
    vehicle: "Lamborghini Gallardo LP 570-4",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Scheduled",
    mode: "Drive Yourself",
    readyForPickup: true,
    code: "444444",
  },
  {
    id: "DRF-2048",
    vehicle: "Lamborghini Gallardo LP 570-4",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Scheduled",
    mode: "Drive Yourself",
  },
  {
    id: "DRF-2049",
    vehicle: "Cadillac Fleetwood Seventy-Five",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Ongoing",
    mode: "Chauffeur Service",
  },
  {
    id: "DRF-2050",
    vehicle: "Nissan Titan XD Crew Cab",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Completed",
    mode: "Drive Yourself",
  },
  {
    id: "DRF-2051",
    vehicle: "Lamborghini Gallardo LP 570-4",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Scheduled",
    mode: "Drive Yourself",
  },
  {
    id: "DRF-2052",
    vehicle: "Nissan Titan XD Crew Cab",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Cancelled",
    mode: "Chauffeur Service",
  },
];

function formatTripStatus(statusStr: string): TripItem["status"] {
  const lower = (statusStr || "").toLowerCase();
  if (lower.includes("ongoing") || lower.includes("active")) return "Ongoing";
  if (lower.includes("complete") || lower.includes("done")) return "Completed";
  if (lower.includes("cancel")) return "Cancelled";
  return "Scheduled";
}

function formatTripDates(dateStr: string): string {
  if (!dateStr || dateStr === "None - None") return "Dates Pending";
  const parts = dateStr.split(" - ");
  if (parts.length === 2) {
    const formatDateStr = (s: string) => {
      const d = new Date(s.trim());
      if (isNaN(d.getTime())) return s.trim();
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    };
    return `${formatDateStr(parts[0])} → ${formatDateStr(parts[1])}`;
  }
  return dateStr;
}

export default function TripsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [tripsList, setTripsList] = useState<TripItem[]>(MOCK_TRIPS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    bookingsService
      .getTrips()
      .then((data) => {
        if (!isMounted) return;
        const apiTrips = Array.isArray(data) ? data : (data as any)?.results || [];
        if (apiTrips.length > 0) {
          const transformed: TripItem[] = apiTrips.map((item: ApiTrip) => ({
            id: item.reference || item.id,
            reference: item.reference,
            vehicle: item.vehicle || "Vehicle",
            dates: formatTripDates(item.booking_date),
            pickup: item.location ? `Pick up: ${item.location}` : "Pick up: Murtala Muhammed Airport",
            status: formatTripStatus(item.status),
            mode: item.drive_type?.toLowerCase().includes("chauffeur") ? "Chauffeur Service" : "Drive Yourself",
            readyForPickup: Boolean(item.ready_for_pickup),
            code: item.pickup_code || "444444"
          }));
          setTripsList(transformed);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch trips from API, falling back to mocks:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTrips = tripsList.filter((t) =>
    t.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusClass = (status: TripItem["status"]) => {
    switch (status) {
      case "Scheduled":
        return styles.scheduled;
      case "Ongoing":
        return styles.ongoing;
      case "Completed":
        return styles.completed;
      case "Cancelled":
        return styles.cancelled;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      {/* Search & Filter Top Control Row */}
      <div className={styles.searchFilterRow}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Trips"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={styles.filterBtn}
          onClick={() => setIsFilterOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </button>
      </div>

      {/* Trips Cards List */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.tripsList}>
          {filteredTrips.map((trip) => (
            <div key={trip.id} className={styles.tripCardWrap}>
              <Link
                href={`/customer/trips/${trip.reference || trip.id}`}
                className={styles.tripCard}
              >
                <div className={styles.tripMain}>
                  <div className={styles.titleWithBadge}>
                    <h3 className={styles.vehicleTitle}>{trip.vehicle}</h3>
                    {trip.readyForPickup && (
                      <span className={styles.readyBadge}>Ready For Pickup</span>
                    )}
                  </div>
                  <p className={styles.tripDates}>{trip.dates}</p>
                  <p className={styles.pickupLoc}>
                    {trip.pickup} &nbsp;<span className={styles.modeInline}>{trip.mode}</span>
                  </p>
                </div>

                <div className={styles.tripMeta}>
                  {trip.readyForPickup ? (
                    <div className={styles.pickupCodeCol}>
                      <span className={styles.pickupCodeLabel}>Pick Up Code</span>
                      <div className={styles.pickupCodeBoxes}>
                        {trip.code?.split("").map((c, i) => (
                          <span key={i} className={styles.codeDigit}>{c}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className={`${styles.statusBadge} ${getStatusClass(trip.status)}`}>
                        {trip.status}
                      </span>
                      <span className={styles.modeText}>{trip.mode}</span>
                    </>
                  )}
                </div>
              </Link>

              {trip.readyForPickup && (
                <div className={styles.uploadBarRow}>
                  <button
                    type="button"
                    className={styles.uploadVehicleBtn}
                    onClick={() => setIsPickupModalOpen(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 16a4 4 0 01-.88-7.9 5 5 0 019.76-1.55 4 4 0 011.89 7.74M12 12v9m0-9l-3 3m3-3l3 3" />
                    </svg>
                    Upload Image Of Vehicle
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <TripFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
      />

      <ReadyForPickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onSubmit={() => setIsPickupModalOpen(false)}
      />
    </div>
  );
}