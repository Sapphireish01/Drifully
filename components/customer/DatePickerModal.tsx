"use client";

import React, { useEffect, useState } from "react";
import styles from "./DatePickerModal.module.css";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate?: (date: string) => void;
}

export default function DatePickerModal({ isOpen, onClose, onSelectDate }: DatePickerModalProps) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setCurrentYear(today.getFullYear());
      setCurrentMonthIndex(today.getMonth());
      setSelectedDay(today.getDate());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const monthNamesShort = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];
  const monthNamesLong = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const totalDaysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // Get weekday offset for the 1st of the month (0 = Sunday, 1 = Monday...)
  const firstDayWeekday = new Date(currentYear, currentMonthIndex, 1).getDay();
  // Adjust so Monday is 0 (Mon=0, Tue=1 ... Sun=6)
  const startingOffset = (firstDayWeekday + 6) % 7;

  // Previous month trailing days
  const prevMonthTotalDays = new Date(currentYear, currentMonthIndex, 0).getDate();
  const prevMonthDays = Array.from({ length: startingOffset }, (_, i) => prevMonthTotalDays - startingOffset + i + 1);

  const handleContinue = () => {
    if (selectedDay && onSelectDate) {
      const monthStr = monthNamesLong[currentMonthIndex];
      // Format as "YYYY-MM-DD" or standard date string
      const formattedMonth = String(currentMonthIndex + 1).padStart(2, "0");
      const formattedDay = String(selectedDay).padStart(2, "0");
      const isoDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
      onSelectDate(isoDateStr);
    }
    onClose();
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
    setSelectedDay(null);
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.dropdowns}>
            <button type="button" className={styles.selectBtn} onClick={handlePrevMonth} title="Previous Month">
              ‹
            </button>
            <button type="button" className={styles.selectBtn}>
              {monthNamesShort[currentMonthIndex]} <span>›</span>
            </button>
            <button type="button" className={styles.selectBtn}>
              {currentYear} <span>›</span>
            </button>
            <button type="button" className={styles.selectBtn} onClick={handleNextMonth} title="Next Month">
              ›
            </button>
          </div>
        </div>

        <div className={styles.calendar}>
          <div className={styles.weekdays}>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THUR</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>

          <div className={styles.daysGrid}>
            {prevMonthDays.map((day) => (
              <span key={`prev-${day}`} className={styles.prevMonthDay}>
                {day}
              </span>
            ))}
            {daysInMonth.map((day) => (
              <button
                key={day}
                type="button"
                className={`${styles.dayBtn} ${selectedDay === day ? styles.selected : ""}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.clearBtn} onClick={() => setSelectedDay(null)}>
            Clear
          </button>
          <button
            type="button"
            className={`${styles.continueBtn} ${selectedDay ? styles.activeContinue : ""}`}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
