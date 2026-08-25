"use client";

import React, { useState } from "react";
import Link from "next/link";
import VehicleCard from "@/components/customer/VehicleCard";
import FilterModal from "@/components/customer/FilterModal";
import { VEHICLES } from "@/data/vehicles";
import styles from "./CustomerHome.module.css";

export default function CustomerHomePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const familyVehicles = VEHICLES.filter((v) => v.category === "family");
  const popularVehicles = VEHICLES.filter((v) => v.category === "popular");
  const eventVehicles = VEHICLES.filter((v) => v.category === "event");

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

      {/* Section 1: Perfect for Family Trips */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Perfect for Family Trips</h2>
            <p className={styles.sectionSubtitle}>Spacious vehicles for road trips and family travel.</p>
          </div>
          <Link href="/customer/category/perfect-for-family-trips" className={styles.seeAll}>
            See all
          </Link>
        </div>
        <div className={styles.familyGrid}>
          {familyVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} variant="family" />
          ))}
        </div>
      </section>

      {/* Section 2: Popular right now */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Popular right now</h2>
            <p className={styles.sectionSubtitle}>The most booked vehicles this week</p>
          </div>
          <Link href="/customer/category/popular-right-now" className={styles.seeAll}>
            See all
          </Link>
        </div>
        <div className={styles.popularGrid}>
          {popularVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} variant="popular" />
          ))}
        </div>
      </section>

      {/* Section 3: Event Ready */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Event Ready</h2>
            <p className={styles.sectionSubtitle}>Make every occasion memorable.</p>
          </div>
          <Link href="/customer/category/event-ready" className={styles.seeAll}>
            See all
          </Link>
        </div>
        <div className={styles.eventGrid}>
          {eventVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} variant="event" />
          ))}
        </div>
      </section>

      {/* Filter Modal */}
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}