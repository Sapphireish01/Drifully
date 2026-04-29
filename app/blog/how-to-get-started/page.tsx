import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./article.module.css";

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HowToGetStartedPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="container">
          <article className={styles.articleContainer}>
            <Link href="/blog" className={styles.backButton} aria-label="Go back">
              <ArrowLeftIcon />
            </Link>

            <header className={styles.headerSection}>
              <h1 className={styles.title}>How to Get Started With Drifully</h1>
              <p className={styles.subtitle}>
                From download to your first ride in minutes—everything you need to start moving effortlessly.
              </p>
            </header>

            {/* Section 1 */}
            <section className={styles.imageSection}>
              <div className={styles.imageWrapper}>
                <Image src="/images/blog-inner-1.svg" alt="Create Account Screen" width={800} height={450} priority />
              </div>
              <div className={styles.textGrid}>
                <div className={styles.stepBlock}>
                  <h2 className={styles.stepTitle}>1. Download the app</h2>
                  <p className={styles.stepDesc}>
                    Start by downloading the Drifully app from the <span className={styles.boldText}>App Store</span> or <span className={styles.boldText}>Google Play</span>. Everything you need to book, manage, and track your rides lives inside the app.
                  </p>
                  <h3 className={styles.stepSubheading}>What happens here:</h3>
                  <ul className={styles.stepList}>
                    <li>You install the app</li>
                    <li>Open it and begin onboarding</li>
                    <li>Set up your profile in seconds</li>
                  </ul>
                </div>
                <div className={styles.stepBlock}>
                  <h2 className={styles.stepTitle}>2. Create Your Account</h2>
                  <p className={styles.stepDesc}>
                    Sign up using your phone number for fast and secure access.
                  </p>
                  <h3 className={styles.stepSubheading}>What you'll need:</h3>
                  <ul className={styles.stepList}>
                    <li>Phone number (OTP verification)</li>
                    <li>Basic profile details</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className={styles.imageSection}>
              <div className={styles.imageWrapper}>
                <Image src="/images/blog-inner-2.svg" alt="Choose Your Ride Screen" width={800} height={450} />
              </div>
              <div className={styles.textGrid}>
                <div className={styles.stepBlock}>
                  <h2 className={styles.stepTitle}>3. Choose Your Ride</h2>
                  <p className={styles.stepDesc}>
                    Browse available vehicles and choose what fits your journey.
                  </p>
                  <h3 className={styles.stepSubheading}>You can pick between:</h3>
                  <ul className={styles.stepList}>
                    <li>Self-Drive</li>
                    <li>Chauffeur Service</li>
                  </ul>
                  <p className={styles.stepDesc} style={{ marginTop: '16px' }}>
                    Each car shows clear details so you can decide quickly and confidently.
                  </p>
                </div>
                <div className={styles.stepBlock}>
                  <h2 className={styles.stepTitle}>4. Set Your Trip Details</h2>
                  <p className={styles.stepDesc}>
                    Tell us where and when you need your ride.
                  </p>
                  <h3 className={styles.stepSubheading}>You'll select:</h3>
                  <ul className={styles.stepList}>
                    <li>Rental duration</li>
                  </ul>
                  <p className={styles.stepDesc} style={{ marginTop: '16px' }}>
                    Everything updates instantly so you know what to expect.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className={styles.imageSection}>
              <div className={styles.imageWrapper}>
                <Image src="/images/blog-inner-3.svg" alt="Add Extras and Confirm Screen" width={800} height={450} />
              </div>
              <div className={styles.textGrid}>
                <div className={styles.stepBlock}>
                  <h2 className={styles.stepTitle}>5. Add Extras (Optional)</h2>
                  <p className={styles.stepDesc}>
                    Customize your trip with optional add-ons for comfort and convenience.
                  </p>
                  <h3 className={styles.stepSubheading}>Examples:</h3>
                  <ul className={styles.stepList}>
                    <li>Child seat</li>
                    <li>Extra fuel</li>
                    <li>Special requests</li>
                  </ul>
                  <p className={styles.stepDesc} style={{ marginTop: '16px' }}>
                    Only pay for what you need.
                  </p>
                </div>
                <div className={styles.stepBlock}>
                  <h2 className={styles.stepTitle}>6. Confirm & Pay</h2>
                  <p className={styles.stepDesc}>
                    Review your booking and confirm in one step.
                  </p>
                  <h3 className={styles.stepSubheading}>What you'll see:</h3>
                  <ul className={styles.stepList}>
                    <li>Transparent pricing</li>
                    <li>Trip summary</li>
                    <li>Payment breakdown</li>
                  </ul>
                  <p className={styles.stepDesc} style={{ marginTop: '16px' }}>
                    No hidden charges. No surprises.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className={styles.imageSection}>
              <div className={styles.successImageWrapper}>
                <Image src="/images/blog-inner-4.svg" alt="Booking Confirmed" width={400} height={250} style={{ objectFit: 'contain' }} />
              </div>
              <div className={styles.stepBlock}>
                <h2 className={styles.stepTitle}>7. Start Your Journey</h2>
                <p className={styles.stepDesc}>
                  Your ride arrives or is ready for pickup—depending on your choice.
                </p>
                <h3 className={styles.stepSubheading}>From here, everything is handled in the app:</h3>
                <ul className={styles.stepList}>
                  <li>Trip tracking</li>
                  <li>Support access</li>
                  <li>Extensions or rebooking</li>
                </ul>
                <p className={styles.stepDesc} style={{ marginTop: '16px', fontWeight: 600 }}>
                  Just move.
                </p>
              </div>
            </section>

          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
