const REVIEWS = [
  {
    id: "r1",
    title: "Wonderful Experience",
    stars: 4,
    body: "I had a wonderful experience with this vehicle. It was clean, comfortable, and drove perfectly throughout my trip.",
    author: "Sandra Smith",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r2",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r3",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r4",
    title: "Perfect for special occasions",
    stars: 5,
    body: "I rented this for an event and it was exactly what I needed. Stylish and very comfortable.",
    author: "Aisha Carie",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r5",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r6",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r7",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r8",
    title: "Perfect for special occasions",
    stars: 5,
    body: "I rented this for an event and it was exactly what I needed. Stylish and very comfortable.",
    author: "Aisha Carie",
    date: "30 April 2026",
    avatar: null,
  },
  {
    id: "r9",
    title: "Great for family trips",
    stars: 5,
    body: "Very spacious and comfortable. Perfect for our weekend trip with the kids.",
    author: "Michael Duble",
    date: "30 April 2026",
    avatar: null,
  },
];

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="reviews"
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <header className="reviews__header">
          <h2 id="reviews-heading" className="heading-2 reviews__heading">
            Loved By Users
          </h2>
          <p className="reviews__subtext">
            Real experiences from people who trust Drifully for their everyday
            journeys.
          </p>
        </header>

        <div className="reviews__grid" role="list">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[0] }) {
  return (
    <article className="review-card" role="listitem" id={review.id}>
      <div className="review-card__top">
        <h3 className="review-card__title">{review.title}</h3>
        <div className="review-card__stars" aria-label={`${review.stars} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="review-card__star"
              aria-hidden="true"
            >
              {i < review.stars ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>

      <p className="review-card__body">{review.body}</p>

      <div className="review-card__author">
        {/* Avatar placeholder */}
        <div
          className="review-card__avatar"
          role="img"
          aria-label={`${review.author} avatar`}
          style={{
            background: "var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          👤
        </div>
        <div>
          <p className="review-card__name">{review.author}</p>
          <p className="review-card__date">{review.date}</p>
        </div>
      </div>
    </article>
  );
}
