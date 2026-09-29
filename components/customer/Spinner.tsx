import React from "react";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

export default function Spinner({ size = 32, color = "#000000", label }: SpinnerProps) {
  return (
    <div className={styles.spinnerContainer}>
      <svg
        className={styles.spinner}
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        style={{ color }}
      >
        <circle
          className={styles.path}
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
