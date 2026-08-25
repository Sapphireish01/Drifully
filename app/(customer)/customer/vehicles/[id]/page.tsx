"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import DatePickerModal from "@/components/customer/DatePickerModal";
import RentalModeModal from "@/components/customer/RentalModeModal";
import UploadDocumentsModal from "@/components/customer/UploadDocumentsModal";
import EnhanceTripModal from "@/components/customer/EnhanceTripModal";
import ReviewBookingModal from "@/components/customer/ReviewBookingModal";
import PaymentMethodModal from "@/components/customer/PaymentMethodModal";
import BookingConfirmedModal from "@/components/customer/BookingConfirmedModal";
import VehicleGalleryModal from "@/components/customer/VehicleGalleryModal";
import { VEHICLES } from "@/data/vehicles";
import styles from "./VehicleDetailPage.module.css";

export default function VehicleDetailPage() {
  const params = useParams();
  const idStr = params.id as string;
  const vehicleId = parseInt(idStr, 10);

  const vehicle = VEHICLES.find((v) => v.id === vehicleId) || VEHICLES[0];

  const [pickupDate, setPickupDate] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");
  const [activeDateTarget, setActiveDateTarget] = useState<"pickup" | "dropoff" | null>(null);

  // Booking Flow Steps State:
  // 1: RentalModeModal ("Start Your Journey")
  // 2: UploadDocumentsModal ("Upload Your Documents")
  // 3: EnhanceTripModal ("Enhance Your Trip")
  // 4: ReviewBookingModal ("Review Your Booking")
  // 5: VehicleGalleryModal ("Vehicle Gallery / Confirm & Pay")
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [selectedRentalMode, setSelectedRentalMode] = useState<"self" | "chauffeur">("self");

  const [showWarning, setShowWarning] = useState(false);
  const [isAvailableChecked, setIsAvailableChecked] = useState(false);

  const handleOpenDatePicker = (target: "pickup" | "dropoff") => {
    setActiveDateTarget(target);
  };

  const handleSelectDate = (date: string) => {
    if (activeDateTarget === "pickup") {
      setPickupDate(date);
    } else if (activeDateTarget === "dropoff") {
      setDropOffDate(date);
    }
    setShowWarning(false);
    setIsAvailableChecked(false);
  };

  const handleCheckAvailability = () => {
    if (!pickupDate || !dropOffDate) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    setIsAvailableChecked(true);
  };

  const handleBookNow = () => {
    if (!pickupDate || !dropOffDate) {
      setShowWarning(true);
    } else {
      setBookingStep(1);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <Link href="/customer" className={styles.backBtn} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <div>
          <h1 className={styles.title}>{vehicle.name}</h1>
          <div className={styles.ratingRow}>
            <span className={styles.star}>★</span>
            <span className={styles.rating}>{vehicle.rating}</span>
            <span className={styles.reviewsCount}>({vehicle.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Main Photo + Right 4-Image Grid & Booking Widget */}
      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          {/* Main Photo Hero */}
          <div className={styles.mainPhotoHero}>
            <Image src={vehicle.gallery[0]} alt={vehicle.name} fill className={styles.img} priority />
          </div>

          {/* Specs Chips */}
          <div className={styles.chipsRow}>
            <span className={styles.chip}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {vehicle.capacity} Seats
            </span>
            <span className={styles.chip}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-6l2-5h9l4 5h1v6h-2" />
              </svg>
              {vehicle.type}
            </span>
            <span className={styles.chip}>{vehicle.transmission}</span>
            <span className={styles.chip}>{vehicle.fuel}</span>
          </div>

          {/* Features Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Features</h2>
            <div className={styles.featuresGrid}>
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Reviews</h2>
            <div className={styles.reviewsList}>
              {vehicle.reviews.length > 0 ? (
                vehicle.reviews.map((rev) => (
                  <div key={rev.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewTitle}>{rev.title}</span>
                      <div className={styles.reviewStars}>
                        {"★".repeat(Math.floor(rev.rating))}
                      </div>
                    </div>
                    <p className={styles.reviewComment}>{rev.comment}</p>
                    <div className={styles.reviewerMeta}>
                      <div className={styles.avatar}>{rev.author.substring(0, 2).toUpperCase()}</div>
                      <div>
                        <div className={styles.authorName}>{rev.author}</div>
                        <div className={styles.reviewDate}>{rev.date}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewTitle}>Wonderful Experience</span>
                    <div className={styles.reviewStars}>★★★★★</div>
                  </div>
                  <p className={styles.reviewComment}>
                    I had a wonderful experience with this vehicle. It was clean, comfortable, and drove perfectly throughout my trip.
                  </p>
                  <div className={styles.reviewerMeta}>
                    <div className={styles.avatar}>SS</div>
                    <div>
                      <div className={styles.authorName}>Sandra Smith</div>
                      <div className={styles.reviewDate}>30 April 2026</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar Widget */}
        <div className={styles.rightSidebar}>
          {/* Collage 4 sub-photos directly over Plan Ahead card */}
          <div className={styles.subPhotosCollage}>
            {vehicle.gallery.slice(1, 5).map((imgUrl, i) => (
              <div key={i} className={styles.subPhoto}>
                <Image src={imgUrl} alt={`${vehicle.name} preview ${i + 1}`} fill className={styles.img} />
              </div>
            ))}
          </div>

          <div className={styles.bookingCard}>
            <h3 className={styles.bookingTitle}>Plan Ahead</h3>
            <p className={styles.bookingSubtitle}>Enter your pick up and drop of dates</p>

            <div className={styles.dateFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Pickup Date</label>
                <div className={styles.dateInputWrap} onClick={() => handleOpenDatePicker("pickup")}>
                  <input
                    type="text"
                    className={styles.dateInput}
                    placeholder="e.g 24 Mar 2026"
                    value={pickupDate}
                    readOnly
                  />
                  <svg className={styles.calIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Drop Off Date</label>
                <div className={styles.dateInputWrap} onClick={() => handleOpenDatePicker("dropoff")}>
                  <input
                    type="text"
                    className={styles.dateInput}
                    placeholder="e.g 24 Mar 2026"
                    value={dropOffDate}
                    readOnly
                  />
                  <svg className={styles.calIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
            </div>

            {isAvailableChecked && (
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total amount before taxes</span>
                <span className={styles.totalAmount}>₦36,000</span>
              </div>
            )}

            <button
              type="button"
              className={`${styles.checkBtn} ${pickupDate && dropOffDate ? styles.activeCheckBtn : ""}`}
              onClick={handleCheckAvailability}
            >
              Check Availability
            </button>

            {isAvailableChecked && (
              <div className={styles.availabilityBanner}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#176448"/>
                </svg>
                <span>Great news — this vehicle is available for your selected dates.</span>
              </div>
            )}
          </div>

          <div className={styles.priceCard}>
            <div className={styles.priceHeader}>
              <div>
                <span className={styles.priceAmount}>${vehicle.price}</span>
                <span className={styles.priceUnit}>/day</span>
              </div>
              <span className={styles.taxText}>Before taxes</span>
            </div>

            <button
              type="button"
              className={`${styles.bookNowBtn} ${isAvailableChecked || (pickupDate && dropOffDate) ? styles.activeBookNowBtn : ""}`}
              onClick={handleBookNow}
            >
              Book Now
            </button>

            {showWarning && <p className={styles.warningText}>Please select dates</p>}
          </div>
        </div>
      </div>

      <DatePickerModal
        isOpen={activeDateTarget !== null}
        onClose={() => setActiveDateTarget(null)}
        onSelectDate={handleSelectDate}
      />

      {/* Step 1: Start Your Journey (Rental Mode Modal) */}
      <RentalModeModal
        isOpen={bookingStep === 1}
        onClose={() => setBookingStep(0)}
        onSelectMode={(mode) => {
          setSelectedRentalMode(mode);
          setBookingStep(2);
        }}
      />

      {/* Step 2: Upload Your Documents */}
      <UploadDocumentsModal
        isOpen={bookingStep === 2}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(1)}
        onContinue={() => setBookingStep(3)}
      />

      {/* Step 3: Enhance Your Trip */}
      <EnhanceTripModal
        isOpen={bookingStep === 3}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(2)}
        onContinue={() => setBookingStep(4)}
      />

      {/* Step 4: Review Your Booking */}
      <ReviewBookingModal
        isOpen={bookingStep === 4}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(3)}
        onConfirm={() => setBookingStep(5)}
        vehicle={vehicle}
        pickupDate={pickupDate}
        dropOffDate={dropOffDate}
        selectedMode={selectedRentalMode}
      />

      {/* Step 5: Choose a Payment Method */}
      <PaymentMethodModal
        isOpen={bookingStep === 5}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(4)}
        onConfirm={() => setBookingStep(6)}
      />

      {/* Step 6: Booking Confirmed 🎉 */}
      <BookingConfirmedModal
        isOpen={bookingStep === 6}
        onClose={() => setBookingStep(0)}
        vehicle={vehicle}
        pickupDate={pickupDate}
        dropOffDate={dropOffDate}
        selectedMode={selectedRentalMode}
      />
    </div>
  );
}

