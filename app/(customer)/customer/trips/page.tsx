"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { bookingsService, ApiTrip, TripFilters } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import TripFilterModal from "@/components/customer/TripFilterModal";
import ReadyForPickupModal from "@/components/customer/ReadyForPickupModal";
import FilterIcon from "@/components/icons/FilterIcon";
import styles from "./TripsPage.module.css";

interface TripItem {
  id: string;
  reference?: string;
  vehicle: string;
  dates: string;
  pickup: string;
  status: string;
  statusColor?: string;
  mode: string;
  readyForPickup?: boolean;
  code?: string;
}

const MOCK_TRIPS: TripItem[] = [
  {
    id: "DRF-2047",
    reference: "BK-57MRDG04",
    vehicle: "Lamborghini Gallardo LP 570-4",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Scheduled",
    statusColor: "#2563eb",
    mode: "Drive Yourself",
    readyForPickup: true,
    code: "444444",
  },
  {
    id: "DRF-2048",
    reference: "BK-82NVKL19",
    vehicle: "Lamborghini Gallardo LP 570-4",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Scheduled",
    statusColor: "#2563eb",
    mode: "Drive Yourself",
  },
  {
    id: "DRF-2049",
    reference: "BK-19PQRS33",
    vehicle: "Cadillac Fleetwood Seventy-Five",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Ongoing",
    statusColor: "#ea580c",
    mode: "Chauffeur Service",
  },
  {
    id: "DRF-2050",
    reference: "BK-44TUVW78",
    vehicle: "Nissan Titan XD Crew Cab",
    dates: "30 Mar 2026 → 25 May 2026",
    pickup: "Pick up: Murtala Muhammed Airport",
    status: "Completed",
    statusColor: "#16a34a",
    mode: "Drive Yourself",
  },
];

function formatTripStatus(statusStr?: string): string {
  if (!statusStr) return "Confirmed";
  const lower = statusStr.toLowerCase();
  if (lower === "confirmed") return "Confirmed";
  if (lower === "completed" || lower.includes("complete") || lower.includes("done")) return "Completed";
  if (lower === "ongoing" || lower.includes("active") || lower.includes("in_progress")) return "Ongoing";
  if (lower === "cancelled" || lower.includes("cancel")) return "Cancelled";
  if (lower === "scheduled" || lower.includes("pending")) return "Scheduled";
  return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
}

function formatTripDates(dateStr?: string): string {
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
  const [appliedFilters, setAppliedFilters] = useState<TripFilters>({});
  const [tripsList, setTripsList] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTrips = useCallback(async (filters: TripFilters) => {
    setIsLoading(true);
    try {
      const data = await bookingsService.getTrips(filters);
      const apiTrips = Array.isArray(data) ? data : (data as any)?.results || [];
      if (apiTrips.length > 0) {
        const transformed: TripItem[] = apiTrips.map((item: ApiTrip) => ({
          id: item.id || item.reference,
          reference: item.reference,
          vehicle: item.vehicle || "Vehicle",
          dates: formatTripDates(item.booking_date),
          pickup: item.location ? `Pick up: ${item.location}` : "Pick up: Murtala Muhammed Airport",
          status: formatTripStatus(item.status),
          statusColor: item.status_color,
          mode: item.drive_type?.toLowerCase().includes("chauffeur") ? "Chauffeur Service" : "Drive Yourself",
          readyForPickup: Boolean(item.ready_for_pickup),
          code: item.pickup_code || "444444"
        }));
        setTripsList(transformed);
      } else {
        // If filters are active and no backend results, show empty list.
        // If no filters are active, show empty list as well (or mock if fresh dev setup)
        const hasFilters = Boolean(filters.start_date || filters.end_date || filters.status || filters.drive_type);
        setTripsList(hasFilters ? [] : MOCK_TRIPS);
      }
    } catch (err) {
      console.error("Failed to fetch trips from API, falling back to mocks:", err);
      setTripsList(MOCK_TRIPS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips(appliedFilters);
  }, [appliedFilters, fetchTrips]);

  const activeFiltersCount = [
    Boolean(appliedFilters.start_date || appliedFilters.end_date),
    Boolean(appliedFilters.status),
    Boolean(appliedFilters.vehicle_type),
    Boolean(appliedFilters.drive_type),
  ].filter(Boolean).length;

  const handleRemoveDateFilter = () => {
    setAppliedFilters((prev) => {
      const next = { ...prev };
      delete next.start_date;
      delete next.end_date;
      return next;
    });
  };

  const handleRemoveVehicleTypeFilter = () => {
    setAppliedFilters((prev) => {
      const next = { ...prev };
      delete next.vehicle_type;
      return next;
    });
  };

  const handleRemoveStatusFilter = () => {
    setAppliedFilters((prev) => {
      const next = { ...prev };
      delete next.status;
      return next;
    });
  };

  const handleRemoveTypeFilter = () => {
    setAppliedFilters((prev) => {
      const next = { ...prev };
      delete next.drive_type;
      return next;
    });
  };

  const handleClearAllFilters = () => {
    setAppliedFilters({});
    setSearchTerm("");
  };

  const filteredTrips = tripsList.filter((t) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      t.vehicle.toLowerCase().includes(term) ||
      (t.reference && t.reference.toLowerCase().includes(term)) ||
      t.status.toLowerCase().includes(term) ||
      t.mode.toLowerCase().includes(term)
    );
  });

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === "confirmed") return styles.confirmed;
    if (s === "scheduled") return styles.scheduled;
    if (s === "ongoing") return styles.ongoing;
    if (s === "completed") return styles.completed;
    if (s === "cancelled") return styles.cancelled;
    return styles.confirmed;
  };

  return (
    <div className={styles.container}>
      {/* Search & Filter Top Control Row */}
      <div className={styles.searchFilterRow}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search trips by vehicle, reference, or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <button
          type="button"
          className={styles.filterBtn}
          onClick={() => setIsFilterOpen(true)}
        >
          <FilterIcon size={20} color={activeFiltersCount > 0 ? "#0f172a" : "#868C98"} />
          Filter
          {activeFiltersCount > 0 && (
            <span className={styles.activeFilterBadge}>{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className={styles.activeFilterChips}>
          {(appliedFilters.start_date || appliedFilters.end_date) && (
            <span className={styles.filterChip}>
              📅 {appliedFilters.start_date || "Start"} → {appliedFilters.end_date || "End"}
              <button
                type="button"
                className={styles.removeChipBtn}
                onClick={handleRemoveDateFilter}
                aria-label="Remove date filter"
              >
                ✕
              </button>
            </span>
          )}

          {appliedFilters.vehicle_type && (
            <span className={styles.filterChip}>
              Vehicle: {appliedFilters.vehicle_type}
              <button
                type="button"
                className={styles.removeChipBtn}
                onClick={handleRemoveVehicleTypeFilter}
                aria-label="Remove vehicle type filter"
              >
                ✕
              </button>
            </span>
          )}

          {appliedFilters.status && (
            <span className={styles.filterChip}>
              Status: {appliedFilters.status}
              <button
                type="button"
                className={styles.removeChipBtn}
                onClick={handleRemoveStatusFilter}
                aria-label="Remove status filter"
              >
                ✕
              </button>
            </span>
          )}

          {appliedFilters.drive_type && (
            <span className={styles.filterChip}>
              Type: {appliedFilters.drive_type.replace("_", " ")}
              <button
                type="button"
                className={styles.removeChipBtn}
                onClick={handleRemoveTypeFilter}
                aria-label="Remove type filter"
              >
                ✕
              </button>
            </span>
          )}

          <button
            type="button"
            className={styles.clearAllFiltersBtn}
            onClick={handleClearAllFilters}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Trips Cards List */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Spinner />
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h3 className={styles.emptyTitle}>No trips found</h3>
          <p className={styles.emptyDesc}>
            {searchTerm || activeFiltersCount > 0
              ? "We couldn't find any trips matching your filters or search query."
              : "You haven't made any bookings yet."}
          </p>
          {(activeFiltersCount > 0 || searchTerm) && (
            <button
              type="button"
              className={styles.resetFiltersBtn}
              onClick={handleClearAllFilters}
            >
              Reset Filters
            </button>
          )}
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
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(trip.status)}`}
                        style={
                          trip.statusColor
                            ? {
                              color: trip.statusColor,
                              borderColor: `${trip.statusColor}50`,
                              backgroundColor: `${trip.statusColor}18`,
                            }
                            : undefined
                        }
                      >
                        {trip.status?.replace(/_/g, " ")}
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
        initialFilters={appliedFilters}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => setAppliedFilters(filters)}
      />

      <ReadyForPickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onSubmit={() => setIsPickupModalOpen(false)}
      />
    </div>
  );
}