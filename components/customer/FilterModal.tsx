import React, { useState } from "react";
import styles from "./FilterModal.module.css";

const VEHICLE_TYPES = [
  { label: "Sedan", value: "Sedan" },
  { label: "SUV", value: "suv" },
  { label: "Coupe", value: "Coupe" },
  { label: "Hatchback", value: "Hatchback" },
  { label: "Convertible", value: "Convertible" },
  { label: "Truck", value: "Truck" },
  { label: "Van", value: "Van" },
  { label: "Luxury", value: "Luxury" },
  { label: "Electric", value: "Electric" },
];

const FEATURES_LIST = [
  { label: "GPS Navigation", value: "GPS" },
  { label: "Bluetooth", value: "Bluetooth" },
  { label: "Air Conditioning", value: "Air Conditioning" },
  { label: "Backup Camera", value: "Backup Camera" },
  { label: "Heated Seats", value: "Heated Seats" },
  { label: "Sunroof", value: "Sunroof" },
  { label: "Leather Seats", value: "Leather Seats" },
  { label: "Cruise Control", value: "Cruise Control" },
  { label: "Child Seat", value: "Child Seat" },
  { label: "USB Port", value: "USB Port" },
];

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: {
    min_price?: string;
    max_price?: string;
    vehicle_type?: string[];
    features?: string[];
  }) => void;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialVehicleTypes?: string[];
  initialFeatures?: string[];
}

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialMinPrice = "",
  initialMaxPrice = "",
  initialVehicleTypes = [],
  initialFeatures = [],
}: FilterModalProps) {
  const [activeTab, setActiveTab] = useState<"price" | "vehicle" | "features">("price");
  const [minPrice, setMinPrice] = useState(initialMinPrice ? `₦${initialMinPrice}` : "");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ? `₦${initialMaxPrice}` : "");
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>(initialVehicleTypes);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures);

  if (!isOpen) return null;

  const presets = ["1,000", "2,500", "3,000", "5,000", "10,000", "20,000", "50,000", "100,000"];

  const toggleVehicleType = (typeValue: string) => {
    setSelectedVehicleTypes((prev) =>
      prev.includes(typeValue) ? prev.filter((t) => t !== typeValue) : [...prev, typeValue]
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleApply = () => {
    const cleanMin = minPrice.replace(/[^0-9.]/g, "");
    const cleanMax = maxPrice.replace(/[^0-9.]/g, "");
    if (onApply) {
      onApply({
        min_price: cleanMin || undefined,
        max_price: cleanMax || undefined,
        vehicle_type: selectedVehicleTypes.length > 0 ? selectedVehicleTypes : undefined,
        features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
      });
    }
    onClose();
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedVehicleTypes([]);
    setSelectedFeatures([]);
    if (onApply) {
      onApply({
        min_price: undefined,
        max_price: undefined,
        vehicle_type: undefined,
        features: undefined,
      });
    }
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <div className={styles.sidebar}>
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
              {selectedVehicleTypes.length > 0 && (
                <span style={{ fontSize: "11px", fontWeight: 700, marginLeft: "auto", color: "#2563eb" }}>
                  ({selectedVehicleTypes.length})
                </span>
              )}
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
              {selectedFeatures.length > 0 && (
                <span style={{ fontSize: "11px", fontWeight: 700, marginLeft: "auto", color: "#2563eb" }}>
                  ({selectedFeatures.length})
                </span>
              )}
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
                      placeholder="e.g. 1000"
                    />
                    <div className={styles.presetGrid}>
                      {presets.map((val) => (
                        <button
                          key={`min-${val}`}
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setMinPrice(`₦${val}`)}
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
                      placeholder="e.g. 3000"
                    />
                    <div className={styles.presetGrid}>
                      {presets.map((val) => (
                        <button
                          key={`max-${val}`}
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setMaxPrice(`₦${val}`)}
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
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {activeTab === "vehicle" && (
              <div className={styles.placeholderTab}>
                <div className={styles.header}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M5 17h-2v-6l2-5h9l4 5h1v6h-2" />
                  </svg>
                  <h2>Vehicle Type</h2>
                </div>

                <div className={styles.typeGrid}>
                  {VEHICLE_TYPES.map((type) => {
                    const isSelected = selectedVehicleTypes.includes(type.value);
                    return (
                      <button
                        key={type.value}
                        type="button"
                        className={`${styles.typeCard} ${isSelected ? styles.typeCardActive : ""}`}
                        onClick={() => toggleVehicleType(type.value)}
                      >
                        <span>{type.label}</span>
                        <span className={styles.typeCheck}>{isSelected ? "✓" : ""}</span>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.actions}>
                  <button type="button" className={styles.clearBtn} onClick={handleClear}>
                    Clear
                  </button>
                  <button type="button" className={styles.applyBtn} onClick={handleApply}>
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div className={styles.placeholderTab}>
                <div className={styles.header}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <h2>Vehicle Features</h2>
                </div>

                <div className={styles.featuresGrid}>
                  {FEATURES_LIST.map((feat) => {
                    const isSelected = selectedFeatures.includes(feat.value);
                    return (
                      <button
                        key={feat.value}
                        type="button"
                        className={`${styles.featureChip} ${isSelected ? styles.featureChipActive : ""}`}
                        onClick={() => toggleFeature(feat.value)}
                      >
                        <span>{isSelected ? "✓ " : "+ "}</span>
                        {feat.label}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.actions}>
                  <button type="button" className={styles.clearBtn} onClick={handleClear}>
                    Clear
                  </button>
                  <button type="button" className={styles.applyBtn} onClick={handleApply}>
                    Apply Filters
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
