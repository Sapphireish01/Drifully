import Link from "next/link";
import Image from "next/image";
import styles from "@/components/customer/CustomerShell.module.css";

export default function CustomerHomePage() {
  return (
    <div>
      <p className={styles.eyebrow}>YOUR DRIFULLY ACCOUNT</p>
      <h1 className={styles.title}>Ready for your next journey?</h1>
      <p className={styles.subtitle}>Manage your trips, discover a vehicle, and keep everything in one place.</p>
      <div className={styles.actions}>
        <Link href="/our-fleet" className={styles.primaryButton}>Browse vehicles</Link>
        <Link href="/customer/help-support" className={styles.secondaryButton}>Get help</Link>
      </div>

      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="next-trip-title">
          <div className={styles.cardHeader}><h2 id="next-trip-title" className={styles.cardTitle}>Next trip</h2><Link href="/customer/trips" className={styles.cardLink}>View all trips</Link></div>
          <div className={styles.trip}>
            <Image className={styles.vehicleImage} src="/images/hero-img.png" alt="Vehicle ready for your next trip" width={236} height={168} />
            <div><h3 className={styles.vehicleName}>Your next ride is waiting</h3><div className={styles.tripMeta}><span>Pickup<strong>Choose a date</strong></span><span>Service<strong>Self-drive</strong></span></div></div>
            <span className={styles.status}>Plan a trip</span>
          </div>
        </section>
        <section className={styles.card} aria-labelledby="rewards-title">
          <div className={styles.cardHeader}><h2 id="rewards-title" className={styles.cardTitle}>Account & Rewards</h2><Link href="/customer/account-rewards" className={styles.cardLink}>Manage</Link></div>
          <div className={styles.reward}><div><p className={styles.rewardLabel}>Available rewards</p><p className={styles.rewardValue}>0 points</p></div><span className={styles.rewardIcon}>★</span></div>
          <div className={styles.noticeList}><p className={styles.notice}><span className={styles.noticeDot} />Complete your profile to make booking faster.</p><p className={styles.notice}><span className={styles.noticeDot} />Invite a friend and earn rewards on their first trip.</p></div>
        </section>
      </div>
    </div>
  );
}