"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import VehicleCard from "@/components/customer/VehicleCard";
import FilterModal from "@/components/customer/FilterModal";
import FilterIcon from "@/components/icons/FilterIcon";
import Spinner from "@/components/customer/Spinner";
import { vehiclesService } from "@/services/vehicles-service";
import { Vehicle } from "@/data/vehicles";
import styles from "./CustomerHome.module.css";

interface VehicleImage {
  is_primary?: boolean;
  image?: string;
}

interface TagDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active?: boolean;
}

interface ApiVehicle {
  id: number | string;
  slug?: string;
  brand?: number | string;
  brand_name?: string;
  model?: string;
  year?: string | number;
  category?: number | string;
  category_name?: string;
  type?: string;
  transmission?: string;
  seats?: number;
  price_per_day?: string | number;
  location?: string;
  images?: VehicleImage[];
  fuel_type?: string;
  features?: (string | number)[];
  tags?: number[];
  tag_details?: TagDetail[];
  status?: string;
  is_featured?: boolean;
}

interface NormalizedSection {
  title: string;
  slug: string;
  description: string;
  vehicles: ApiVehicle[];
}

function parseManagedSections(data: any): NormalizedSection[] {
  if (!data) return [];

  // Case 1: When data is an array (e.g. search / filter result from backend)
  if (Array.isArray(data)) {
    if (data.length === 0) return [];

    const tagMap = new Map<string, { title: string; slug: string; description: string; vehicles: ApiVehicle[] }>();
    const unassigned: ApiVehicle[] = [];

    data.forEach((vehicle: ApiVehicle) => {
      if (Array.isArray(vehicle.tag_details) && vehicle.tag_details.length > 0) {
        vehicle.tag_details.forEach((tag) => {
          if (!tagMap.has(tag.slug)) {
            tagMap.set(tag.slug, {
              title: tag.name,
              slug: tag.slug,
              description: tag.description || `Explore ${tag.name} vehicles ready for your ride.`,
              vehicles: [],
            });
          }
          const sec = tagMap.get(tag.slug)!;
          if (!sec.vehicles.some((v) => v.id === vehicle.id)) {
            sec.vehicles.push(vehicle);
          }
        });
      } else {
        unassigned.push(vehicle);
      }
    });

    const sections: NormalizedSection[] = Array.from(tagMap.values());
    if (unassigned.length > 0 || sections.length === 0) {
      sections.push({
        title: "Search Results",
        slug: "search-results",
        description: "Vehicles matching your search criteria.",
        vehicles: unassigned.length > 0 ? unassigned : data,
      });
    }
    return sections;
  }

  // Case 2: When data is an object with { results: [...] }
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return parseManagedSections(data.results);
  }

  // Case 3: When data is a dictionary of tag slugs { "budget-friendly": [...], "hot-cars": [...] }
  const sections: NormalizedSection[] = [];

  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) {
      const firstVehicle = val[0];
      const matchingTag =
        firstVehicle?.tag_details?.find((t: TagDetail) => t.slug === key) ||
        firstVehicle?.tag_details?.[0];

      let title = matchingTag?.name;
      if (!title) {
        title = key.toLowerCase() === "general"
          ? "General Fleet"
          : key
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
      }

      const slug = matchingTag?.slug || key.toLowerCase().replace(/\s+/g, "-");
      const description =
        matchingTag?.description ||
        (key.toLowerCase() === "general"
          ? "Explore our broad selection of available vehicles ready for your ride."
          : `Explore ${title} vehicles for your next journey.`);

      sections.push({
        title,
        slug,
        description,
        vehicles: val,
      });
    } else if (val && typeof val === "object" && Array.isArray((val as any).vehicles)) {
      const title =
        (val as any).title ||
        key
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

      const slug = key.toLowerCase().replace(/\s+/g, "-");
      const description = (val as any).description || `Explore ${title} vehicles for your next journey.`;

      sections.push({
        title,
        slug,
        description,
        vehicles: (val as any).vehicles,
      });
    }
  }

  return sections;
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
  const [sections, setSections] = useState<NormalizedSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<{
    min_price?: string;
    max_price?: string;
    vehicle_type?: string[];
    features?: string[];
  }>({});

  const loadVehicles = (
    filters?: {
      min_price?: string;
      max_price?: string;
      vehicle_type?: string[];
      features?: string[];
    },
    search?: string
  ) => {
    setIsLoading(true);
    vehiclesService.getManagedVehicles({ ...filters, search })
      .then((data) => {
        const parsed = parseManagedSections(data);
        setSections(parsed);
      })
      .catch((err) => {
        console.error("Failed to load home page vehicles:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadVehicles(appliedFilters, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, appliedFilters]);

  const handleApplyFilters = (newFilters: {
    min_price?: string;
    max_price?: string;
    vehicle_type?: string[];
    features?: string[];
  }) => {
    setAppliedFilters(newFilters);
  };

  const hasFilterActive = Boolean(
    appliedFilters.min_price ||
    appliedFilters.max_price ||
    (appliedFilters.vehicle_type && appliedFilters.vehicle_type.length > 0) ||
    (appliedFilters.features && appliedFilters.features.length > 0)
  );

  return (
    <div className={styles.container}>
      {/* Top Search & Filter bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrap}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Find the perfect car for your trip"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <button
          type="button"
          className={`${styles.filterBtn} ${hasFilterActive ? styles.filterBtnActive : ""}`}
          onClick={() => setIsFilterOpen(true)}
        >
          <FilterIcon size={20} color={hasFilterActive ? "#0f172a" : "#868C98"} />
          Filter
          {hasFilterActive && (
            <span style={{ fontSize: "11px", marginLeft: "2px", opacity: 0.85 }}>
              •
            </span>
          )}
        </button>
      </div>

      {isLoading ? (
        <Spinner label="Loading available vehicles..." />
      ) : sections.length > 0 ? (
        // Dynamic API sections from vehicles/manage/
        sections.map((sec) => {
          let transformedVehicles = (sec.vehicles || []).map(transformApiVehicle);
          
          if (appliedFilters.features && appliedFilters.features.length > 0) {
            transformedVehicles = transformedVehicles.filter((v) =>
              appliedFilters.features!.every((f) =>
                v.features?.some((vf) => String(vf).toLowerCase().includes(f.toLowerCase()))
              )
            );
          }

          const filtered = transformedVehicles.filter((v) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              v.name.toLowerCase().includes(q) ||
              v.type.toLowerCase().includes(q) ||
              (v.features && v.features.some((f) => String(f).toLowerCase().includes(q)))
            );
          });

          if (filtered.length === 0) return null;

          return (
            <section key={sec.slug} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>{sec.title}</h2>
                  <p className={styles.sectionSubtitle}>{sec.description}</p>
                </div>
                <Link href={`/customer/category/${sec.slug}`} className={styles.seeAll}>
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
          <p style={{ fontSize: "16px", fontWeight: 500 }}>No vehicles available matching your criteria.</p>
          {hasFilterActive && (
            <button
              type="button"
              onClick={() => handleApplyFilters({})}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialMinPrice={appliedFilters.min_price}
        initialMaxPrice={appliedFilters.max_price}
        initialVehicleTypes={appliedFilters.vehicle_type}
        initialFeatures={appliedFilters.features}
      />
    </div>
  );
}