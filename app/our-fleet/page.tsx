"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloadButtons from "@/components/DownloadButtons";


const VEHICLES = [
  {
    id: 1,
    name: "Volkswagen T2 Bus",
    type: "Van",
    transmission: "Manual",
    capacity: 8,
    price: "3,000",
    location: "Houston Texas",
    image: "/images/1st-img.png",
    category: "Van"
  },
  {
    id: 2,
    name: "Tesla Model S",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 5,
    price: "5,000",
    location: "Houston Texas",
    image: "/images/3rd-img.png",
    category: "Sedan"
  },
  {
    id: 3,
    name: "Mini Cooper S",
    type: "Hatchback",
    transmission: "Automatic",
    capacity: 4,
    price: "2,500",
    location: "Houston Texas",
    image: "/images/4th-img.png",
    category: "Hatchback"
  },
  {
    id: 4,
    name: "Nissan Skyline GT-R",
    type: "Luxury",
    transmission: "Manual",
    capacity: 4,
    price: "10,000",
    location: "Houston Texas",
    image: "/images/5th-img.png",
    category: "Luxury"
  },
  {
    id: 5,
    name: "Polestar 2",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 5,
    price: "4,500",
    location: "Houston Texas",
    image: "/images/6th-img.png",
    category: "Sedan"
  },
  {
    id: 6,
    name: "BMW X6",
    type: "SUVs",
    transmission: "Automatic",
    capacity: 5,
    price: "6,000",
    location: "Houston Texas",
    image: "/images/8th-img.png",
    category: "SUVs"
  },
];

const CATEGORIES = ["All", "Jeep", "Hatchback", "Luxury", "SUVs", "Sedan", "Van"];

export default function OurFleetPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredVehicles = activeCategory === "All" 
    ? VEHICLES 
    : VEHICLES.filter(v => v.category === activeCategory);

  return (
    <>
      <Navbar />
      
      <main style={{ paddingTop: '100px', minHeight: '100vh', background: '#fcfcfc' }}>
        {/* Hero Section */}
        <section className="fleet-hero" style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
          <div className="container">
            <span className="badge" style={{ marginBottom: 'var(--space-4)' }}>Discover Our Fleet</span>
            <h1 className="heading-1" style={{ fontSize: '48px', marginBottom: 'var(--space-4)', fontWeight: 700 }}>
              A car for every journey
            </h1>
            <p className="body-lg" style={{ maxWidth: '600px', marginInline: 'auto', marginBottom: 'var(--space-8)', color: 'var(--color-muted)' }}>
              From self-drives to chauffeur-led comfort, explore vehicles designed to move you effortlessly.
            </p>
            
            <DownloadButtons variant="default" />

            {/* Continuous Carousel */}
            <div className="hero-carousel">
              <div className="hero-carousel__track">
                {/* Set 1 */}
                <div className="hero-carousel__col">
                  <Image src="/images/1st-img.png" alt="VW Bus" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/2nd-img.jpg" alt="Interior" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>
                <div className="hero-carousel__col">
                  <Image src="/images/3rd-img.png" alt="Tesla" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/4th-img.png" alt="Mini Cooper" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>
                <div className="hero-carousel__col hero-carousel__col--single">
                  <Image src="/images/5th-img.png" alt="Red GTR" width={250} height={300} className="hero-carousel__img hero-carousel__img--large" />
                </div>
                <div className="hero-carousel__col">
                  <Image src="/images/6th-img.png" alt="Polestar" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/7th-img.png" alt="Charging" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>
                <div className="hero-carousel__col">
                  <Image src="/images/8th-img.png" alt="BMW X6" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/9th-img.png" alt="Red Honda" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>

                {/* Set 2 (Duplicate for seamless loop) */}
                <div className="hero-carousel__col">
                  <Image src="/images/1st-img.png" alt="VW Bus" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/2nd-img.jpg" alt="Interior" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>
                <div className="hero-carousel__col">
                  <Image src="/images/3rd-img.png" alt="Tesla" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/4th-img.png" alt="Mini Cooper" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>
                <div className="hero-carousel__col hero-carousel__col--single">
                  <Image src="/images/5th-img.png" alt="Red GTR" width={250} height={300} className="hero-carousel__img hero-carousel__img--large" />
                </div>
                <div className="hero-carousel__col">
                  <Image src="/images/6th-img.png" alt="Polestar" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/7th-img.png" alt="Charging" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>
                <div className="hero-carousel__col">
                  <Image src="/images/8th-img.png" alt="BMW X6" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                  <Image src="/images/9th-img.png" alt="Red Honda" width={250} height={140} className="hero-carousel__img hero-carousel__img--small" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Section */}
        <section className="fleet-section" style={{ paddingBlock: 'var(--space-20)', background: '#fff' }}>
          <div className="container">
            <div className="fleet-section__header" style={{ marginBottom: 'var(--space-12)' }}>
              <h2 className="heading-2" style={{ fontSize: '36px', marginBottom: 'var(--space-2)' }}>Our Fleet</h2>
              <p className="body-md" style={{ color: 'var(--color-muted)' }}>
                A <strong>sneak peek</strong> of our wide range of premium vehicles to match your lifestyle and needs.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="fleet-filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`filter-tab ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    background: activeCategory === category ? 'var(--color-primary)' : 'transparent',
                    color: activeCategory === category ? '#fff' : 'var(--color-primary)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Vehicle Grid */}
            <div className="fleet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
              {filteredVehicles.map(vehicle => (
                <div key={vehicle.id} className="fleet-card" style={{ background: '#fcfcfc', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div className="fleet-card__img-wrapper" style={{ position: 'relative', height: '220px' }}>
                    <Image src={vehicle.image} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="fleet-card__content" style={{ padding: 'var(--space-5)' }}>
                    <div className="fleet-card__meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {vehicle.location}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '18px' }}>${vehicle.price}<span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-muted)' }}>/day</span></span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-4)' }}>{vehicle.name}</h3>
                    <div className="fleet-card__specs" style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--color-muted)' }}>
                      <span>{vehicle.type}</span>
                      <span>•</span>
                      <span>{vehicle.transmission}</span>
                      <span>•</span>
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {vehicle.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="fleet-pagination" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'var(--space-12)' }}>
              <button className="pagination-btn active" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-primary)', color: '#fff', fontWeight: 600 }}>1</button>
              <button className="pagination-btn" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600 }}>2</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
