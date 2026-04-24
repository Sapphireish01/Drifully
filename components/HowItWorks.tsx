const STEPS = [
  {
    number: "01",
    title: "Pick A Ride",
    description:
      "Browse hundreds of vehicles and filter by type, feature, price and more.",
    visual: "phone-mockup",
  },
  {
    number: "02",
    title: "Select Dates",
    description:
      "Set your pickup and return time based on when you need the car",
    visual: "date-picker",
  },
  {
    number: "03",
    title: "Confirm & Go",
    description:
      "Review your details, book instantly, and get ready to hit the road without delays",
    visual: "confirm",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="howitworks"
      aria-labelledby="how-heading"
    >
      <div className="container">
        {/* Header */}
        <header className="howitworks__header">
          <h2 id="how-heading" className="heading-2 howitworks__heading">
            Book in 3 simple steps
          </h2>
          <p>
            Get from booking to driving in just a few simple steps—quick,
            seamless, and designed for your convenience
          </p>
        </header>

        {/* Steps */}
        <div className="howitworks__grid" role="list">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  return (
    <article className="step-card" role="listitem" id={`step-${step.number}`}>
      {/* Watermark number */}
      {/* <span className="step-card__number" aria-hidden="true">
        {step.number}
      </span> */}

      {/* Title */}
      <h3 className="step-card__title">{step.title}</h3>

      {/* Visual area */}
      <div
        className="step-card__visual"
        aria-hidden="true"
        style={index === 0 ? { alignItems: "flex-end", paddingTop: "var(--space-8)" } : undefined}
      >
        {index === 0 && (
          <img
            src="/images/1st-card.svg"
            alt="Pick A Ride Phone"
            style={{ width: "71%", height: "auto", objectFit: "contain" }}
          />
        )}
        {index === 1 && <DatePickerMockup />}
        {index === 2 && <ConfirmMockup />}
      </div>


      {/* Description */}
      <p className="body-md step-card__desc">{step.description}</p>
    </article>
  );
}

/* ── Visual: date picker for Step 2 ── */
function DatePickerMockup() {
  return (
    <div
      style={{
        width: "85%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div className="date-picker-mock">
        <p className="date-picker-mock__label">Pick-up and Drop Off dates</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span className="date-picker-mock__value">30 Mar 2025</span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.55rem",
              color: "var(--color-muted)",
            }}
          >
            Edit 📅
          </span>
        </div>
        <div
          style={{ borderBottom: "1px solid var(--color-border)", margin: "6px 0" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p className="date-picker-mock__label">Daily Rate</p>
            <p className="date-picker-mock__value">$120</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="date-picker-mock__label">Estimated Total</p>
            <p className="date-picker-mock__total">$340</p>
          </div>
        </div>
        <div className="date-picker-mock__avail">
          <span style={{ color: "#22c55e" }}>●</span>
          <span>Great news — this vehicle is available for your selected dates</span>
        </div>
      </div>
    </div>
  );
}

/* ── Visual: booking confirmed for Step 3 ── */
function ConfirmMockup() {
  return (
    <div className="step-card__confirm-box" style={{ width: "100%" }}>
      <div className="step-card__confirm-icon" aria-hidden="true">✓</div>
      <p className="step-card__confirm-title">Booking Confirmed 🎉</p>
      <p className="step-card__confirm-sub">
        Your vehicle has been successfully reserved for your selected dates.
      </p>
    </div>
  );
}
