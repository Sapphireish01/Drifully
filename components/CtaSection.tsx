import Link from "next/link";

export default function CtaSection() {
  return (
    <div className="container">
      <section
        id="download"
        className="cta-section"
        aria-labelledby="cta-heading"
      >
        {/* Decorative glows */}
        <div className="cta-section__glow cta-section__glow--left" aria-hidden="true" />
        <div className="cta-section__glow cta-section__glow--right" aria-hidden="true" />

        {/* Copy */}
        <div className="cta-section__content">
          <h2 id="cta-heading" className="cta-section__heading">
            Your ride is just a tap away
          </h2>
          <p className="cta-section__sub">
            Download Drifully and start your journey today.
          </p>
          <div className="cta-section__actions">
            <Link
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get Drifully on Google Play"
              className="btn btn-white"
            >
              <GooglePlayIcon />
              Get it on Google Play
            </Link>
            <Link
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Drifully on the App Store"
              className="btn btn-ghost-white"
            >
              <AppleIcon />
              Download on App Store
            </Link>
          </div>
        </div>

        {/* Phone visuals */}
        <div className="cta-section__visual" aria-hidden="true">
          {/* Back phone — white splash screen */}
          <div className="cta-phone cta-phone--back">
            <div className="cta-phone__screen">
              <div
                style={{
                  height: "100%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 22,
                }}
              >
                <span className="cta-phone__logo">Drifully</span>
              </div>
            </div>
          </div>

          {/* Front phone — dark app screen */}
          <div className="cta-phone cta-phone--front">
            <div className="cta-phone__screen">
              <div className="cta-appscreen">
                {/* Status bar */}
                <div className="cta-appscreen__bar">
                  <span>9:30</span>
                  <span>●●●</span>
                </div>

                {/* Greeting */}
                <p className="cta-appscreen__greeting">Hello Prosper,</p>
                <p className="cta-appscreen__tag">123 Abingdon Road, Ilford</p>

                {/* Section 1 */}
                <p className="cta-appscreen__label">Perfect for Family Trips</p>
                <p className="cta-appscreen__sub">
                  Spacious vehicles for road trips and family moves
                </p>
                <div className="cta-appscreen__card">
                  <div
                    style={{
                      height: 36,
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />
                  <div className="cta-appscreen__card-info">
                    <span className="cta-appscreen__car-name">Toyota Highlander</span>
                    <span className="cta-appscreen__car-price">$3,000 &gt;</span>
                  </div>
                </div>

                {/* Section 2 */}
                <p className="cta-appscreen__label">Popular right now</p>
                <p className="cta-appscreen__sub">
                  The most booked vehicles this week
                </p>
                <div className="cta-appscreen__card">
                  <div
                    style={{
                      height: 36,
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />
                  <div className="cta-appscreen__card-info">
                    <span className="cta-appscreen__car-name">Toyota Corolla 2022</span>
                    <span className="cta-appscreen__car-price">$3,000 &gt;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.18 23.76a2 2 0 0 0 2.25-.43l12.84-7.41-3.23-3.23L3.18 23.76zM21.37 10.22l-2.8-1.62-3.61 3.61 3.61 3.61 2.82-1.63a2.01 2.01 0 0 0 0-3.97zM2.01 1.15A2 2 0 0 0 2 2v20a2 2 0 0 0 .01.85l11.27-11.27L2.01 1.15zM18.27 2.66 5.43.06a2 2 0 0 0-2.25.44l11.66 11.66 3.43-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
