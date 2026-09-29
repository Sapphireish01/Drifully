"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./DatePickerModal.module.css";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate?: (date: string) => void;
  minDate?: string | Date;
  selectedDate?: string;
}

export default function DatePickerModal({
  isOpen,
  onClose,
  onSelectDate,
  minDate,
  selectedDate,
}: DatePickerModalProps) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const minDateObj = useMemo(() => {
    if (!minDate) return null;
    const d = new Date(minDate);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }, [minDate]);

  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        const parts = selectedDate.split("-");
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(day)) {
            setCurrentYear(y);
            setCurrentMonthIndex(m);
            setSelectedDay(day);
            return;
          }
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const baseDate = minDateObj && minDateObj.getTime() > today.getTime() ? minDateObj : today;
      setCurrentYear(baseDate.getFullYear());
      setCurrentMonthIndex(baseDate.getMonth());
      setSelectedDay(null);
    }
  }, [isOpen, selectedDate, minDateObj]);

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

  const isDayDisabled = (day: number) => {
    if (!minDateObj) return false;
    const targetDate = new Date(currentYear, currentMonthIndex, day, 0, 0, 0, 0);
    return targetDate.getTime() < minDateObj.getTime();
  };

  const isPrevMonthDisabled = useMemo(() => {
    if (!minDateObj) return false;
    const prevMonthLastDay = new Date(currentYear, currentMonthIndex, 0, 23, 59, 59, 999);
    return prevMonthLastDay.getTime() < minDateObj.getTime();
  }, [currentYear, currentMonthIndex, minDateObj]);

  const handleContinue = () => {
    if (selectedDay && onSelectDate && !isDayDisabled(selectedDay)) {
      const formattedMonth = String(currentMonthIndex + 1).padStart(2, "0");
      const formattedDay = String(selectedDay).padStart(2, "0");
      const isoDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
      onSelectDate(isoDateStr);
      onClose();
    }
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
    if (isPrevMonthDisabled) return;
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.dropdowns}>
            <button
              type="button"
              className={`${styles.selectBtn} ${isPrevMonthDisabled ? styles.disabledNavBtn : ""}`}
              onClick={handlePrevMonth}
              disabled={isPrevMonthDisabled}
              title={isPrevMonthDisabled ? "Previous dates are unavailable" : "Previous Month"}
            >
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
            {daysInMonth.map((day) => {
              const disabled = isDayDisabled(day);
              const isSelected = selectedDay === day && !disabled;
              return (
                <button
                  key={day}
                  type="button"
                  className={`${styles.dayBtn} ${isSelected ? styles.selected : ""} ${disabled ? styles.disabledDay : ""}`}
                  onClick={() => {
                    if (!disabled) {
                      setSelectedDay(day);
                    }
                  }}
                  disabled={disabled}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.clearBtn} onClick={() => setSelectedDay(null)}>
            Clear
          </button>
          <button
            type="button"
            className={`${styles.continueBtn} ${selectedDay && !isDayDisabled(selectedDay) ? styles.activeContinue : ""}`}
            onClick={handleContinue}
            disabled={!selectedDay || isDayDisabled(selectedDay)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
