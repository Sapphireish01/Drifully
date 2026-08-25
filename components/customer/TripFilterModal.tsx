"use client";

import React, { useState } from "react";
import styles from "./TripFilterModal.module.css";

interface TripFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export default function TripFilterModal({
  isOpen,
  onClose,
  onApply,
}: TripFilterModalProps) {
  const [activeTab, setActiveTab] = useState<"date" | "status" | "type">("date");
  const [selectedPickUpMonth, setSelectedPickUpMonth] = useState("May");
  const [selectedDropOffMonth, setSelectedDropOffMonth] = useState("Feb");

  if (!isOpen) return null;

  const months = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Feb", "Sep",
    "Oct", "Nov", "Dec"
  ];

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
            <span>Date</span>
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
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "type" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("type")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M5 17h-2v-6l2-5h9l4 5h1v6h-2" />
            </svg>
            <span>Vehicle Type</span>
          </button>
        </div>

        {/* Right Content Panel */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3 className={styles.panelTitle}>Date</h3>
            </div>
          </div>

          <div className={styles.datePickerGrid}>
            {/* Pick Up Column */}
            <div className={styles.pickerCol}>
              <label className={styles.colLabel}>Pick Up</label>
              <div className={styles.inputBox}>May, 2024</div>

              <div className={styles.yearNav}>
                <span>‹</span>
                <strong>2024</strong>
                <span>›</span>
              </div>

              <div className={styles.monthsGrid}>
                {months.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.monthCell} ${
                      m === selectedPickUpMonth ? styles.selectedMonth : ""
                    }`}
                    onClick={() => setSelectedPickUpMonth(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Off Column */}
            <div className={styles.pickerCol}>
              <label className={styles.colLabel}>Drop Off</label>
              <div className={styles.inputBox}>Feb, 2025</div>

              <div className={styles.yearNav}>
                <span>‹</span>
                <strong>2025</strong>
                <span>›</span>
              </div>

              <div className={styles.monthsGrid}>
                {months.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.monthCell} ${
                      m === selectedDropOffMonth ? styles.selectedMonth : ""
                    }`}
                    onClick={() => setSelectedDropOffMonth(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.footer}>
            <button type="button" className={styles.clearBtn} onClick={onClose}>
              Clear
            </button>
            <button type="button" className={styles.applyBtn} onClick={onApply}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
