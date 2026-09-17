import Fuse, { IFuseOptions } from "fuse.js";
import { marketingService, BRAND_MAP } from "@/services/marketing-service";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "Our Fleet" | "Blog" | "Company" | "Legal" | "FAQ";
  tag?: string;
  rating?: string;
  reviewsCount?: number;
  date?: string;
  keywords?: string[];
  score?: number;
}

export interface CategorizedSearchResults {
  fleet: SearchItem[];
  blog: SearchItem[];
  company: SearchItem[];
  legal: SearchItem[];
  faq: SearchItem[];
  totalResults: number;
}

// ---------------------------------------------------------------------------
// 1. Static Fleet Index (Derived directly from Backend Fleet Data)
// ---------------------------------------------------------------------------
export const FLEET_SEARCH_ITEMS: SearchItem[] = [
  {
    id: "fleet-33",
    title: "Lexus ES 350 (2023)",
    description: "Sedan • Automatic • Petrol • 5 Seats • ₦95,000/day. Best value & eco-friendly luxury driving.",
    url: "/our-fleet/33",
    category: "Our Fleet",
    tag: "Best Value",
    rating: "4.9",
    reviewsCount: 48,
    keywords: ["lexus", "es 35", "es 350", "sedan", "automatic", "petrol", "best value", "eco friendly", "luxury", "2023"],
  },
  {
    id: "fleet-32",
    title: "BMW 5 Series (2023)",
    description: "Luxury Sedan • Automatic • Petrol • 5 Seats • ₦125,000/day. High-end executive comfort & performance.",
    url: "/our-fleet/32",
    category: "Our Fleet",
    tag: "Luxury",
    rating: "4.9",
    reviewsCount: 36,
    keywords: ["bmw", "5 series", "m5", "sedan", "automatic", "petrol", "luxury", "new arrival", "2023"],
  },
  {
    id: "fleet-31",
    title: "Mercedes-Benz E 350 (2023)",
    description: "Executive Sedan • Automatic • Petrol • 5 Seats • ₦120,000/day. Premium German luxury and ride quality.",
    url: "/our-fleet/31",
    category: "Our Fleet",
    tag: "Luxury",
    rating: "4.9",
    reviewsCount: 52,
    keywords: ["mercedes", "mercedes-benz", "e 350", "e-class", "sedan", "automatic", "petrol", "luxury", "best value", "2023"],
  },
  {
    id: "fleet-30",
    title: "Kia Sorento (2023)",
    description: "7-Seater SUV • Automatic • Petrol • ₦85,000/day. Spacious family SUV with modern safety features.",
    url: "/our-fleet/30",
    category: "Our Fleet",
    tag: "7 Seater",
    rating: "4.8",
    reviewsCount: 29,
    keywords: ["kia", "sorento", "suv", "7 seater", "family", "eco friendly", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-29",
    title: "Kia Sportage (2023)",
    description: "Compact SUV • Automatic • Petrol • 5 Seats • ₦70,000/day. Perfect for weekend getaways and city commutes.",
    url: "/our-fleet/29",
    category: "Our Fleet",
    tag: "Weekend Getaway",
    rating: "4.7",
    reviewsCount: 22,
    keywords: ["kia", "sportage", "suv", "automatic", "petrol", "weekend getaway", "5 seats", "2023"],
  },
  {
    id: "fleet-28",
    title: "Honda CR-V (2023)",
    description: "Hybrid SUV • Automatic • Petrol • 5/7 Seats • ₦80,000/day. Popular, comfortable, and fuel efficient.",
    url: "/our-fleet/28",
    category: "Our Fleet",
    tag: "Hot Cars",
    rating: "4.8",
    reviewsCount: 41,
    keywords: ["honda", "cr-v", "crv", "suv", "7 seater", "hot cars", "automatic", "petrol", "hybrid", "2023"],
  },
  {
    id: "fleet-27",
    title: "Toyota Land Cruiser (2023)",
    description: "Full-Size SUV • Automatic • Petrol • 7 Seats • ₦150,000/day. Unmatched luxury, authority, and rugged presence.",
    url: "/our-fleet/27",
    category: "Our Fleet",
    tag: "Luxury",
    rating: "5.0",
    reviewsCount: 65,
    keywords: ["toyota", "land cruiser", "lc300", "suv", "7 seater", "luxury", "new arrival", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-26",
    title: "Lexus RX 350 F-Sport (2023)",
    description: "Sport Luxury SUV • Automatic • Petrol • 5 Seats • ₦120,000/day. Bold styling, sport tuning, and premium comfort.",
    url: "/our-fleet/26",
    category: "Our Fleet",
    tag: "Sport",
    rating: "4.9",
    reviewsCount: 38,
    keywords: ["lexus", "rx 350", "rx350", "f-sport", "sport", "suv", "luxury", "hot cars", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-25",
    title: "Lexus RX (2010)",
    description: "Midsize SUV • Automatic • Petrol • 5 Seats • ₦120,000/day. Dependable and comfortable budget luxury ride.",
    url: "/our-fleet/25",
    category: "Our Fleet",
    tag: "Budget Friendly",
    rating: "4.6",
    reviewsCount: 19,
    keywords: ["lexus", "rx", "rx 350", "suv", "budget friendly", "automatic", "petrol", "2010"],
  },
  {
    id: "fleet-24",
    title: "Mercedes-Benz C-Class (2023)",
    description: "Compact Luxury Sedan • Automatic • Petrol • 5 Seats • ₦100,000/day. Agile handling and modern tech.",
    url: "/our-fleet/24",
    category: "Our Fleet",
    tag: "New Arrival",
    rating: "4.8",
    reviewsCount: 33,
    keywords: ["mercedes", "mercedes-benz", "c-class", "c300", "sedan", "new arrival", "luxury", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-23",
    title: "Honda Accord (2023)",
    description: "Executive Sedan • Automatic • Petrol • 5 Seats • ₦65,000/day. Smooth highway cruiser with premium interior.",
    url: "/our-fleet/23",
    category: "Our Fleet",
    tag: "Hot Cars",
    rating: "4.8",
    reviewsCount: 45,
    keywords: ["honda", "accord", "sedan", "hot cars", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-22",
    title: "Hyundai Palisade (2023)",
    description: "8-Seater Premium SUV • Automatic • Petrol • ₦95,000/day. Top rated luxury vehicle for large groups.",
    url: "/our-fleet/22",
    category: "Our Fleet",
    tag: "Top Rated",
    rating: "4.9",
    reviewsCount: 30,
    keywords: ["hyundai", "palisade", "suv", "8 seats", "7 seater", "eco friendly", "top rated", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-21",
    title: "Hyundai Santa Fe (2023)",
    description: "7-Seater SUV • Automatic • Petrol • ₦80,000/day. Versatile family crossover with high reliability.",
    url: "/our-fleet/21",
    category: "Our Fleet",
    tag: "7 Seater",
    rating: "4.7",
    reviewsCount: 26,
    keywords: ["hyundai", "santa fe", "suv", "7 seater", "best value", "new arrival", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-20",
    title: "Hyundai Tucson (2023)",
    description: "Compact SUV • Automatic • Petrol • 5 Seats • ₦65,000/day. Stylish and economical daily SUV rental.",
    url: "/our-fleet/20",
    category: "Our Fleet",
    tag: "Budget Friendly",
    rating: "4.7",
    reviewsCount: 24,
    keywords: ["hyundai", "tucson", "suv", "budget friendly", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-19",
    title: "Hyundai Sonata (2023)",
    description: "Midsize Sedan • Automatic • Petrol • 5 Seats • ₦55,000/day. Elegant design and great fuel economy.",
    url: "/our-fleet/19",
    category: "Our Fleet",
    tag: "Weekend Getaway",
    rating: "4.7",
    reviewsCount: 21,
    keywords: ["hyundai", "sonata", "sedan", "luxury", "weekend getaway", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-18",
    title: "Hyundai Elantra (2023)",
    description: "Compact Sedan • Automatic • Petrol • 5 Seats • ₦50,000/day. Sporty, agile, and affordable rental sedan.",
    url: "/our-fleet/18",
    category: "Our Fleet",
    tag: "Sport",
    rating: "4.7",
    reviewsCount: 35,
    keywords: ["hyundai", "elantra", "sedan", "hot cars", "new arrival", "sport", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-17",
    title: "Lexus ES 350 (2018)",
    description: "Luxury Sedan • Automatic • Petrol • 4 Seats • ₦50,000/day. Best value executive sedan with plush quiet cabin.",
    url: "/our-fleet/17",
    category: "Our Fleet",
    tag: "Best Value",
    rating: "4.8",
    reviewsCount: 50,
    keywords: ["lexus", "es 350", "sedan", "best value", "budget friendly", "family", "luxury", "automatic", "petrol", "2018"],
  },
  {
    id: "fleet-16",
    title: "Lexus RX 350 (2012)",
    description: "Luxury Crossover • Automatic • Petrol • 4 Seats • ₦60,000/day. Trusted luxury family SUV for town and trips.",
    url: "/our-fleet/16",
    category: "Our Fleet",
    tag: "Family",
    rating: "4.6",
    reviewsCount: 27,
    keywords: ["lexus", "rx 350", "suv", "best value", "family", "automatic", "petrol", "2012"],
  },
  {
    id: "fleet-15",
    title: "Toyota Prado (2023)",
    description: "Rugged Luxury SUV • Automatic • Petrol • 7 Seats • ₦95,000/day. Ideal for official tours and interstate travel.",
    url: "/our-fleet/15",
    category: "Our Fleet",
    tag: "Luxury",
    rating: "4.9",
    reviewsCount: 58,
    keywords: ["toyota", "prado", "land cruiser prado", "suv", "7 seater", "luxury", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-14",
    title: "Toyota 4Runner (2023)",
    description: "Off-Road SUV • Automatic • Petrol • 7 Seats • ₦90,000/day. Tough build with high clearance and bold stance.",
    url: "/our-fleet/14",
    category: "Our Fleet",
    tag: "Luxury",
    rating: "4.8",
    reviewsCount: 37,
    keywords: ["toyota", "4runner", "suv", "7 seater", "luxury", "off road", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-13",
    title: "Toyota RAV4 (2023)",
    description: "Compact SUV • Automatic • Petrol • 5 Seats • ₦60,000/day. Nimble, comfortable, and reliable road partner.",
    url: "/our-fleet/13",
    category: "Our Fleet",
    tag: "Weekend Getaway",
    rating: "4.8",
    reviewsCount: 42,
    keywords: ["toyota", "rav4", "suv", "weekend getaway", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-12",
    title: "Toyota Avalon (2023)",
    description: "Full-Size Sedan • Automatic • Petrol • 5 Seats • ₦45,000/day. Premium legroom and smooth cruiser feel.",
    url: "/our-fleet/12",
    category: "Our Fleet",
    tag: "Weekend Getaway",
    rating: "4.7",
    reviewsCount: 18,
    keywords: ["toyota", "avalon", "sedan", "weekend getaway", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-11",
    title: "Toyota Highlander (2023)",
    description: "3-Row SUV • Automatic • Petrol • 7 Seats • ₦85,000/day. Top choice for family outings and group vacations.",
    url: "/our-fleet/11",
    category: "Our Fleet",
    tag: "Best Value",
    rating: "4.9",
    reviewsCount: 49,
    keywords: ["toyota", "highlander", "suv", "7 seater", "best value", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-10",
    title: "BMW X3 (2024)",
    description: "Luxury Compact SUV • Automatic • Petrol • 4 Seats • ₦120,000/day. Dynamic handling and modern German luxury.",
    url: "/our-fleet/10",
    category: "Our Fleet",
    tag: "Luxury",
    rating: "4.9",
    reviewsCount: 22,
    keywords: ["bmw", "x3", "suv", "luxury", "automatic", "petrol", "2024"],
  },
  {
    id: "fleet-9",
    title: "Honda Civic (2015)",
    description: "Compact Sedan • Automatic • Diesel • 4 Seats • ₦60,000/day. Reliable, responsive, and fuel conscious.",
    url: "/our-fleet/9",
    category: "Our Fleet",
    tag: "Budget Friendly",
    rating: "4.6",
    reviewsCount: 25,
    keywords: ["honda", "civic", "sedan", "budget friendly", "automatic", "diesel", "2015"],
  },
  {
    id: "fleet-8",
    title: "Toyota Sienna (2023)",
    description: "Spacious Minivan • Automatic • Petrol • 4-7 Seats • ₦35,000/day. Ultimate family minivan with sliding doors.",
    url: "/our-fleet/8",
    category: "Our Fleet",
    tag: "Family",
    rating: "4.8",
    reviewsCount: 39,
    keywords: ["toyota", "sienna", "van", "minivan", "7 seater", "family", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-7",
    title: "BMW X1 (2012)",
    description: "Hybrid Compact SUV • Automatic • Hybrid • 4 Seats • ₦35,000/day. Compact luxury crossover for small families.",
    url: "/our-fleet/7",
    category: "Our Fleet",
    tag: "Family",
    rating: "4.5",
    reviewsCount: 16,
    keywords: ["bmw", "x1", "suv", "hybrid", "family", "automatic", "2012"],
  },
  {
    id: "fleet-6",
    title: "Toyota Camry (2022)",
    description: "Midsize Sedan • Automatic • Petrol • 4 Seats • ₦80,000/day. Sleek styling, reliable mechanics, and great ride.",
    url: "/our-fleet/6",
    category: "Our Fleet",
    tag: "Budget Friendly",
    rating: "4.7",
    reviewsCount: 31,
    keywords: ["toyota", "camry", "sedan", "budget friendly", "automatic", "petrol", "2022"],
  },
  {
    id: "fleet-4",
    title: "Mercedes-Benz E63 AMG (2022)",
    description: "Performance Super-Sedan • Automatic • Petrol • 4 Seats • ₦85,000/day. V8 power, thrilling acceleration and prestige.",
    url: "/our-fleet/4",
    category: "Our Fleet",
    tag: "Hot Cars",
    rating: "5.0",
    reviewsCount: 44,
    keywords: ["mercedes", "mercedes-benz", "e63 amg", "amg", "sedan", "hot cars", "sport", "luxury", "automatic", "petrol", "2022"],
  },
  {
    id: "fleet-3",
    title: "Toyota Camry (2020)",
    description: "Midsize Sedan • Automatic • Petrol • 4 Seats • ₦25,000/day. Highly affordable and comfortable daily transport.",
    url: "/our-fleet/3",
    category: "Our Fleet",
    tag: "Budget Friendly",
    rating: "4.6",
    reviewsCount: 28,
    keywords: ["toyota", "camry", "sedan", "budget friendly", "automatic", "petrol", "2020"],
  },
  {
    id: "fleet-2",
    title: "Mercedes-Benz GLE 450 (2023)",
    description: "7-Seater Luxury SUV • Automatic • Petrol • ₦65,000/day. Iconic styling, panoramic comfort, and high-tech cabin.",
    url: "/our-fleet/2",
    category: "Our Fleet",
    tag: "Hot Cars",
    rating: "4.9",
    reviewsCount: 54,
    keywords: ["mercedes", "mercedes-benz", "gle 450", "gle", "suv", "7 seater", "hot cars", "new arrival", "luxury", "automatic", "petrol", "2023"],
  },
  {
    id: "fleet-1",
    title: "Toyota Corolla (2024)",
    description: "Compact Sedan • Automatic • Petrol • 5 Seats • ₦15,000/day. Nigeria's favorite dependable economy rental.",
    url: "/our-fleet/1",
    category: "Our Fleet",
    tag: "Budget Friendly",
    rating: "4.8",
    reviewsCount: 72,
    keywords: ["toyota", "corolla", "sedan", "budget friendly", "hot cars", "economy", "automatic", "petrol", "2024"],
  },
];

// ---------------------------------------------------------------------------
// 2. Verified Blog Data (From Live Backend API)
// ---------------------------------------------------------------------------
export const BLOG_SEARCH_ITEMS: SearchItem[] = [
  {
    id: "blog-6",
    title: "5 tips for returning your rental car without extra fees",
    description: "Avoid surprise charges at drop-off with simple habits: refuel beforehand, inspect for damage, clean belongings, and return on time.",
    url: "/blog/6",
    category: "Blog",
    date: "Jun 22, 2026",
    keywords: [
      "return",
      "extra fees",
      "drop-off",
      "refuel",
      "charges",
      "damage claims",
      "inspection photos",
      "receipt",
      "car rental tips",
    ],
  },
  {
    id: "blog-5",
    title: "How to choose the right insurance coverage for your rental",
    description: "Understand Collision Damage Waiver (CDW), Third-Party Liability, and Personal Accident Insurance to pick the right protection.",
    url: "/blog/5",
    category: "Blog",
    date: "Jun 22, 2026",
    keywords: [
      "insurance",
      "coverage",
      "cdw",
      "collision damage waiver",
      "third-party liability",
      "accident insurance",
      "protection",
      "credit card coverage",
    ],
  },
  {
    id: "blog-4",
    title: "Weekly vs. daily rentals: which saves you more?",
    description: "Compare short-term daily rates vs multi-day weekly bundles. Learn how 4+ day trips can save 20%+ on rental costs.",
    url: "/blog/4",
    category: "Blog",
    date: "Jun 22, 2026",
    keywords: [
      "weekly rentals",
      "daily rentals",
      "pricing",
      "save money",
      "rates",
      "duration",
      "mileage caps",
      "discounts",
    ],
  },
  {
    id: "blog-3",
    title: "Everything you need to know before your first self-drive",
    description: "From vehicle walkaround inspections and photo logging to understanding city traffic and fuel policies on self-drive car rentals.",
    url: "/blog/3",
    category: "Blog",
    date: "Jun 22, 2026",
    keywords: [
      "self-drive",
      "first rental",
      "car inspection",
      "driving rules",
      "fuel return",
      "digital key",
      "rental guide",
    ],
  },
  {
    id: "blog-2",
    title: "The easiest way to get from the airport without stress",
    description: "Skip long counter lines with contactless car rentals and instant airport vehicle pickups reserved before boarding your flight.",
    url: "/blog/2",
    category: "Blog",
    date: "Jun 22, 2026",
    keywords: [
      "airport",
      "airport pickup",
      "flight",
      "contactless pickup",
      "baggage claim",
      "terminal",
      "travel transport",
    ],
  },
  {
    id: "blog-1",
    title: "Getting started with Drifully",
    description: "Complete guide on signing up, driver's license verification in under 5 minutes, digital key unlocking, and fast app reservations.",
    url: "/blog/1",
    category: "Blog",
    date: "Jun 22, 2026",
    keywords: [
      "getting started",
      "drifully",
      "create account",
      "license verification",
      "digital key",
      "app reservation",
      "how to book",
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. Complete Catalogue of Body Copy & Marketing Pages
// ---------------------------------------------------------------------------
export const MARKETING_PAGES_SEARCH_ITEMS: SearchItem[] = [
  // Home
  {
    id: "page-home",
    title: "Drifully - Flexible Car Rentals & Chauffeur Services",
    description: "Book self-drive or chauffeur-driven vehicles by the hour, day, or week. Instant mobile app digital keys with transparent pricing.",
    url: "/home",
    category: "Company",
    keywords: ["home", "drifully", "car rental", "self drive", "chauffeur", "hire car", "hourly rental", "daily rental", "nigeria"],
  },
  // About Us
  {
    id: "page-about",
    title: "About Drifully",
    description: "Discover Drifully's mission to modernize flexible mobility in Nigeria through verified vehicles, driver partners, and seamless digital booking.",
    url: "/about-us",
    category: "Company",
    keywords: ["about", "about us", "mission", "drifully story", "vision", "values", "safety", "mobility", "reliable rental"],
  },
  // Our Fleet Directory
  {
    id: "page-fleet",
    title: "Our Fleet Directory",
    description: "Browse Drifully's full fleet: luxury sedans, 7-seater family SUVs, budget-friendly cars, and rugged off-road trucks.",
    url: "/our-fleet",
    category: "Company",
    keywords: ["fleet", "all cars", "our fleet", "browse vehicles", "rent suv", "rent sedan", "jeep", "luxury car rental"],
  },
  // Drive with Drifully
  {
    id: "page-drive",
    title: "Drive with Drifully & Host Your Vehicle",
    description: "Join as a professional chauffeur driver or list your vehicle to earn passive income with comprehensive insurance and verified renters.",
    url: "/drive-with-drifully",
    category: "Company",
    keywords: ["drive with drifully", "driver partner", "earn", "list car", "host vehicle", "partner", "fleet owner", "make money"],
  },
  // Driver Partner Application
  {
    id: "page-driver-application",
    title: "Driver Partner Application",
    description: "Apply to become an approved Drifully driver partner. Submit your driver's license, vehicle details, and background documentation.",
    url: "/driver-application",
    category: "Company",
    keywords: ["driver application", "apply driver", "registration", "onboarding", "driver requirements", "license", "chauffeur application"],
  },
  // Download Mobile App
  {
    id: "page-download",
    title: "Download the Drifully Mobile App",
    description: "Get the Drifully app on Google Play Store and Apple App Store. Unlock cars with digital key technology and book rides in minutes.",
    url: "/download",
    category: "Company",
    keywords: ["download", "app", "mobile app", "google play", "apple app store", "ios", "android", "digital key", "install"],
  },
  // Contact Us & Help
  {
    id: "page-contact",
    title: "Contact Us & 24/7 Customer Support",
    description: "Reach Drifully customer care via WhatsApp, phone, or email. We're available 24/7 for booking help, breakdowns, and inquiries.",
    url: "/contact-us",
    category: "Company",
    keywords: ["contact", "contact us", "support", "help", "customer care", "phone number", "email", "whatsapp", "call center"],
  },
  // Blog Hub
  {
    id: "page-blog-hub",
    title: "Drifully Insights & Travel Blog",
    description: "Guides, safe driving practices, highway tips, and vehicle maintenance insights curated by Drifully road specialists.",
    url: "/blog",
    category: "Blog",
    keywords: ["blog", "articles", "news", "insights", "travel tips", "driving advice", "guides"],
  },

  // -------------------------------------------------------------------------
  // 4. Legal & Policies Catalogue
  // -------------------------------------------------------------------------
  {
    id: "legal-terms",
    title: "Terms of Service",
    description: "Official Drifully user terms, rental agreements, driver eligibility criteria, payment terms, and vehicle usage rules.",
    url: "/terms",
    category: "Legal",
    keywords: ["terms", "terms of service", "user agreement", "rental rules", "eligibility", "contract", "driver agreement"],
  },
  {
    id: "legal-privacy",
    title: "Privacy Policy",
    description: "Details on how Drifully collects, protects, encrypts, and handles your personal information, geolocation, and payment credentials.",
    url: "/privacy",
    category: "Legal",
    keywords: ["privacy", "privacy policy", "data security", "personal data", "tracking", "gdpr", "ndpr", "compliance"],
  },
  {
    id: "legal-cancellation",
    title: "Cancellation & Refund Policy",
    description: "Clear guidelines on cancellation timelines, security deposit refunds, trip modification rules, and late return fees.",
    url: "/cancellation",
    category: "Legal",
    keywords: ["cancellation", "refund", "modify booking", "security deposit refund", "late return", "refund policy", "cancel trip"],
  },
  {
    id: "legal-cookies",
    title: "Cookie Policy",
    description: "Explanation of session cookies, analytics trackers, and browser preferences used on the Drifully web platform.",
    url: "/cookie-policy",
    category: "Legal",
    keywords: ["cookie", "cookies", "cookie policy", "tracking", "analytics", "preferences"],
  },

  // -------------------------------------------------------------------------
  // 5. Frequently Asked Questions (FAQ) Catalogue
  // -------------------------------------------------------------------------
  {
    id: "faq-requirements",
    title: "What do I need to rent a car with Drifully?",
    description: "You need a valid government-issued driver's license, a verified Drifully account, and an active debit/credit card for security deposit.",
    url: "/contact-us",
    category: "FAQ",
    keywords: ["requirements", "what do i need", "driver license", "age limit", "id", "rent car requirements"],
  },
  {
    id: "faq-deposit",
    title: "How does the security deposit and refund work?",
    description: "A refundable security deposit is authorized upon booking and released back to your bank account within 24-48 hours after vehicle return.",
    url: "/cancellation",
    category: "FAQ",
    keywords: ["deposit", "caution fee", "security deposit", "refund timeline", "when do i get deposit back"],
  },
  {
    id: "faq-chauffeur",
    title: "Can I request a professional chauffeur with my car?",
    description: "Yes, Drifully offers vetted professional chauffeurs for hourly, full-day, and multi-day bookings across major cities.",
    url: "/our-fleet",
    category: "FAQ",
    keywords: ["chauffeur", "driver", "with driver", "hire driver", "executive driver", "chauffeur service"],
  },
  {
    id: "faq-fuel",
    title: "What is Drifully's fuel policy?",
    description: "We operate on a like-for-like fuel policy: return the vehicle with the same level of fuel as recorded during pickup inspection.",
    url: "/terms",
    category: "FAQ",
    keywords: ["fuel", "petrol", "diesel", "fuel policy", "refueling", "fuel level"],
  },
  {
    id: "faq-breakdown",
    title: "What happens if a vehicle breaks down or needs roadside assistance?",
    description: "Drifully provides 24/7 emergency roadside support. Contact our emergency line in the app for immediate towing or vehicle replacement.",
    url: "/contact-us",
    category: "FAQ",
    keywords: ["breakdown", "emergency", "roadside assistance", "flat tire", "towing", "support"],
  },
];

// Combine all baseline items
export const STATIC_SEARCH_ITEMS: SearchItem[] = [
  ...FLEET_SEARCH_ITEMS,
  ...BLOG_SEARCH_ITEMS,
  ...MARKETING_PAGES_SEARCH_ITEMS,
];

// In-memory cache & search index state
let cachedSearchItems: SearchItem[] = [...STATIC_SEARCH_ITEMS];
let fuseInstance: Fuse<SearchItem> | null = null;
let isHydrated = false;
let isHydrating = false;

// Fuse configuration tuned for high precision
const FUSE_OPTIONS: IFuseOptions<SearchItem> = {
  keys: [
    { name: "title", weight: 0.55 },
    { name: "tag", weight: 0.2 },
    { name: "keywords", weight: 0.2 },
    { name: "description", weight: 0.05 },
  ],
  includeScore: true,
  threshold: 0.32,
  distance: 100,
  minMatchCharLength: 2,
  ignoreLocation: false,
};

function getOrInitFuse(items: SearchItem[] = cachedSearchItems): Fuse<SearchItem> {
  if (!fuseInstance || items !== cachedSearchItems) {
    fuseInstance = new Fuse(items, FUSE_OPTIONS);
  }
  return fuseInstance;
}

// ---------------------------------------------------------------------------
// Hydration with dynamic API updates (preserves rich metadata)
// ---------------------------------------------------------------------------
export async function hydrateSearchIndex(): Promise<SearchItem[]> {
  if (isHydrated || isHydrating) return cachedSearchItems;

  isHydrating = true;
  try {
    const [apiVehicles, apiBlogs, apiFaqs, apiBrands] = await Promise.allSettled([
      marketingService.getVehicles(),
      marketingService.getBlogs(),
      marketingService.getFaqs(),
      marketingService.getBrands(),
    ]);

    const dynamicItems: SearchItem[] = [];

    // Ensure brand lookup map is ready with live and baseline brands
    const brandLookup: Record<string, string> = {
      "1": "Toyota",
      "2": "BMW",
      "3": "Mercedes",
      "4": "Honda",
      "5": "Ford",
      "6": "Audi",
      "7": "Chevrolet",
      "8": "Nissan",
      "9": "Volkswagen",
      "10": "Lexus",
      "12": "Hyundai",
      "13": "Mercedes-Benz",
      "14": "Kia",
      ...Object.fromEntries(Object.entries(BRAND_MAP).map(([k, v]) => [String(k), v])),
    };

    if (apiBrands.status === "fulfilled" && Array.isArray(apiBrands.value)) {
      apiBrands.value.forEach((b: any) => {
        if (b && b.id && b.name) {
          brandLookup[String(b.id)] = b.name;
        }
      });
    }

    // Process API Vehicles if available
    if (apiVehicles.status === "fulfilled" && Array.isArray(apiVehicles.value)) {
      apiVehicles.value.forEach((v: any) => {
        const brandId = String(v.brand_id || v.brand || "");
        const resolvedBrand = v.brand_name || brandLookup[brandId] || "";

        let title = v.name || "";
        // Clean up any residual "Brand <id>" prefix
        if (!title || /^Brand\s+\d+/i.test(title)) {
          title = resolvedBrand ? `${resolvedBrand} ${v.model || ""}`.trim() : (v.model || "Rental Vehicle");
        }

        const keywords = [
          title.toLowerCase(),
          resolvedBrand.toLowerCase(),
          (v.model || "").toLowerCase(),
          (v.type || "").toLowerCase(),
          (v.category || "").toLowerCase(),
          (v.fuel || "").toLowerCase(),
          (v.transmission || "").toLowerCase(),
          ...title.toLowerCase().split(/\s+/),
          ...(v.features || []).map((f: string) => String(f).toLowerCase()),
        ].filter(Boolean);

        dynamicItems.push({
          id: `fleet-${v.id}`,
          title: title || "Rental Vehicle",
          description: `${v.type || v.category || "Vehicle"} • ${v.fuel || "Petrol"} • ${v.transmission || "Automatic"} • ${v.capacity || 5} Seats`,
          url: `/our-fleet/${v.id}`,
          category: "Our Fleet",
          tag: resolvedBrand || v.type || v.category || "Vehicle",
          rating: String(v.rating || "4.8"),
          reviewsCount: Number(v.reviews || 0),
          keywords: Array.from(new Set(keywords)),
        });
      });
    }

    // Process API Blogs if available
    if (apiBlogs.status === "fulfilled" && Array.isArray(apiBlogs.value)) {
      apiBlogs.value.forEach((b: any) => {
        dynamicItems.push({
          id: `blog-${b.id}`,
          title: b.title || "Blog Post",
          description: b.excerpt || b.summary || "Explore insights and rental guides on Drifully.",
          url: `/blog/${b.id}`,
          category: "Blog",
          date: b.created_at ? new Date(b.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
          keywords: [
            (b.title || "").toLowerCase(),
            (b.slug || "").replace(/-/g, " "),
            ...(b.tags || []).map((t: string) => String(t).toLowerCase()),
          ].filter(Boolean),
        });
      });
    }

    // Process API FAQs if available
    if (apiFaqs.status === "fulfilled" && Array.isArray(apiFaqs.value)) {
      apiFaqs.value.forEach((f: any) => {
        dynamicItems.push({
          id: `faq-${f.id}`,
          title: f.question || f.title || "FAQ",
          description: f.answer || f.content || "Frequently Asked Question",
          url: "/contact-us",
          category: "FAQ",
          keywords: ["faq", "help", "support", (f.question || "").toLowerCase(), (f.category || "").toLowerCase()].filter(Boolean),
        });
      });
    }

    if (dynamicItems.length > 0) {
      // Dynamic items supersede matching URLs
      const dynamicUrls = new Set(dynamicItems.map((i) => i.url));
      const retainedStatic = cachedSearchItems.filter((i) => !dynamicUrls.has(i.url));
      cachedSearchItems = [...dynamicItems, ...retainedStatic];
      fuseInstance = new Fuse(cachedSearchItems, FUSE_OPTIONS);
    }

    isHydrated = true;
  } catch (err) {
    console.warn("Search index hydration failed, maintaining curated baseline:", err);
  } finally {
    isHydrating = false;
  }

  return cachedSearchItems;
}

// ---------------------------------------------------------------------------
// Multi-Tiered Perform Search (Exact Match > Prefix Match > Fuzzy Match)
// ---------------------------------------------------------------------------
export function performSearch(query: string, items: SearchItem[] = cachedSearchItems): CategorizedSearchResults {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return {
      fleet: [],
      blog: [],
      company: [],
      legal: [],
      faq: [],
      totalResults: 0,
    };
  }

  const fuse = getOrInitFuse(items);
  const fuseResults = fuse.search(normalized);

  // Re-rank items with an exact/prefix relevance booster
  const rankedItems = fuseResults
    .map(({ item, score = 1 }) => {
      let finalScore = score;
      const lowerTitle = item.title.toLowerCase();
      const lowerTag = (item.tag || "").toLowerCase();

      // Tier 1: Exact match on title (Score: 0.00)
      if (lowerTitle === normalized) {
        finalScore = 0.0;
      }
      // Tier 2: Exact prefix on title or vehicle model (Score: 0.05)
      else if (lowerTitle.startsWith(normalized) || lowerTag.startsWith(normalized)) {
        finalScore = Math.min(finalScore, 0.05);
      }
      // Tier 3: Word-boundary match or keyword match (Score: 0.12)
      else if (
        lowerTitle.includes(` ${normalized}`) ||
        (item.keywords && item.keywords.some((k) => k === normalized || k.startsWith(normalized)))
      ) {
        finalScore = Math.min(finalScore, 0.12);
      }
      // Tier 4: Substring containment (Score: 0.20)
      else if (lowerTitle.includes(normalized)) {
        finalScore = Math.min(finalScore, 0.2);
      }

      return { ...item, score: finalScore };
    })
    // Guard: Only marketing-facing pages
    .filter((item) => !item.url.startsWith("/customer") && !item.url.startsWith("/admin"))
    // Sort by best score (lowest score is best)
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

  // Partition into categories and apply sensible limits
  const fleet = rankedItems.filter((i) => i.category === "Our Fleet").slice(0, 5);
  const blog = rankedItems.filter((i) => i.category === "Blog").slice(0, 4);
  const company = rankedItems.filter((i) => i.category === "Company").slice(0, 4);
  const faq = rankedItems.filter((i) => i.category === "FAQ").slice(0, 3);
  const legal = rankedItems.filter((i) => i.category === "Legal").slice(0, 3);

  const totalResults = fleet.length + blog.length + company.length + faq.length + legal.length;

  return {
    fleet,
    blog,
    company,
    legal,
    faq,
    totalResults,
  };
}
