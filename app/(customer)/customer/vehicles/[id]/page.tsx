"use client";

import React, { useEffect, useState } from "react";
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
import Spinner from "@/components/customer/Spinner";
import { vehiclesService } from "@/services/vehicles-service";
import { bookingsService } from "@/services/bookings-service";
import { paymentsService } from "@/services/payments-service";
import { Vehicle } from "@/data/vehicles";
import styles from "./VehicleDetailPage.module.css";

interface FeatureItem {
  id?: number | string;
  name?: string;
  title?: string;
}

interface ApiReview {
  id: string | number;
  rating: number;
  comment: string;
  user_display?: string;
  author?: string;
  created_at?: string;
}

interface ApiVehicleDetail {
  id: number;
  brand?: number;
  brand_name?: string;
  model?: string;
  year?: number | string;
  category?: string | null;
  category_name?: string;
  price_per_day?: string | number;
  seats?: number;
  transmission?: string;
  fuel_type?: string;
  country?: number;
  region?: number;
  status?: string;
  features?: (number | string | FeatureItem)[];
  reviews?: ApiReview[];
  is_featured?: boolean;
  uploaded_by?: number;
  images?: {
    id: number;
    image: string;
    is_primary?: boolean;
    created_at?: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

function getFeatureIconPath(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes("air condition") || lower.includes("ac")) {
    return "/images/our-fleet/air-conditioner.svg";
  }
  if (lower.includes("bag")) {
    return "/images/our-fleet/air-bag.svg";
  }
  if (lower.includes("anti") || lower.includes("abs") || lower.includes("brak")) {
    return "/images/our-fleet/anti-lock.svg";
  }
  if (lower.includes("bluetooth") || lower.includes("audio") || lower.includes("sound")) {
    return "/images/our-fleet/bluetooth.svg";
  }
  if (lower.includes("climate")) {
    return "/images/our-fleet/climate.svg";
  }
  if (lower.includes("heat") || lower.includes("seat")) {
    return "/images/our-fleet/heated-seats.svg";
  }
  if (lower.includes("navig") || lower.includes("gps") || lower.includes("map")) {
    return "/images/our-fleet/map.svg";
  }
  if (lower.includes("usb") || lower.includes("charg") || lower.includes("port")) {
    return "/images/our-fleet/usb-charging-ports.svg";
  }
  if (lower.includes("fuel") || lower.includes("gas") || lower.includes("petrol")) {
    return "/images/our-fleet/gas-station.svg";
  }

  return "/images/our-fleet/air-conditioner.svg";
}

function resolveFeatureName(f: unknown, allFeatures: FeatureItem[]): string {
  if (typeof f === "string") return f;
  if (typeof f === "number") {
    const matched = allFeatures.find((item) => item.id === f);
    if (matched) return matched.name || matched.title || `Feature #${f}`;
    return `Feature #${f}`;
  }
  if (f && typeof f === "object") {
    const obj = f as { id?: unknown; name?: string; title?: string };
    return obj.name || obj.title || (obj.id ? resolveFeatureName(obj.id, allFeatures) : "Feature");
  }
  return String(f);
}

function transformApiDetailToVehicle(item: ApiVehicleDetail, allFeatures: FeatureItem[] = []): Vehicle {
  const images = item.images || [];
  const primaryObj = images.find((img) => img.is_primary) || images[0];
  const primaryImg = primaryObj?.image || "/images/hero-img.png";
  const gallery = images.map((img) => img.image).filter((img): img is string => Boolean(img));

  const rawPrice = Number(item.price_per_day || 0);
  const formattedPrice = rawPrice > 0 
    ? rawPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : "2,000";

  const brandName = item.brand_name || "";
  const model = item.model || "";
  const year = item.year || "";
  const name = `${brandName} ${model} ${year}`.trim() || `Vehicle #${item.id}`;

  const resolvedFeatures = Array.isArray(item.features) && item.features.length > 0
    ? item.features.map((f) => resolveFeatureName(f, allFeatures))
    : ["Air Conditioning", "Bluetooth", "USB Charging Ports"];

  const mappedReviews = Array.isArray(item.reviews)
    ? item.reviews.map((r) => ({
        id: String(r.id),
        author: r.user_display || r.author || "Anonymous Customer",
        date: r.created_at ? new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
        rating: Number(r.rating) || 5,
        title: r.rating >= 4 ? "Great Experience" : "Customer Review",
        comment: r.comment || ""
      }))
    : [];

  return {
    id: item.id,
    slug: `vehicle-${item.id}`,
    name,
    type: item.category_name || (typeof item.category === "string" ? item.category : "Sedan"),
    transmission: item.transmission ? (item.transmission.charAt(0).toUpperCase() + item.transmission.slice(1)) : "Automatic",
    capacity: item.seats || 4,
    price: formattedPrice,
    priceNumber: rawPrice,
    location: "Houston, Texas",
    image: primaryImg,
    category: "all",
    rating: mappedReviews.length > 0
      ? (mappedReviews.reduce((sum, r) => sum + r.rating, 0) / mappedReviews.length).toFixed(1)
      : "4.9",
    reviewsCount: mappedReviews.length > 0 ? mappedReviews.length : 12,
    fuel: item.fuel_type ? (item.fuel_type.charAt(0).toUpperCase() + item.fuel_type.slice(1)) : "Petrol",
    gallery: gallery.length > 0 ? gallery : [primaryImg],
    features: resolvedFeatures,
    reviews: mappedReviews,
  };
}

export default function VehicleDetailPage() {
  const params = useParams();
  const idStr = params.id as string;
  const vehicleId = parseInt(idStr, 10);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    if (!idStr) return;

    Promise.all([
      vehiclesService.getVehicleDetail(idStr),
      vehiclesService.getFeatures(),
      vehiclesService.getReviews()
    ])
      .then(([detailData, featuresData, reviewsData]) => {
        if (isMounted && detailData && typeof detailData === "object") {
          const rawReviews = Array.isArray(reviewsData) ? reviewsData : reviewsData?.results || [];
          const detailWithReviews = { ...detailData, reviews: detailData.reviews || rawReviews };
          const transformed = transformApiDetailToVehicle(detailWithReviews, Array.isArray(featuresData) ? featuresData : []);
          setVehicle(transformed);
        }
      })
      .catch((err) => {
        console.error("Failed to load vehicle detail or features:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [idStr]);

  const [pickupDate, setPickupDate] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");
  const [activeDateTarget, setActiveDateTarget] = useState<"pickup" | "dropoff" | null>(null);

  const [bookingStep, setBookingStep] = useState<number>(0);
  const [selectedRentalMode, setSelectedRentalMode] = useState<"self" | "chauffeur">("self");
  const [bookingId, setBookingId] = useState<string>("");
  const [bookingReference, setBookingReference] = useState<string>("");
  const [isInitiatingBooking, setIsInitiatingBooking] = useState<boolean>(false);

  // Payment Verification on Redirect Return
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const trxref = urlParams.get("trxref") || urlParams.get("reference");
    const bookingRefFromUrl = urlParams.get("booking_ref");

    if (trxref) {
      const refToVerify = bookingRefFromUrl || bookingReference;
      if (refToVerify) {
        paymentsService
          .verifyPaystackPayment(trxref, refToVerify)
          .then((res: any) => {
            console.log("Payment verified successfully:", res);
            if (res?.booking_reference) {
              setBookingReference(res.booking_reference);
            }
            setBookingStep(6); // Open Booking Confirmed modal
          })
          .catch((err: any) => {
            console.error("Payment verification failed:", err);
          });
      }
    }
  }, [bookingReference]);

  const handleSelectRentalMode = async (mode: "self" | "chauffeur") => {
    setSelectedRentalMode(mode);
    if (!vehicle) return;

    setIsInitiatingBooking(true);
    const result = await vehiclesService.initiateBooking(vehicle.id, mode);
    setIsInitiatingBooking(false);

    if (result.success && result.data) {
      if (result.data.booking_id) setBookingId(result.data.booking_id);
      if (result.data.reference) setBookingReference(result.data.reference);
    }

    if (mode === "chauffeur") {
      setBookingStep(3); // Skip UploadDocumentsModal and proceed to Enhance Your Trip
    } else {
      setBookingStep(2);
    }
  };

  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [isSavingExtras, setIsSavingExtras] = useState<boolean>(false);

  const handleContinueEnhanceTrip = async (ids?: string[]) => {
    const extrasToSave = ids || selectedExtraIds;
    setSelectedExtraIds(extrasToSave);

    if (bookingReference && extrasToSave.length > 0) {
      try {
        setIsSavingExtras(true);
        await bookingsService.addExtras(bookingReference, extrasToSave);
      } catch (err) {
        console.error("Failed to save extras to booking:", err);
      } finally {
        setIsSavingExtras(false);
      }
    }
    setBookingStep(4);
  };

  const [showWarning, setShowWarning] = useState(false);
  const [isAvailableChecked, setIsAvailableChecked] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{ success: boolean; message: string } | null>(null);
  const [calculatedTotal, setCalculatedTotal] = useState<string>("36,000");

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
    setAvailabilityResult(null);
  };

  const formatDateToISO = (dateStr: string): string => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const handleCheckAvailability = async () => {
    if (!pickupDate || !dropOffDate) {
      setShowWarning(true);
      return;
    }
    if (!vehicle) return;

    setShowWarning(false);
    setIsCheckingAvailability(true);
    setAvailabilityResult(null);

    const isoPickup = formatDateToISO(pickupDate);
    const isoDropoff = formatDateToISO(dropOffDate);

    // Calculate total price based on duration
    const d1 = new Date(isoPickup);
    const d2 = new Date(isoDropoff);
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const total = diffDays * (vehicle.priceNumber || 0);
      if (total > 0) {
        setCalculatedTotal(total.toLocaleString("en-US"));
      }
    }

    const result = await vehiclesService.checkAvailability(vehicle.id, isoPickup, isoDropoff);
    setIsCheckingAvailability(false);

    if (result.success) {
      const msg = typeof result.data === "string"
        ? result.data
        : result.data?.message || "Great news — this vehicle is available for your selected dates.";
      setAvailabilityResult({ success: true, message: msg });
      setIsAvailableChecked(true);
    } else {
      setAvailabilityResult({
        success: false,
        message: typeof result.message === "string" ? result.message : "Vehicle is not available for selected dates."
      });
      setIsAvailableChecked(false);
    }
  };

  const handleBookNow = () => {
    if (!pickupDate || !dropOffDate) {
      setShowWarning(true);
    } else {
      setBookingStep(1);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner label="Loading vehicle details..." />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className={styles.container} style={{ padding: "80px 20px", textAlign: "center", color: "#64748b" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px", color: "#0f172a" }}>Vehicle Not Found</h2>
        <p style={{ marginBottom: "20px" }}>The requested vehicle could not be found or is unavailable.</p>
        <Link href="/customer" style={{ color: "#16a34a", fontWeight: 600 }}>Back to Fleet</Link>
      </div>
    );
  }

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
              <Image src="/images/our-fleet/profile.svg" alt="" width={14} height={14} />
              {vehicle.capacity} Seats
            </span>
            <span className={styles.chip}>
              <Image src="/images/our-fleet/jeep.svg" alt="" width={14} height={14} />
              {vehicle.type}
            </span>
            <span className={styles.chip}>{vehicle.transmission}</span>
            <span className={styles.chip}>
              <Image src="/images/our-fleet/gas-station.svg" alt="" width={14} height={14} />
              {vehicle.fuel}
            </span>
          </div>

          {/* Features Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Features</h2>
            <div className={styles.featuresGrid}>
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <Image
                    src={getFeatureIconPath(feat)}
                    alt={feat}
                    width={18}
                    height={18}
                  />
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
                <span className={styles.totalAmount}>₦{calculatedTotal}</span>
              </div>
            )}

            <button
              type="button"
              className={`${styles.checkBtn} ${pickupDate && dropOffDate ? styles.activeCheckBtn : ""}`}
              onClick={handleCheckAvailability}
              disabled={isCheckingAvailability}
            >
              {isCheckingAvailability ? "Checking..." : "Check Availability"}
            </button>

            {availabilityResult && (
              <div
                className={availabilityResult.success ? styles.availabilityBanner : undefined}
                style={{
                  marginTop: "12px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  backgroundColor: availabilityResult.success ? "#e6f4ea" : "#fce8e6",
                  color: availabilityResult.success ? "#137333" : "#c5221f"
                }}
              >
                {availabilityResult.success ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#137333"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                )}
                <span>{availabilityResult.message}</span>
              </div>
            )}
          </div>

          <div className={styles.priceCard}>
            <div className={styles.priceHeader}>
              <div>
                <span className={styles.priceAmount}>₦{vehicle.price}</span>
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
        onSelectMode={handleSelectRentalMode}
        isLoading={isInitiatingBooking}
      />

      {/* Step 2: Upload Your Documents */}
      <UploadDocumentsModal
        isOpen={bookingStep === 2}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(1)}
        onContinue={() => setBookingStep(3)}
        bookingRef={bookingReference}
      />

      {/* Step 3: Enhance Your Trip */}
      <EnhanceTripModal
        isOpen={bookingStep === 3}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(selectedRentalMode === "chauffeur" ? 1 : 2)}
        onContinue={handleContinueEnhanceTrip}
        selectedExtras={selectedExtraIds}
        onToggleExtra={(id) =>
          setSelectedExtraIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          )
        }
      />

      {/* Step 4: Review Your Booking */}
      <ReviewBookingModal
        isOpen={bookingStep === 4}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(3)}
        onConfirm={() => setBookingStep(5)}
        onEditDates={() => {
          setBookingStep(0);
          setActiveDateTarget("pickup");
        }}
        vehicle={vehicle}
        pickupDate={pickupDate}
        dropOffDate={dropOffDate}
        selectedMode={selectedRentalMode}
        bookingRef={bookingReference}
      />

      {/* Step 5: Choose a Payment Method */}
      <PaymentMethodModal
        isOpen={bookingStep === 5}
        onClose={() => setBookingStep(0)}
        onBack={() => setBookingStep(4)}
        onConfirm={() => setBookingStep(6)}
        bookingRef={bookingReference}
      />

      {/* Step 6: Booking Confirmed 🎉 */}
      <BookingConfirmedModal
        isOpen={bookingStep === 6}
        onClose={() => setBookingStep(0)}
        vehicle={vehicle}
        pickupDate={pickupDate}
        dropOffDate={dropOffDate}
        selectedMode={selectedRentalMode}
        bookingReference={bookingReference}
      />
    </div>
  );
}

