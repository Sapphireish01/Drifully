"use client";

import React, { useState, useEffect } from "react";
import { TripFilters } from "@/services/bookings-service";
import styles from "./TripFilterModal.module.css";

interface TripFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: TripFilters) => void;
  initialFilters?: TripFilters;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun",
  "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec"
];

const VEHICLE_TYPES = [
  { value: "", label: "All Vehicle Types" },
  { value: "Sedan", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "Coupe", label: "Coupe" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Convertible", label: "Convertible" },
  { value: "Truck", label: "Truck" },
  { value: "Van", label: "Van" },
  { value: "Luxury", label: "Luxury" },
  { value: "Electric", label: "Electric" },
];

export default function TripFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: TripFilterModalProps) {
  const [activeTab, setActiveTab] = useState<"date" | "status" | "vehicle_type" | "drive_type">("date");

  // Filter states
  const [startDate, setStartDate] = useState<string>(initialFilters?.start_date || "");
  const [endDate, setEndDate] = useState<string>(initialFilters?.end_date || "");
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilters?.status || "");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(initialFilters?.vehicle_type || "");
  const [selectedDriveType, setSelectedDriveType] = useState<string>(initialFilters?.drive_type || "");

  // Month-Year Picker Helpers
  const [pickupYear, setPickupYear] = useState<number>(() => {
    if (initialFilters?.start_date) {
      const parsed = new Date(initialFilters.start_date);
      if (!isNaN(parsed.getFullYear())) return parsed.getFullYear();
    }
    return new Date().getFullYear();
  });

  const [dropoffYear, setDropoffYear] = useState<number>(() => {
    if (initialFilters?.end_date) {
      const parsed = new Date(initialFilters.end_date);
      if (!isNaN(parsed.getFullYear())) return parsed.getFullYear();
    }
    return new Date().getFullYear();
  });

  const [pickupMonthIndex, setPickupMonthIndex] = useState<number>(() => {
    if (initialFilters?.start_date) {
      const parsed = new Date(initialFilters.start_date);
      if (!isNaN(parsed.getMonth())) return parsed.getMonth();
    }
    return new Date().getMonth();
  });

  const [dropoffMonthIndex, setDropoffMonthIndex] = useState<number>(() => {
    if (initialFilters?.end_date) {
      const parsed = new Date(initialFilters.end_date);
      if (!isNaN(parsed.getMonth())) return parsed.getMonth();
    }
    return new Date().getMonth();
  });

  useEffect(() => {
    if (isOpen) {
      setStartDate(initialFilters?.start_date || "");
      setEndDate(initialFilters?.end_date || "");
      setSelectedStatus(initialFilters?.status || "");
      setSelectedVehicleType(initialFilters?.vehicle_type || "");
      setSelectedDriveType(initialFilters?.drive_type || "");
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleSelectPickupMonth = (monthIdx: number) => {
    setPickupMonthIndex(monthIdx);
    const m = String(monthIdx + 1).padStart(2, "0");
    const d = "01";
    setStartDate(`${pickupYear}-${m}-${d}`);
  };

  const handleSelectDropoffMonth = (monthIdx: number) => {
    setDropoffMonthIndex(monthIdx);
    const m = String(monthIdx + 1).padStart(2, "0");
    const lastDay = new Date(dropoffYear, monthIdx + 1, 0).getDate();
    setEndDate(`${dropoffYear}-${m}-${String(lastDay).padStart(2, "0")}`);
  };

  const handleApply = () => {
    const filters: TripFilters = {};
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedVehicleType) filters.vehicle_type = selectedVehicleType;
    if (selectedDriveType) filters.drive_type = selectedDriveType;
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSelectedStatus("");
    setSelectedVehicleType("");
    setSelectedDriveType("");
    onApply({});
    onClose();
  };

  const handleQuickPreset = (preset: "this_month" | "next_month" | "all_time") => {
    const now = new Date();
    if (preset === "this_month") {
      const year = now.getFullYear();
      const month = now.getMonth();
      const first = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const last = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      setStartDate(first);
      setEndDate(last);
      setPickupYear(year);
      setPickupMonthIndex(month);
      setDropoffYear(year);
      setDropoffMonthIndex(month);
    } else if (preset === "next_month") {
      const nextDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const year = nextDate.getFullYear();
      const month = nextDate.getMonth();
      const first = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const last = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      setStartDate(first);
      setEndDate(last);
      setPickupYear(year);
      setPickupMonthIndex(month);
      setDropoffYear(year);
      setDropoffMonthIndex(month);
    } else if (preset === "all_time") {
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        {/* Left Tabs */}
        <div className={styles.sidebar}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "date" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("date")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Date Range</span>
            <span className={styles.chevron}>›</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "vehicle_type" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("vehicle_type")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M5 17h-2v-6l2-5h9l4 5h1v6h-2" />
            </svg>
            <span>Vehicle Type</span>
            <span className={styles.chevron}>›</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "status" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("status")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Status</span>
            <span className={styles.chevron}>›</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "drive_type" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("drive_type")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="3" x2="12" y2="9" />
              <line x1="4.2" y1="16.5" x2="9.4" y2="13.5" />
              <line x1="19.8" y1="16.5" x2="14.6" y2="13.5" />
            </svg>
            <span>Drive Mode</span>
            <span className={styles.chevron}>›</span>
          </button>
        </div>

        {/* Right Content Panel */}
        <div className={styles.mainContent}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              {activeTab === "date" && (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h3 className={styles.panelTitle}>Filter by Date Range</h3>
                </>
              )}
              {activeTab === "vehicle_type" && (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M5 17h-2v-6l2-5h9l4 5h1v6h-2" />
                  </svg>
                  <h3 className={styles.panelTitle}>Filter by Vehicle Type</h3>
                </>
              )}
              {activeTab === "status" && (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3 className={styles.panelTitle}>Filter by Status</h3>
                </>
              )}
              {activeTab === "drive_type" && (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <h3 className={styles.panelTitle}>Filter by Drive Mode</h3>
                </>
              )}
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* TAB 1: DATE */}
          {activeTab === "date" && (
            <div className={styles.tabPane}>
              {/* Quick Presets */}
              <div className={styles.presetRow}>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => handleQuickPreset("this_month")}
                >
                  This Month
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => handleQuickPreset("next_month")}
                >
                  Next Month
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => handleQuickPreset("all_time")}
                >
                  All Dates
                </button>
              </div>

              <div className={styles.datePickerGrid}>
                {/* Pick Up (Start Date) */}
                <div className={styles.pickerCol}>
                  <label className={styles.colLabel}>Start Date (Pick Up)</label>
                  <input
                    type="date"
                    className={styles.dateInputField}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (e.target.value) {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getFullYear())) {
                          setPickupYear(d.getFullYear());
                          setPickupMonthIndex(d.getMonth());
                        }
                      }
                    }}
                  />

                  <div className={styles.yearNav}>
                    <button
                      type="button"
                      className={styles.navArrow}
                      onClick={() => setPickupYear((y) => y - 1)}
                    >
                      ‹
                    </button>
                    <strong>{pickupYear}</strong>
                    <button
                      type="button"
                      className={styles.navArrow}
                      onClick={() => setPickupYear((y) => y + 1)}
                    >
                      ›
                    </button>
                  </div>

                  <div className={styles.monthsGrid}>
                    {MONTH_NAMES.map((m, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`${styles.monthCell} ${
                          idx === pickupMonthIndex ? styles.selectedMonth : ""
                        }`}
                        onClick={() => handleSelectPickupMonth(idx)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drop Off (End Date) */}
                <div className={styles.pickerCol}>
                  <label className={styles.colLabel}>End Date (Drop Off)</label>
                  <input
                    type="date"
                    className={styles.dateInputField}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (e.target.value) {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getFullYear())) {
                          setDropoffYear(d.getFullYear());
                          setDropoffMonthIndex(d.getMonth());
                        }
                      }
                    }}
                  />

                  <div className={styles.yearNav}>
                    <button
                      type="button"
                      className={styles.navArrow}
                      onClick={() => setDropoffYear((y) => y - 1)}
                    >
                      ‹
                    </button>
                    <strong>{dropoffYear}</strong>
                    <button
                      type="button"
                      className={styles.navArrow}
                      onClick={() => setDropoffYear((y) => y + 1)}
                    >
                      ›
                    </button>
                  </div>

                  <div className={styles.monthsGrid}>
                    {MONTH_NAMES.map((m, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`${styles.monthCell} ${
                          idx === dropoffMonthIndex ? styles.selectedMonth : ""
                        }`}
                        onClick={() => handleSelectDropoffMonth(idx)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VEHICLE TYPE */}
          {activeTab === "vehicle_type" && (
            <div className={styles.tabPane}>
              <p className={styles.subtext}>Filter bookings by vehicle type</p>
              <div className={styles.optionsList}>
                {VEHICLE_TYPES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`${styles.optionItem} ${
                      selectedVehicleType === item.value ? styles.optionSelected : ""
                    }`}
                    onClick={() => setSelectedVehicleType(item.value)}
                  >
                    <span>{item.label}</span>
                    {selectedVehicleType === item.value && (
                      <span className={styles.checkMark}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STATUS */}
          {activeTab === "status" && (
            <div className={styles.tabPane}>
              <p className={styles.subtext}>Filter bookings by their current status</p>
              <div className={styles.optionsList}>
                {[
                  { value: "", label: "All Statuses" },
                  { value: "completed", label: "Completed" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "scheduled", label: "Scheduled" },
                  { value: "ongoing", label: "Ongoing" },
                  { value: "cancelled", label: "Cancelled" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`${styles.optionItem} ${
                      selectedStatus === item.value ? styles.optionSelected : ""
                    }`}
                    onClick={() => setSelectedStatus(item.value)}
                  >
                    <span>{item.label}</span>
                    {selectedStatus === item.value && (
                      <span className={styles.checkMark}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DRIVE TYPE */}
          {activeTab === "drive_type" && (
            <div className={styles.tabPane}>
              <p className={styles.subtext}>Filter bookings by driving mode</p>
              <div className={styles.optionsList}>
                {[
                  { value: "", label: "All Drive Modes" },
                  { value: "Drive Yourself", label: "Drive Yourself" },
                  { value: "Chauffeur Service", label: "Chauffeur Service" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`${styles.optionItem} ${
                      selectedDriveType === item.value ? styles.optionSelected : ""
                    }`}
                    onClick={() => setSelectedDriveType(item.value)}
                  >
                    <span>{item.label}</span>
                    {selectedDriveType === item.value && (
                      <span className={styles.checkMark}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className={styles.footer}>
            <button type="button" className={styles.clearBtn} onClick={handleClear}>
              Reset Filters
            </button>
            <button type="button" className={styles.applyBtn} onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
