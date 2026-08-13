"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloadButtons from "@/components/DownloadButtons";
import Spinner from "@/components/admin/Spinner";
import { marketingService } from "@/services/marketing-service";
import { vehiclesService } from "@/services/vehicles-service";
import { Vehicle } from "@/types/vehicle";
import styles from "./page.module.css";

const CATEGORIES = ["All", "Jeep", "Hatchback", "Luxury", "SUVs", "Sedan", "Van"];

export default function OurFleetPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("USD");

  // Reset page when category or brand filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedBrand]);

  // Detect user's local currency via IP — cached in localStorage to avoid repeat calls
  useEffect(() => {
    const cached = localStorage.getItem('drifully_currency');
    if (cached) { setCurrency(cached); return; }
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        if (d?.currency) {
          setCurrency(d.currency);
          localStorage.setItem('drifully_currency', d.currency);
        }
      })
      .catch(() => {}); // silently fall back to USD
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        let types: string[] = [];
        if (activeCategory !== "All") {
          // Normalize category name for API (e.g., "SUVs" -> "suv")
          const typeMap: { [key: string]: string } = {
            "SUVs": "suv",
            "Sedan": "sedan",
            "Van": "van",
            "Hatchback": "hatchback",
            "Jeep": "jeep",
            "Luxury": "luxury"
          };
          types = [typeMap[activeCategory] || activeCategory.toLowerCase()];
        }

        const [data, optionsData] = await Promise.all([
          marketingService.getVehicles(types),
          vehiclesService.getBrandsAndCategories()
        ]);
        setVehicles(data);
        setBrands(optionsData.brands || []);
      } catch (err: any) {
        setError("Failed to load vehicles. Please try again later.");
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [activeCategory]);

  const availableBrandNames = ["All", ...Array.from(new Set([
    ...brands.map((b: any) => b.name),
    ...vehicles.map(v => {
      const b = brands.find(brand => brand.id === v.brand_id);
      return b ? b.name : (v.name ? v.name.split(' ')[0] : '');
    }).filter(Boolean)
  ]))];

  const displayedVehicles = vehicles.filter(vehicle => {
    if (selectedBrand === "All") return true;
    const brandObj = brands.find(b => b.id === vehicle.brand_id);
    const brandName = brandObj ? brandObj.name : vehicle.name.split(' ')[0];
    return brandName.toLowerCase() === selectedBrand.toLowerCase();
  });

  const totalPages = Math.ceil(displayedVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = displayedVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles['fleet-hero']}>
          <div className="container">
            <span className={`${styles.badge} badge`}>Discover Our Fleet</span>
            <h1 className={`${styles['heading-1']} heading-1`}>
              A car for every journey
            </h1>
            <p className={`${styles['body-lg']} body-lg`}>
              From self-drives to chauffeur-led comfort, explore vehicles designed to move you effortlessly.
            </p>

            <DownloadButtons variant="default" />

            {/* Continuous Carousel */}
            <div className={styles['hero-carousel']}>
              <div className={styles['hero-carousel__track']}>
                {/* Set 1 */}
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/1st-img.png" alt="VW Bus" width={250} height={180} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--taller']}`} />
                  <Image src="/images/2nd-img.jpg" alt="Interior" width={250} height={100} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--shorter']}`} />
                </div>
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/3rd-img.png" alt="Tesla" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                  <Image src="/images/4th-img.png" alt="Mini Cooper" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                </div>
                <div className={`${styles['hero-carousel__col']} ${styles['hero-carousel__col--single']}`}>
                  <Image src="/images/5th-img.png" alt="Red GTR" width={250} height={300} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--large']}`} />
                </div>
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/6th-img.png" alt="Polestar" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                  <Image src="/images/7th-img.png" alt="Charging" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                </div>
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/8th-img.png" alt="BMW X6" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--shorter']}`} />
                  <Image src="/images/9th-img.png" alt="Red Honda" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--taller']}`} />
                </div>

                {/* Set 2 (Duplicate for seamless loop) */}
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/1st-img.png" alt="VW Bus" width={250} height={180} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--taller']}`} />
                  <Image src="/images/2nd-img.jpg" alt="Interior" width={250} height={100} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--shorter']}`} />
                </div>
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/3rd-img.png" alt="Tesla" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                  <Image src="/images/4th-img.png" alt="Mini Cooper" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                </div>
                <div className={`${styles['hero-carousel__col']} ${styles['hero-carousel__col--single']}`}>
                  <Image src="/images/5th-img.png" alt="Red GTR" width={250} height={300} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--large']}`} />
                </div>
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/6th-img.png" alt="Polestar" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                  <Image src="/images/7th-img.png" alt="Charging" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--small']}`} />
                </div>
                <div className={styles['hero-carousel__col']}>
                  <Image src="/images/8th-img.png" alt="BMW X6" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--shorter']}`} />
                  <Image src="/images/9th-img.png" alt="Red Honda" width={250} height={140} className={`${styles['hero-carousel__img']} ${styles['hero-carousel__img--taller']}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Section */}
        <section className={styles['fleet-section']}>
          <div className="container">
            <div className={styles['fleet-section__header']}>
              <h2 className="heading-2">Our Fleet</h2>
              <p className="body-md">
                A <strong>sneak peek</strong> of our wide range of premium vehicles to match your lifestyle and needs.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className={styles['fleet-filters']}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', minWidth: '70px' }}>Category:</span>
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      className={`${styles['filter-tab']} ${activeCategory === category ? styles.active : ''}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {availableBrandNames.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', minWidth: '70px' }}>Brand:</span>
                    {availableBrandNames.map(brandName => (
                      <button
                        key={brandName}
                        className={`${styles['filter-tab']} ${selectedBrand === brandName ? styles.active : ''}`}
                        onClick={() => setSelectedBrand(brandName)}
                      >
                        {brandName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className={styles['fleet-grid']}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gridColumn: '1 / -1', minHeight: '300px' }}>
                  <Spinner />
                </div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : displayedVehicles.length === 0 ? (
                <div className={styles.empty}>No vehicles found matching your criteria.</div>
              ) : (
                paginatedVehicles.map(vehicle => (
                  <Link href={`/our-fleet/${vehicle.id}`} key={vehicle.id} className={styles['fleet-card-link']}>
                    <div className={styles['fleet-card']}>
                      <div className={styles['fleet-card__img-wrapper']}>
                        <Image
                          src={vehicle.image || '/images/placeholder-car.png'}
                          alt={vehicle.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles['fleet-card__content']}>
                        <div className={styles['fleet-card__meta']}>
                          <span className={styles['fleet-card__location']}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {vehicle.location}
                          </span>
                          <span className={styles['fleet-card__price']}>
                            {new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(
                              typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price)
                            )}
                            <span className={styles['fleet-card__price-unit']}>/day</span>
                          </span>
                        </div>
                        <div className={styles['fleet-sitting']}>
                          <h3 className={styles['fleet-card__title']}>
                            {(() => {
                              const brand = brands.find(b => b.id === vehicle.brand_id);
                              return brand ? `${brand.name} ${vehicle.model}` : vehicle.name;
                            })()}
                          </h3>
                          <span className='flex items-center gap-1' style={{ color: '#868C98' }}>
                            <Image src="/images/our-fleet/profile.svg" alt="capacity" width={14} height={14} style={{ marginTop: '6px' }} />
                            {vehicle.capacity}
                          </span>
                        </div>
                        <div className={styles['fleet-card__specs']}>
                          <span>{vehicle.type}</span>
                          {/* <span>•</span> */}
                          <span>{vehicle.transmission}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles['fleet-pagination']}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`${styles['pagination-btn']} ${currentPage === pageNum ? styles.active : ''}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      const fleetSection = document.querySelector(`.${styles['fleet-section']}`);
                      if (fleetSection) {
                        fleetSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
