import Link from "next/link";
import styles from "@/components/customer/CustomerShell.module.css";

const trips = [
  { id: "DRF-2048", vehicle: "Toyota Corolla 2022", date: "No upcoming trips", status: "Plan a trip" },
  { id: "DRF-1831", vehicle: "Honda CR-V 2021", date: "12 May 2026", status: "Completed" },
];

export default function TripsPage() {
  return <div><p className={styles.eyebrow}>YOUR JOURNEYS</p><h1 className={styles.title}>Trips</h1><p className={styles.subtitle}>Keep track of upcoming and past rentals.</p><div className={styles.actions}><Link href="/our-fleet" className={styles.primaryButton}>Book a vehicle</Link></div><div className={styles.list}>{trips.map((trip) => <article className={styles.card} key={trip.id}><div className={styles.cardHeader}><div><h2 className={styles.cardTitle}>{trip.vehicle}</h2><p className={styles.muted}>{trip.id} · {trip.date}</p></div><span className={styles.status}>{trip.status}</span></div><Link href={`/customer/trips/${trip.id}`} className={styles.cardLink}>View trip details</Link></article>)}</div></div>;
}