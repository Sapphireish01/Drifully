"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./VehicleGalleryModal.module.css";
import { Vehicle } from "@/data/vehicles";

interface VehicleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: () => void;
  vehicle: Vehicle;
}

export default function VehicleGalleryModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  vehicle,
}: VehicleGalleryModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const gallery = vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery : [vehicle.image];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            {onBack && (
              <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className={styles.title}>{vehicle.name}</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        {/* Carousel Slider */}
        <div className={styles.sliderContainer}>
          <div className={styles.imageWrap}>
            <Image
              src={gallery[currentSlide]}
              alt={vehicle.name}
              fill
              className={styles.img}
              priority
            />
          </div>

          {gallery.length > 1 && (
            <>
              <button type="button" className={styles.prevBtn} onClick={handlePrev} aria-label="Previous image">
                ‹
              </button>
              <button type="button" className={styles.nextBtn} onClick={handleNext} aria-label="Next image">
                ›
              </button>

              <div className={styles.dotsRow}>
                {gallery.map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.dot} ${currentSlide === idx ? styles.activeDot : ""}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Specs Chips */}
        <div className={styles.chipsRow}>
          <span className={styles.chip}>👤 {vehicle.capacity} Seats</span>
          <span className={styles.chip}>🚘 {vehicle.type}</span>
          <span className={styles.chip}>{vehicle.transmission}</span>
          <span className={styles.chip}>{vehicle.fuel}</span>
        </div>

        {/* Features Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Features</h3>
          <div className={styles.featuresGrid}>
            {vehicle.features.map((feat, idx) => (
              <div key={idx} className={styles.featureItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
