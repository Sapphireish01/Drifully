export interface Review {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
}

export interface Vehicle {
  id: number;
  slug: string;
  name: string;
  type: string; // e.g. Sedan, SUV, Jeep, Luxury
  transmission: string; // Automatic, Manual
  capacity: number;
  price: string; // numeric string e.g. "3,000" or "120"
  priceNumber: number;
  location: string;
  image: string;
  category: "family" | "popular" | "event" | "all";
  rating: string;
  reviewsCount: number;
  fuel: string;
  gallery: string[];
  features: string[];
  reviews: Review[];
  rules?: string[];
}

export const CATEGORIES = [
  {
    id: "family",
    title: "Perfect for Family Trips",
    subtitle: "Spacious vehicles for road trips and family travel.",
    slug: "perfect-for-family-trips"
  },
  {
    id: "popular",
    title: "Popular right now",
    subtitle: "The most booked vehicles this week",
    slug: "popular-right-now"
  },
  {
    id: "event",
    title: "Event Ready",
    subtitle: "Make every occasion memorable.",
    slug: "event-ready"
  }
];

export const VEHICLES: Vehicle[] = [
  {
    id: 1,
    slug: "toyota-highlander-2026",
    name: "Toyota Highlander 2026",
    type: "Jeep",
    transmission: "Automatic",
    capacity: 7,
    price: "120",
    priceNumber: 120,
    location: "Houston,Texas",
    image: "/images/2nd-img.jpg",
    category: "family",
    rating: "4.8",
    reviewsCount: 124,
    fuel: "Petrol",
    gallery: [
      "/images/2nd-img.jpg",
      "/images/our-story-img1.jpg",
      "/images/our-story-img2.jpg",
      "/images/our-story-img3.jpg",
      "/images/about-us-hero-img.jpg"
    ],
    features: [
      "Air Conditioning",
      "Air Bags",
      "Heated Seats",
      "Climate Control",
      "USB Charging Ports",
      "Bluetooth",
      "Anti-lock Braking System",
      "Navigation"
    ],
    reviews: [
      {
        id: "r1",
        author: "Sandra Smith",
        date: "30 April 2026",
        rating: 4.5,
        title: "Wonderful Experience",
        comment: "I had a wonderful experience with this vehicle. It was clean, comfortable, and drove perfectly throughout my trip."
      },
      {
        id: "r2",
        author: "Marcus Vance",
        date: "12 May 2026",
        rating: 5,
        title: "Perfect for special occasions",
        comment: "I rented this for an event and it was exactly what I needed. Stylish and very comfortable."
      }
    ]
  },
  {
    id: 2,
    slug: "toyota-corolla-2022-silver",
    name: "Toyota Corolla 2022",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 4,
    price: "3,000",
    priceNumber: 3000,
    location: "Houston,Texas",
    image: "/images/hero-img.png",
    category: "family",
    rating: "4.9",
    reviewsCount: 86,
    fuel: "Petrol",
    gallery: [
      "/images/hero-img.png",
      "/images/3rd-img.png",
      "/images/4th-img.png",
      "/images/5th-img.png",
      "/images/6th-img.png"
    ],
    features: [
      "Air Conditioning",
      "Air Bags",
      "USB Charging Ports",
      "Bluetooth",
      "Anti-lock Braking System"
    ],
    reviews: [
      {
        id: "r3",
        author: "John Doe",
        date: "10 March 2026",
        rating: 5,
        title: "Great everyday car",
        comment: "Extremely smooth, fuel efficient, and super easy to pick up."
      }
    ]
  },
  {
    id: 3,
    slug: "toyota-corolla-2022-grey",
    name: "Toyota Corolla 2022",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 4,
    price: "3,000",
    priceNumber: 3000,
    location: "Houston,Texas",
    image: "/images/3rd-img.png",
    category: "family",
    rating: "4.7",
    reviewsCount: 52,
    fuel: "Petrol",
    gallery: [
      "/images/3rd-img.png",
      "/images/hero-img.png",
      "/images/4th-img.png",
      "/images/5th-img.png",
      "/images/6th-img.png"
    ],
    features: [
      "Air Conditioning",
      "Air Bags",
      "Climate Control",
      "Bluetooth",
      "Navigation"
    ],
    reviews: []
  },
  {
    id: 4,
    slug: "toyota-corolla-2022-popular-1",
    name: "Toyota Corolla 2022",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 4,
    price: "3,000",
    priceNumber: 3000,
    location: "Houston,Texas",
    image: "/images/3rd-img.png",
    category: "popular",
    rating: "4.8",
    reviewsCount: 94,
    fuel: "Petrol",
    gallery: [
      "/images/3rd-img.png",
      "/images/hero-img.png",
      "/images/2nd-img.jpg",
      "/images/4th-img.png",
      "/images/5th-img.png"
    ],
    features: ["Air Conditioning", "Air Bags", "Bluetooth"],
    reviews: []
  },
  {
    id: 5,
    slug: "toyota-corolla-2022-popular-2",
    name: "Toyota Corolla 2022",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 4,
    price: "3,000",
    priceNumber: 3000,
    location: "Houston,Texas",
    image: "/images/hero-img.png",
    category: "popular",
    rating: "4.9",
    reviewsCount: 110,
    fuel: "Petrol",
    gallery: [
      "/images/hero-img.png",
      "/images/3rd-img.png",
      "/images/4th-img.png",
      "/images/5th-img.png",
      "/images/6th-img.png"
    ],
    features: ["Air Conditioning", "Air Bags", "Bluetooth", "Navigation"],
    reviews: []
  },
  {
    id: 6,
    slug: "toyota-corolla-2022-popular-3",
    name: "Toyota Corolla 2022",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 4,
    price: "3,000",
    priceNumber: 3000,
    location: "Houston,Texas",
    image: "/images/4th-img.png",
    category: "popular",
    rating: "4.6",
    reviewsCount: 40,
    fuel: "Petrol",
    gallery: [
      "/images/4th-img.png",
      "/images/hero-img.png",
      "/images/3rd-img.png",
      "/images/5th-img.png",
      "/images/6th-img.png"
    ],
    features: ["Air Conditioning", "Air Bags", "Bluetooth"],
    reviews: []
  },
  {
    id: 7,
    slug: "toyota-corolla-2022-event-1",
    name: "Toyota Corolla 2022",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 4,
    price: "3,000",
    priceNumber: 3000,
    location: "Houston,Texas",
    image: "/images/4th-img.png",
    category: "event",
    rating: "4.9",
    reviewsCount: 78,
    fuel: "Petrol",
    gallery: [
      "/images/4th-img.png",
      "/images/5th-img.png",
      "/images/6th-img.png",
      "/images/hero-img.png",
      "/images/3rd-img.png"
    ],
    features: ["Air Conditioning", "Air Bags", "Heated Seats", "Climate Control"],
    reviews: []
  },
  {
    id: 8,
    slug: "toyota-corolla-2022-event-2",
    name: "Toyota Corolla 2022",
    type: "Sedan",
    transmission: "Automatic",
    capacity: 4,
    price: "3,000",
    priceNumber: 3000,
    location: "Houston,Texas",
    image: "/images/3rd-img.png",
    category: "event",
    rating: "4.8",
    reviewsCount: 65,
    fuel: "Petrol",
    gallery: [
      "/images/3rd-img.png",
      "/images/4th-img.png",
      "/images/hero-img.png",
      "/images/5th-img.png",
      "/images/6th-img.png"
    ],
    features: ["Air Conditioning", "Air Bags", "Bluetooth", "Navigation"],
    reviews: []
  }
];
