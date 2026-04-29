"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { VEHICLES } from "@/data/vehicles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
function StarIcon({ size = 27, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#000"
      stroke="none"
      className={className}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}


function FeatureIcon({ name }: { name: string }) {
  switch (name) {
    case "Air Conditioning":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2v20M17 5H7M19 12H5M17 19H7" />
        </svg>
      );
    case "Air Bags":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "Heated Seats":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 12h16M4 18h16M12 6v6" />
        </svg>
      );
    case "Climate Control":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      );
    case "USB Charging Ports":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 12h-4M6 12h4M12 6v12" />
        </svg>
      );
    case "Bluetooth":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6.5 17.5l11-11L12 2v20l5.5-4.5-11-11" />
        </svg>
      );
    case "Anti-lock Braking System":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "Navigation":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
  }
}

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const vehicle = VEHICLES.find(v => v.id === parseInt(unwrappedParams.id));

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
          <h1 className="heading-1">Vehicle Not Found</h1>
          <p style={{ marginTop: '20px' }}>
            <Link href="/our-fleet" className="btn btn-primary">Back to Fleet</Link>
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: '120px', paddingBottom: '120px', background: '#fcfcfc' }}>
        <div className="container">
          {/* Back Button */}
          <Link href="/our-fleet" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-8)', color: 'var(--color-muted)', textDecoration: 'none', fontWeight: 500 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Fleet
          </Link>

          {/* Gallery Grid */}
          <div className="vehicle-gallery" style={{ marginBottom: 'var(--space-12)' }}>
            <div className="gallery-top" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', height: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image src={vehicle.gallery[0]} alt={vehicle.name} fill style={{ objectFit: 'cover' }} priority />
              </div>
              <div style={{ position: 'relative', height: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image src={vehicle.gallery[1]} alt={vehicle.name} fill style={{ objectFit: 'cover' }} priority />
              </div>
            </div>
            <div className="gallery-bottom" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ position: 'relative', height: '220px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image src={vehicle.gallery[2]} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'relative', height: '220px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image src={vehicle.gallery[3]} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'relative', height: '220px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image src={vehicle.gallery[4]} alt={vehicle.name} fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="vehicle-details-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
            {/* Left Column (Info) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
                <h1 className="heading-1" style={{ fontSize: '36px', fontWeight: 700 }}>{vehicle.name}</h1>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
                <span style={{ background: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {vehicle.capacity} Seats
                </span>
                <span style={{ background: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  {vehicle.category}
                </span>
                <span style={{ background: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  {vehicle.transmission}
                </span>
                <span style={{ background: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 14h18M12 3v18" />
                  </svg>
                  {vehicle.fuel}
                </span>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 'var(--space-6)' }}>Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {vehicle.features.map(feature => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: 'var(--color-primary)' }}>
                      <div style={{ color: 'var(--color-muted)' }}>
                        <FeatureIcon name={feature} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules of the Road */}
              <div style={{ padding: '32px', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Rules of the road</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {vehicle.rules.map((rule, index) => {
                    const parts = rule.split('.');
                    const title = parts[0];
                    const desc = parts.slice(1).join('.');
                    return (
                      <div key={index}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{index + 1}. {title}</h3>
                        {desc && <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: '150%' }}>{desc.trim()}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column (Sticky Card) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
                <StarIcon size={22} />
                <span style={{ fontWeight: 400, color: 'var(--color-muted)' }}>{vehicle.rating}</span>
                <span style={{ color: 'var(--color-muted)', fontSize: '14px' }}>({vehicle.reviews} reviews)</span>
              </div>
              <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 700 }}>${vehicle.price}<span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-muted)' }}>/day</span></span>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Before taxes</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#111', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
