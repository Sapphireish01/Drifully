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
  const [heroImages, setHeroImages] = useState<{ id?: number; src: string; alt: string }[]>([]);
  const [heroLoading, setHeroLoading] = useState<boolean>(true);

  // Fetch mini fleet for the hero carousel
  useEffect(() => {
    let isMounted = true;
    const fetchHeroFleet = async () => {
      setHeroLoading(true);
      try {
        const miniFleetData = await marketingService.getMiniFleet();
        if (!isMounted) return;

        const results = miniFleetData?.results || {};
        const categoryKeys = Object.keys(results);
        const extracted: { id?: number; src: string; alt: string }[] = [];
        const seenIds = new Set<number>();
        const seenImages = new Set<string>();

        // Find max list length across returned categories
        const maxLen = Math.max(
          0,
          ...categoryKeys.map((cat) => (Array.isArray(results[cat]) ? results[cat].length : 0))
        );

        // Interleave categories to create a diverse carousel
        for (let i = 0; i < maxLen; i++) {
          for (const cat of categoryKeys) {
            const list = results[cat];
            if (Array.isArray(list) && list[i]) {
              const item = list[i];
              if (item?.primary_image && !seenIds.has(item.id) && !seenImages.has(item.primary_image)) {
                seenIds.add(item.id);
                seenImages.add(item.primary_image);
                extracted.push({
                  id: item.id,
                  src: item.primary_image,
                  alt: `Fleet Vehicle ${item.id}`,
                });
              }
            }
          }
        }

        if (extracted.length > 0) {
          setHeroImages(extracted);
        } else {
          // Fallback to getVehicles if mini-fleet returns empty
          const allFleet = await marketingService.getVehicles();
          if (!isMounted) return;
          const fallback: { id?: number; src: string; alt: string }[] = [];
          (allFleet || []).forEach((v) => {
            const name = v.name || "Drifully Fleet Vehicle";
            if (v.image && !v.image.includes("placeholder-car.png")) {
              fallback.push({ id: Number(v.id), src: v.image, alt: name });
            }
          });
          setHeroImages(fallback);
        }
      } catch (e) {
        console.error("Failed to load hero mini-fleet:", e);
        if (isMounted) {
          try {
            const allFleet = await marketingService.getVehicles();
            if (!isMounted) return;
            const fallback: { id?: number; src: string; alt: string }[] = [];
            (allFleet || []).forEach((v) => {
              const name = v.name || "Drifully Fleet Vehicle";
              if (v.image && !v.image.includes("placeholder-car.png")) {
                fallback.push({ id: Number(v.id), src: v.image, alt: name });
              }
            });
            setHeroImages(fallback);
          } catch {
            setHeroImages([]);
          }
        }
      } finally {
        if (isMounted) setHeroLoading(false);
      }
    };

    fetchHeroFleet();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const renderHeroSkeletonSet = () => (
    <>
      <div className={styles['hero-carousel__col']}>
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--taller']}`} />
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--shorter']}`} />
      </div>
      <div className={styles['hero-carousel__col']}>
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--small']}`} />
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--small']}`} />
      </div>
      <div className={`${styles['hero-carousel__col']} ${styles['hero-carousel__col--single']}`}>
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--large']}`} />
      </div>
      <div className={styles['hero-carousel__col']}>
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--small']}`} />
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--small']}`} />
      </div>
      <div className={styles['hero-carousel__col']}>
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--shorter']}`} />
        <div className={`${styles['hero-carousel__skeleton']} ${styles['hero-carousel__img--taller']}`} />
      </div>
    </>
  );

  const renderHeroItem = (
    img: { id?: number; src: string; alt: string },
    sizeClass: string,
    width: number,
    height: number
  ) => {
    const imgElement = (
      <Image
        src={img.src}
        alt={img.alt}
        width={width}
        height={height}
        unoptimized
        className={`${styles['hero-carousel__img']} ${sizeClass}`}
      />
    );

    if (img.id) {
      return (
        <Link
          href={`/our-fleet/${img.id}`}
          className={styles['hero-carousel__link']}
        >
          {imgElement}
        </Link>
      );
    }

    return (
      <div className={styles['hero-carousel__link']}>
        {imgElement}
      </div>
    );
  };

  const renderHeroColumnSet = (keyPrefix: string) => {
    if (heroImages.length === 0) return null;
    const getImg = (idx: number) => heroImages[idx % heroImages.length];

    const img0 = getImg(0);
    const img1 = getImg(1);
    const img2 = getImg(2);
    const img3 = getImg(3);
    const img4 = getImg(4);
    const img5 = getImg(5);
    const img6 = getImg(6);
    const img7 = getImg(7);
    const img8 = getImg(8);

    return (
      <>
        <div className={styles['hero-carousel__col']}>
          {renderHeroItem(img0, styles['hero-carousel__img--taller'], 250, 180)}
          {renderHeroItem(img1, styles['hero-carousel__img--shorter'], 250, 100)}
        </div>
        <div className={styles['hero-carousel__col']}>
          {renderHeroItem(img2, styles['hero-carousel__img--small'], 250, 140)}
          {renderHeroItem(img3, styles['hero-carousel__img--small'], 250, 140)}
        </div>
        <div className={`${styles['hero-carousel__col']} ${styles['hero-carousel__col--single']}`}>
          {renderHeroItem(img4, styles['hero-carousel__img--large'], 250, 300)}
        </div>
        <div className={styles['hero-carousel__col']}>
          {renderHeroItem(img5, styles['hero-carousel__img--small'], 250, 140)}
          {renderHeroItem(img6, styles['hero-carousel__img--small'], 250, 140)}
        </div>
        <div className={styles['hero-carousel__col']}>
          {renderHeroItem(img7, styles['hero-carousel__img--shorter'], 250, 140)}
          {renderHeroItem(img8, styles['hero-carousel__img--taller'], 250, 140)}
        </div>
      </>
    );
  };

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
            {heroLoading ? (
              <div className={styles['hero-carousel']}>
                <div className={`${styles['hero-carousel__track']} ${styles['hero-carousel__track--loading']}`}>
                  {renderHeroSkeletonSet()}
                  {renderHeroSkeletonSet()}
                </div>
              </div>
            ) : heroImages.length > 0 ? (
              <div className={styles['hero-carousel']}>
                <div className={styles['hero-carousel__track']}>
                  {renderHeroColumnSet("set-1")}
                  {renderHeroColumnSet("set-2")}
                </div>
              </div>
            ) : null}
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
