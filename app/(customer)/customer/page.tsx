"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import VehicleCard from "@/components/customer/VehicleCard";
import FilterModal from "@/components/customer/FilterModal";
import Spinner from "@/components/customer/Spinner";
import { vehiclesService } from "@/services/vehicles-service";
import { Vehicle } from "@/data/vehicles";
import styles from "./CustomerHome.module.css";

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

export default function CustomerHomePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [managedVehicles, setManagedVehicles] = useState<Record<string, TagGroup>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    vehiclesService.getManagedVehicles()
      .then((data) => {
        if (isMounted && data && typeof data === "object" && Object.keys(data).length > 0) {
          setManagedVehicles(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load home page vehicles:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const hasManagedData = Object.keys(managedVehicles).length > 0;

  return (
    <div className={styles.container}>
      {/* Top Search & Filter bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Find the perfect car for your trip"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
        <Spinner label="Loading available vehicles..." />
      ) : hasManagedData ? (
        // Dynamic API sections from vehicles/manage/
        Object.entries(managedVehicles).map(([tagTitle, group]) => {
          const transformedVehicles = (group.vehicles || []).map(transformApiVehicle);
          const filtered = transformedVehicles.filter((v) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q);
          });

          if (filtered.length === 0) return null;

          const categorySlug = tagTitle.toLowerCase().replace(/\s+/g, "-");

          return (
            <section key={tagTitle} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>{tagTitle}</h2>
                  <p className={styles.sectionSubtitle}>{group.description}</p>
                </div>
                <Link href={`/customer/category/${categorySlug}`} className={styles.seeAll}>
                  See all
                </Link>
              </div>
              <div className={styles.popularGrid}>
                {filtered.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} variant="popular" />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b" }}>
          <p style={{ fontSize: "16px", fontWeight: 500 }}>No vehicles available at the moment.</p>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}