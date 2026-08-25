import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/data/vehicles";
import styles from "./VehicleCard.module.css";

interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: "family" | "popular" | "event" | "standard";
}

export default function VehicleCard({ vehicle, variant = "standard" }: VehicleCardProps) {
  return (
    <Link href={`/customer/vehicles/${vehicle.id}`} className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.imageContainer}>
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={styles.location}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {vehicle.location}
          </span>
          <div className={styles.priceTag}>
            <span className={styles.price}>${vehicle.price}</span>
            <span className={styles.perDay}>/day</span>
          </div>
        </div>

        <div className={styles.titleRow}>
          <h3 className={styles.name}>{vehicle.name}</h3>
          <span className={styles.capacity}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {vehicle.capacity}
          </span>
        </div>

        <div className={styles.tags}>
          <span className={styles.tag}>{vehicle.type}</span>
          <span className={styles.tag}>{vehicle.transmission}</span>
        </div>
      </div>
    </Link>
  );
}
