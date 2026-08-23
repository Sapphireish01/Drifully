import Link from "next/link";
import styles from "@/components/customer/CustomerShell.module.css";

export default async function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div><Link href="/customer/trips" className={styles.cardLink}>← Back to trips</Link><p className={styles.eyebrow}>TRIP {id}</p><h1 className={styles.title}>Trip details</h1><p className={styles.subtitle}>Your booking information and support options will appear here.</p><section className={`${styles.card} ${styles.detailCard}`}><h2 className={styles.cardTitle}>Honda CR-V 2021</h2><div className={styles.detailGrid}><span>Booking status<strong>Completed</strong></span><span>Service<strong>Self-drive</strong></span><span>Pickup<strong>12 May 2026</strong></span><span>Return<strong>15 May 2026</strong></span></div></section><Link href="/customer/help-support/report-problem" className={styles.secondaryButton}>Report a problem</Link></div>;
}