import React, { useState } from "react";
import styles from "./FilterModal.module.css";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
}

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [activeTab, setActiveTab] = useState<"date" | "price" | "vehicle" | "features">("price");
  const [minPrice, setMinPrice] = useState("N40,000");
  const [maxPrice, setMaxPrice] = useState("N200,000");

  if (!isOpen) return null;

  const presets = ["20,000", "30,000", "50,000", "60,000", "90,000", "1,000,000"];

  const handleApply = () => {
    if (onApply) {
      onApply({ minPrice, maxPrice });
    }
    onClose();
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <div className={styles.sidebar}>
            <button
              className={`${styles.tabBtn} ${activeTab === "date" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("date")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Date
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "price" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("price")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              Price Range
              <span className={styles.chevron}>›</span>
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "vehicle" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("vehicle")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2-5h9l4 5h1v6h-2" />
              </svg>
              Vehicle Type
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "features" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("features")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Features
            </button>
          </div>

          <div className={styles.contentArea}>
            {activeTab === "price" && (
              <div className={styles.priceTabContent}>
                <div className={styles.header}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <h2>Price Range</h2>
                </div>

                <div className={styles.columns}>
                  <div className={styles.column}>
                    <label className={styles.label}>Min Price</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <div className={styles.presetGrid}>
                      {presets.map((val) => (
                        <button
                          key={`min-${val}`}
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setMinPrice(`N${val}`)}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.column}>
                    <label className={styles.label}>Max Price</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <div className={styles.presetGrid}>
                      {presets.map((val) => (
                        <button
                          key={`max-${val}`}
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setMaxPrice(`N${val}`)}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button type="button" className={styles.clearBtn} onClick={handleClear}>
                    Clear
                  </button>
                  <button type="button" className={styles.applyBtn} onClick={handleApply}>
                    Apply
                  </button>
                </div>
              </div>
            )}

            {activeTab !== "price" && (
              <div className={styles.placeholderTab}>
                <h2>Filter by {activeTab}</h2>
                <p>Select options below to narrow your vehicle search.</p>
                <div className={styles.actions} style={{ marginTop: "auto" }}>
                  <button type="button" className={styles.clearBtn} onClick={onClose}>
                    Close
                  </button>
                  <button type="button" className={styles.applyBtn} onClick={handleApply}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
