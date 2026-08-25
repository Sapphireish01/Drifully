import React, { useState } from "react";
import styles from "./DatePickerModal.module.css";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate?: (date: string) => void;
}

export default function DatePickerModal({ isOpen, onClose, onSelectDate }: DatePickerModalProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  if (!isOpen) return null;

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleContinue = () => {
    if (selectedDay && onSelectDate) {
      onSelectDate(`${selectedDay} Sept 2025`);
    }
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.dropdowns}>
            <button type="button" className={styles.selectBtn}>
              SEPT <span>›</span>
            </button>
            <button type="button" className={styles.selectBtn}>
              2025 <span>›</span>
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
            <span className={styles.prevMonthDay}>30</span>
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
            <span className={styles.nextMonthDay}>1</span>
            <span className={styles.nextMonthDay}>2</span>
            <span className={styles.nextMonthDay}>3</span>
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
