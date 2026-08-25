"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import VehicleCard from "@/components/customer/VehicleCard";
import FilterModal from "@/components/customer/FilterModal";
import { VEHICLES, CATEGORIES } from "@/data/vehicles";
import styles from "./CategoryPage.module.css";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const category = CATEGORIES.find((c) => c.slug === slug) || {
    id: "all",
    title: "All Vehicles",
    subtitle: "Explore our complete fleet available for rent.",
    slug: "all"
  };

  const filteredVehicles = VEHICLES.filter(
    (v) => category.id === "all" || v.category === category.id
  );

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
          <h1 className={styles.title}>{category.title}</h1>
          <p className={styles.subtitle}>{category.subtitle}</p>
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

      <div className={styles.grid}>
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} variant="family" />
        ))}
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
