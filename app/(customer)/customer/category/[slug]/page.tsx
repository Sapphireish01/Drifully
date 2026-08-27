"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import VehicleCard from "@/components/customer/VehicleCard";
import FilterModal from "@/components/customer/FilterModal";
import Spinner from "@/components/customer/Spinner";
import { vehiclesService } from "@/services/vehicles-service";
import { Vehicle } from "@/data/vehicles";
import styles from "./CategoryPage.module.css";

interface VehicleImage {
  is_primary?: boolean;
  image?: string;
}

interface ApiVehicle {
  id: number | string;
  slug?: string;
  brand_name?: string;
  model?: string;
  year?: string | number;
  category_name?: string;
  type?: string;
  transmission?: string;
  seats?: number;
  price_per_day?: string | number;
  location?: string;
  images?: VehicleImage[];
  fuel_type?: string;
  features?: string[];
}

interface TagGroup {
  description: string;
  vehicles: ApiVehicle[];
}

function transformApiVehicle(item: ApiVehicle): Vehicle {
  const primaryImg = item.images?.find((img) => img.is_primary)?.image || item.images?.[0]?.image || "/images/hero-img.png";
  const gallery = item.images?.map((img) => img.image).filter((img): img is string => Boolean(img)) || [primaryImg];

  const rawPrice = Number(item.price_per_day || 0);
  const formattedPrice = rawPrice > 0 
    ? rawPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : "15,000";

  return {
    id: typeof item.id === "string" ? parseInt(item.id, 10) || 0 : item.id,
    slug: item.slug || `${(item.model || 'car').toLowerCase().replace(/\s+/g, '-')}-${item.id}`,
    name: `${item.brand_name || ''} ${item.model || ''} ${item.year || ''}`.trim() || `Vehicle #${item.id}`,
    type: item.category_name || item.type || "Sedan",
    transmission: item.transmission ? (item.transmission.charAt(0).toUpperCase() + item.transmission.slice(1)) : "Automatic",
    capacity: item.seats || 4,
    price: formattedPrice,
    priceNumber: rawPrice,
    location: item.location || "Houston, Texas",
    image: primaryImg,
    category: "all",
    rating: "4.9",
    reviewsCount: 12,
    fuel: item.fuel_type ? (item.fuel_type.charAt(0).toUpperCase() + item.fuel_type.slice(1)) : "Petrol",
    gallery: gallery.length > 0 ? gallery : ["/images/hero-img.png"],
    features: Array.isArray(item.features) ? item.features.map(String) : [],
    reviews: [],
  };
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("Vehicles");
  const [categorySubtitle, setCategorySubtitle] = useState("Explore available vehicles for rent.");

  useEffect(() => {
    let isMounted = true;
    vehiclesService.getManagedVehicles()
      .then((data: Record<string, TagGroup>) => {
        if (!isMounted || !data || typeof data !== "object") return;
        
        let foundVehicles: ApiVehicle[] = [];
        let matchingTitle = "";
        let matchingDesc = "";

        for (const [tagTitle, group] of Object.entries(data)) {
          const tagSlug = tagTitle.toLowerCase().replace(/\s+/g, "-");
          if (tagSlug === slug || slug === "all") {
            foundVehicles = [...foundVehicles, ...(group.vehicles || [])];
            if (!matchingTitle) {
              matchingTitle = tagTitle;
              matchingDesc = group.description;
            }
          }
        }

        if (foundVehicles.length > 0) {
          setVehicles(foundVehicles.map(transformApiVehicle));
          if (matchingTitle) {
            setCategoryTitle(matchingTitle);
            setCategorySubtitle(matchingDesc);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load category vehicles:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <Link href="/customer" className={styles.backBtn} aria-label="Back to home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <div>
          <h1 className={styles.title}>{categoryTitle}</h1>
          <p className={styles.subtitle}>{categorySubtitle}</p>
        </div>
        <button type="button" className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Filter
        </button>
      </div>

      {isLoading ? (
        <Spinner label="Loading category vehicles..." />
      ) : vehicles.length > 0 ? (
        <div className={styles.grid}>
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} variant="family" />
          ))}
        </div>
      ) : (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b" }}>
          <p style={{ fontSize: "16px", fontWeight: 500 }}>No vehicles found in this category.</p>
        </div>
      )}

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
