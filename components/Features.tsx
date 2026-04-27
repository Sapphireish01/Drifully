import Image from "next/image";

const FEATURES = [
  {
    id: "flexible-rentals",
    title: "Flexible Rentals",
    iconSrc: "/icons/new-Flexible-Rentals.svg",
    image: "/images/rentalsimage.png",
    description: (
      <>
        Whether you prefer the <span style={{ color: "#000" }}>freedom</span> of being{" "}
        <span style={{ color: "#000" }}>behind the wheel</span> or the comfort of a{" "}
        <span style={{ color: "#000" }}>professional driver</span>, Drifully adapts to your needs.
        Choose what fits <span style={{ color: "#000" }}>your schedule, your mood, and your journey</span>,{" "}
        every time.
      </>
    ),
  },
  {
    id: "reliable-secure",
    title: "Reliable & Secure",
    iconSrc: "/icons/new-reliable.svg",
    image: "/images/reliableandsecure-female.png",
    description: (
      <>
        Every vehicle is <span style={{ color: "#000" }}>carefully maintained</span> and every driver{" "}
        <span style={{ color: "#000" }}>professionally vetted</span> to ensure a safe, dependable
        experience. With clear pricing and <span style={{ color: "#000" }}>no hidden fees</span>, you
        can book with complete <span style={{ color: "#000" }}>confidence</span> from start to finish.
      </>
    ),
  },
  {
    id: "fast-booking",
    title: "Fast Booking",
    iconSrc: "/icons/fastbooking.svg",
    image: "/images/fast-booking.png",
    description: (
      <>
        From selecting your ride to confirming your trip, everything is designed
        to be <span style={{ color: "#000" }}>quick and effortless.</span>
      </>
    ),
  },
  {
    id: "vehicle-range",
    title: "Choose from a wide range of vehicles",
    iconSrc: "/icons/widerange.svg",
    image: "/images/wide-range.png",
    description: (
      <>
        Whether it's a quick trip, a family outing, or a special occasion,{" "}
        <span style={{ color: "#000" }}>find the perfect car for every kind of journey</span>
      </>
    ),
  },
  {
    id: "support",
    title: "24/7 Support",
    iconSrc: "/icons/2-4-7support.svg",
    image: "/images/24-7support.png",
    description: (
      <>
        Our team is <span style={{ color: "#000" }}>available around the clock</span> via chat, phone,
        or email.
      </>
    ),
  },
];

export default function Features() {
  return (
    <section id="why-drifully" className="features" aria-labelledby="features-heading" style={{ background: "#FAFAFA" }}>
      <div className="container" style={{ paddingBlock: "80px" }}>
        {/* Header */}
        <header className="features__header" style={{ textAlign: "center", marginBottom: "48px" }}>
          <p className="overline" style={{ marginBottom: "16px", color: "#868C98" }}>Why Use Drifully?</p>
          <h2 id="features-heading" className="heading-2" style={{ marginBottom: "24px" }}>
            We're Built For Every Journey
          </h2>
          <div className="features__tags">
            {["Family Trips", "Corporate Travel", "Events & Occasions", "Everyday Use"].map((tag, index, arr) => (
              <span key={tag} className="features__tag">
                {tag}
                {index < arr.length - 1 && <span className="features__tag-dot" aria-hidden="true" />}
              </span>
            ))}
          </div>
        </header>

        {/* 3-Column Grid */}
        <div className="features__grid">
          {/* Row 1, Col 1: Flexible Rentals */}
          <article
            className="feature-card feature-card--span-4"
            id="flexible-rentals"
            style={{
              height: "300px",
              borderRadius: "12px",
              padding: "12px",
              gap: "8px",
              borderWidth: "1px",
              opacity: 1,
              // width: "503px"
            }}
          >
            <div className="feature-card__header">
              <div className="feature-card__icon" style={{ border: "2px solid var(--color-border)", borderRadius: "var(--radius-md)", width: "36px", height: "36px" }}>
                <Image src={FEATURES[0].iconSrc} alt="" width={20} height={20} />
              </div>
              <h3 className="feature-card__title">{FEATURES[0].title}</h3>
            </div>
            <p className="feature-card__desc">{FEATURES[0].description}</p>
            <div className="feature-card__image-container" style={{ marginTop: "12px", flexGrow: 1, minHeight: "100px", position: "relative", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <Image
                src={FEATURES[0].image!}
                alt="Flexible Rentals"
                fill
                style={{ objectFit: "contain", padding: "16px" }}
              />
            </div>
          </article>

          {/* Row 1, Col 2 & 3: Reliable & Secure */}
          <article className="feature-card feature-card--span-6" id="reliable-secure" style={{
            // width: "711px", 
            height: "300px"
          }}>
            <div className="feature-card__header">
              <div className="feature-card__icon" style={{ border: "2px solid var(--color-border)", borderRadius: "var(--radius-md)", width: "36px", height: "36px" }}>
                <Image src={FEATURES[1].iconSrc} alt="" width={20} height={20} />
              </div>
              <h3 className="feature-card__title">{FEATURES[1].title}</h3>
            </div>
            <div className="feature-card__image-container" style={{ marginTop: "12px", flexGrow: 1, minHeight: "100px", position: "relative", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <Image
                src={FEATURES[1].image!}
                alt="Reliable and Secure"
                fill
                style={{ objectFit: "contain", padding: "16px" }}
              />
            </div>
            <p className="feature-card__desc">{FEATURES[1].description}</p>
          </article>

          {/* Row 2, Col 1: Fast Booking */}
          <article className="feature-card feature-card--span-3" id="fast-booking" style={{ height: "300px" }}>
            <div className="feature-card__image-container" style={{ position: "relative", width: "100%", flexGrow: 1, minHeight: "100px", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "16px" }}>
              <Image src={FEATURES[2].image!} alt={FEATURES[2].title} fill style={{ objectFit: "contain", padding: "16px" }} />
            </div>
            <div className="feature-card__header">
              <div className="feature-card__icon" style={{ border: "2px solid var(--color-border)", borderRadius: "var(--radius-md)", width: "36px", height: "36px" }}>
                <Image src={FEATURES[2].iconSrc} alt="" width={20} height={20} />
              </div>
              <h3 className="feature-card__title">{FEATURES[2].title}</h3>
            </div>
            <p className="feature-card__desc">{FEATURES[2].description}</p>
          </article>

          {/* Row 2, Col 2: Choose from a wide range of vehicles */}
          <article className="feature-card feature-card--span-4" id="vehicle-range" style={{ height: "300px" }}>
            <div className="feature-card__header">
              <div className="feature-card__icon" style={{ border: "2px solid var(--color-border)", borderRadius: "var(--radius-md)", width: "36px", height: "36px" }}>
                <Image src={FEATURES[3].iconSrc} alt="" width={20} height={20} />
              </div>
              <h3 className="feature-card__title">{FEATURES[3].title}</h3>
            </div>
            <p className="feature-card__desc">{FEATURES[3].description}</p>
            <div className="feature-card__image-container" style={{ position: "relative", width: "100%", flexGrow: 1, minHeight: "100px", borderRadius: "var(--radius-md)", overflow: "hidden", marginTop: "12px" }}>
              <Image src={FEATURES[3].image!} alt={FEATURES[3].title} fill style={{ objectFit: "contain", padding: "16px" }} />
            </div>
          </article>

          {/* Row 2, Col 3: 24/7 Support */}
          <article className="feature-card feature-card--span-3" id="support" style={{ height: "300px" }}>
            <div className="feature-card__header" style={{ marginBottom: "16px" }}>
              <div className="feature-card__icon" style={{ border: "2px solid var(--color-border)", borderRadius: "var(--radius-md)", width: "36px", height: "36px" }}>
                <Image src={FEATURES[4].iconSrc} alt="" width={20} height={20} />
              </div>
              <h3 className="feature-card__title">{FEATURES[4].title}</h3>
            </div>
            <div className="feature-card__image-container" style={{ position: "relative", width: "100%", flexGrow: 1, minHeight: "100px", marginBottom: "16px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <Image src={FEATURES[4].image!} alt={FEATURES[4].title} fill style={{ objectFit: "contain", padding: "16px" }} />
            </div>
            <p className="feature-card__desc">{FEATURES[4].description}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
