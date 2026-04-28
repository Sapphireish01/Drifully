"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ_ITEMS = [
  {
    question: "How does Drifully work?",
    answer: "Download the app, create an account, choose whether you want to drive yourself or hire a chauffeur, select your vehicle, and book. It's that simple.",
  },
  {
    question: "What's the difference between Self-Drive and Chauffeur?",
    answer: "Self-Drive gives you the keys to the vehicle for complete independence. Chauffeur service provides a professional driver so you can relax or work on the go.",
  },
  {
    question: "How does Airport service work?",
    answer: "Provide your flight details, and a vehicle will be ready for you upon arrival. For Chauffeur service, your driver will meet you at the terminal.",
  },
  {
    question: "Do I need a driver's license for Chauffeur service?",
    answer: "No, you only need a valid driver's license if you choose the Self-Drive option.",
  },
  {
    question: "What are the age requirements?",
    answer: "To rent a car for Self-Drive, you must be at least 21 years old with a valid driver's license held for at least one year.",
  },
  {
    question: "Is insurance included?",
    answer: "Yes, basic insurance is included in all rentals. You can choose to upgrade to comprehensive coverage during booking.",
  },
  {
    question: "How do I cancel or modify a booking?",
    answer: "You can cancel or modify your booking directly through the app up to 24 hours before your scheduled trip for a full refund.",
  },
];

export default function AboutUsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container about-hero__container">
            <div className="about-hero__content">
              <h1 className="about-hero__title">Move freely.<br />Arrive effortlessly.</h1>
              <p className="about-hero__desc">
                Every journey matters, whether it's a quick ride across town, a family trip, or a moment that needs to feel just right.
                <br />
                Drifully exists to make every move simple, smooth, and entirely yours.
              </p>
              <div className="about-hero__actions">
                <Link
                  href="/download"
                  className="btn"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '170%',
                    letterSpacing: '-0.3px',
                    textAlign: 'center',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: '1.5px solid #000'
                  }}
                >
                  Download The App
                </Link>
                <Link href="#story" className="btn btn-ghost-white">
                  Learn About Drifully
                </Link>
              </div>
              <p className="about-hero__meta">Safe, reliable, and always there when you need us</p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="about-story">
          <div className="container">
            <div className="about-story__grid">
              {/* Left Column */}
              <div className="about-story__left-col">
                <h2 className="about-story__title">Our Story</h2>
                <p className="about-story__lead">
                  Getting around shouldn't feel <span style={{ color: "#999999" }}>complicated</span>.<br />
                  It shouldn't involve <span style={{ color: "#999999" }}>stress, uncertainty, or wasted time.</span>
                </p>
                <Image
                  src="/images/our-story-img1.jpg"
                  alt="Woman with coffee checking her phone"
                  width={500}
                  height={400}
                  className="about-story__main-img"
                  priority
                />
                <p className="about-story__bottom-text">No compromises. Just options that fit your life.</p>
              </div>

              {/* Right Column */}
              <div className="about-story__right-col">
                <p className="about-story__text" style={{ marginTop: 'var(--space-12)' }}>
                  Drifully was built on a simple idea:<br />
                  <strong>You deserve a better</strong> way to move. A way that gives you control when you want it, and <strong>comfort</strong> when you need it.
                </p>

                <div className="about-story__composite">
                  <div className="about-story__composite-left">
                    <Image
                      src="/images/our-story-img2.jpg"
                      alt="Happy friends in a car"
                      width={350}
                      height={250}
                      className="about-story__composite-img"
                    />
                  </div>
                  <div className="about-story__composite-right">
                    <p className="about-story__composite-text">
                      Some days, you want the wheel. Other days, you just want to sit back and enjoy the ride.
                    </p>
                    <Image
                      src="/images/our-story-img3.jpg"
                      alt="Family road trip"
                      width={250}
                      height={150}
                      className="about-story__composite-img-small"
                    />
                  </div>
                </div>

                <p className="about-story__text" style={{ marginTop: 'var(--space-6)' }}>
                  With Drifully, <strong>you choose</strong>.
                </p>
                <ul className="about-arrival__list" style={{ marginTop: 0 }}>
                  <li className="about-arrival__list-item">Drive yourself when you want freedom and control</li>
                  <li className="about-arrival__list-item">Ride with a chauffeur when you want ease and peace of mind</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="about-mission">
          <div className="container">
            <div className="about-mission__grid">
              <h2 className="about-mission__title">OUR MISSION</h2>
              <div className="about-mission__content">
                <p>
                  To remove the friction from moving, and replace it with freedom, confidence, and ease. We believe getting from one place to another should feel effortless. Not stressful. Not complicated. Not uncertain.
                </p>
                <p>
                  So we're building a platform where every detail is considered, from the moment you book, to the moment you arrive. Where you don't have to think twice about availability, worry about reliability, or second-guess your choice.
                </p>
                <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  Just open the app, choose your ride, and go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Arrival & Trust Section */}
        <section className="about-arrival">
          <div className="container">
            <div className="about-arrival__grid">
              <div className="about-arrival__img-composite">
                <Image
                  src="/images/handsome-man.jpg"
                  alt="Man in suit opening car door"
                  width={300}
                  height={500}
                  className="about-arrival__img-large"
                />
                <div className="about-arrival__img-stack">
                  <Image
                    src="/images/couple.jpg"
                    alt="Couple enjoying a ride"
                    width={240}
                    height={245}
                    className="about-arrival__img-small"
                  />
                  <Image
                    src="/images/last-car-img.jpg"
                    alt="Premium car in garage"
                    width={240}
                    height={245}
                    className="about-arrival__img-small"
                  />
                </div>
              </div>

              <div className="about-arrival__content">
                <div>
                  <h2 className="about-arrival__section-title">From Arrival To Anywhere</h2>
                  <p className="about-story__text">
                    Travel should feel seamless from the moment you land.
                    <br />
                    <strong>We make that possible.</strong>
                  </p>
                  <p className="about-story__text" style={{ marginTop: 'var(--space-2)', color: "var(--color-muted)" }}>
                    Step out of the airport and into a clean, ready vehicle, fully fueled and waiting, so you can go straight to where you need to be.
                  </p>
                  <p className="about-story__text" style={{ marginTop: 'var(--space-2)' }}>
                    No delays. No confusion. Just movement.
                  </p>
                </div>

                <div>
                  <h2 className="about-arrival__section-title">Built With Trust</h2>
                  <p className="about-story__text">
                    We know what matters:
                  </p>
                  <ul className="about-arrival__list">
                    <li className="about-arrival__list-item">A car that's ready when you are</li>
                    <li className="about-arrival__list-item">A process that doesn't waste your time</li>
                    <li className="about-arrival__list-item">A service you can rely on, every single time</li>
                  </ul>
                  <p className="about-story__text" style={{ marginTop: 'var(--space-4)' }}>
                    So we've built Drifully to be exactly that, <span style={{ fontWeight: 600, color: "var(--color-primary)" }}> simple, dependable, and always ready</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="about-faq">
          <div className="container">
            <div className="about-faq__header">
              <h2 className="about-faq__title">Frequently Asked Questions</h2>
              <p className="about-faq__subtitle">Got Questions? We've Got Clear Answers.</p>
            </div>

            <div className="about-faq__grid">
              {/* Left Column */}
              <div className="about-faq__col">
                {FAQ_ITEMS.slice(0, 4).map((item, index) => {
                  const globalIndex = index;
                  const isOpen = openFaqIndex === globalIndex;
                  return (
                    <div
                      key={globalIndex}
                      className="about-faq__item"
                      data-open={isOpen ? "true" : "false"}
                    >
                      <button
                        className="about-faq__question"
                        onClick={() => toggleFaq(globalIndex)}
                        aria-expanded={isOpen}
                      >
                        {item.question}
                        <span className="about-faq__icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                      <div className="about-faq__answer">
                        <p className="about-faq__answer-text">{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="about-faq__col">
                {FAQ_ITEMS.slice(4).map((item, index) => {
                  const globalIndex = index + 4;
                  const isOpen = openFaqIndex === globalIndex;
                  return (
                    <div
                      key={globalIndex}
                      className="about-faq__item"
                      data-open={isOpen ? "true" : "false"}
                    >
                      <button
                        className="about-faq__question"
                        onClick={() => toggleFaq(globalIndex)}
                        aria-expanded={isOpen}
                      >
                        {item.question}
                        <span className="about-faq__icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                      <div className="about-faq__answer">
                        <p className="about-faq__answer-text">{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="about-faq__cta" style={{ textAlign: 'left', marginTop: 'var(--space-12)' }}>
              <p style={{ color: '#999999', marginBottom: 'var(--space-4)', fontSize: '15px' }}>
                Still have questions? Our support team is ready to help
              </p>
              <Link href="/contact-us" className="btn btn-primary" style={{ backgroundColor: '#111', color: '#fff', borderRadius: '12px', padding: '12px 30px' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main >

      <Footer />
    </>
  );
}
