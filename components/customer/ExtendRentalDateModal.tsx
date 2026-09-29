"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ExtendRentalDateModal.module.css";

interface ExtendRentalDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (newDate: string) => void;
}

export default function ExtendRentalDateModal({
  isOpen,
  onClose,
  onContinue,
}: ExtendRentalDateModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("30 Mar 2026");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  if (!isOpen) return null;

  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
  ];

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Select New Return Date</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        {/* Current Trip Info / Availability Banner */}
        {isAvailable && selectedDate ? (
          <div className={styles.availableBanner}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#16a34a" />
              <path d="M5 8l2 2 4-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Vehicle is available for extension</span>
          </div>
        ) : (
          <div className={styles.infoBanner}>
            Your current trip ends Monday, 11 May 2025.
          </div>
        )}

        {/* Date Selector Input */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>New Return Date</label>
          <div
            className={styles.dateInputWrap}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <input
              type="text"
              className={styles.dateInput}
              placeholder="Select a new return date"
              value={selectedDate}
              readOnly
            />
            <svg className={styles.calIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        {/* Inline Calendar Grid */}
        {isCalendarOpen && (
          <div className={styles.calendarContainer}>
            <div className={styles.calendarHeader}>
              <div className={styles.dropdownBtn}>SEPT ›</div>
              <div className={styles.dropdownBtn}>2025 ›</div>
            </div>

            <div className={styles.weekDaysGrid}>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THUR</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            <div className={styles.daysGrid}>
              <span className={styles.mutedDay}>30</span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`${styles.dayBtn} ${day === 10 ? styles.selectedDay : ""}`}
                  onClick={() => {
                    setSelectedDate(`${day} Sept 2025`);
                    setIsAvailable(true);
                    setIsCalendarOpen(false);
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actionsRow}>
          <button type="button" className={styles.clearBtn} onClick={() => setSelectedDate("")}>
            Clear
          </button>
          <button
            type="button"
            className={`${styles.continueBtn} ${selectedDate ? styles.activeContinue : ""}`}
            onClick={() => {
              if (selectedDate) onContinue(selectedDate);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
