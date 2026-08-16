import { VEHICLES } from "@/data/vehicles";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "Our Fleet" | "Blog" | "Company" | "Legal";
  tag?: string;
  rating?: string;
  reviewsCount?: number;
  date?: string;
  keywords?: string[];
}

export interface CategorizedSearchResults {
  fleet: SearchItem[];
  blog: SearchItem[];
  company: SearchItem[];
  legal: SearchItem[];
  totalResults: number;
}

// Fallback / Static marketing index items
export const STATIC_SEARCH_ITEMS: SearchItem[] = [
  // Static Fleet fallback items
  ...VEHICLES.map((car) => ({
    id: `fleet-${car.id}`,
    title: car.name,
    description: `A stylish, comfortable ${car.type} built for smooth everyday drives and longer journeys`,
    url: `/our-fleet/${car.id}`,
    category: "Our Fleet" as const,
    tag: car.type || car.category || "Jeep",
    rating: car.rating || "4.8",
    reviewsCount: car.reviews || 124,
    keywords: [car.name, car.type, car.category, car.fuel, car.location, car.transmission],
  })),

  // Pre-added Chevrolet item if not in vehicles list for direct UI mockup parity
  {
    id: "fleet-chevrolet-demo",
    title: "Chevrolet",
    description: "A stylish, comfortable SUV built for smooth everyday drives and longer journeys",
    url: "/our-fleet",
    category: "Our Fleet",
    tag: "Jeep",
    rating: "4.8",
    reviewsCount: 124,
    keywords: ["chevrolet", "chevy", "suv", "jeep"],
  },

  // Blog posts
  {
    id: "blog-1",
    title: "Health & Safety Checks",
    description: "Learn how Drifully keeps vehicles safe, clean, and ready before every rental.",
    url: "/blog/1",
    category: "Blog",
    date: "Aug 12, 2026",
    keywords: ["health", "safety", "checks", "clean", "inspection", "maintenance"],
  },
  {
    id: "blog-2",
    title: "Getting Started with Drifully Rentals",
    description: "Everything you need to know about booking your first self-drive car or chauffeur.",
    url: "/blog/2",
    category: "Blog",
    date: "Aug 10, 2026",
    keywords: ["getting started", "booking", "self-drive", "chauffeur", "rental guide"],
  },
  {
    id: "blog-3",
    title: "5 Tips for Low-Light & Night Driving",
    description: "Essential road safety guidelines for night travel across city highways and interstates.",
    url: "/blog/3",
    category: "Blog",
    date: "Aug 05, 2026",
    keywords: ["night driving", "safety", "low light", "tips", "travel"],
  },

  // Company pages
  {
    id: "company-about",
    title: "About Us",
    description: "Discover Drifully's mission to revolutionize flexible car rentals across Nigeria.",
    url: "/about-us",
    category: "Company",
    keywords: ["about", "mission", "company", "drifully", "story"],
  },
  {
    id: "company-fleet",
    title: "Our Fleet",
    description: "Explore our wide range of premium vans, sedans, SUVs, and luxury rental cars.",
    url: "/our-fleet",
    category: "Company",
    keywords: ["fleet", "cars", "vehicles", "all cars", "sedan", "suv"],
  },
  {
    id: "company-drive",
    title: "Drive with Drifully",
    description: "Join as a driver partner or list your vehicle to start earning with Drifully.",
    url: "/drive-with-drifully",
    category: "Company",
    keywords: ["driver", "partner", "earn", "list vehicle", "apply"],
  },
  {
    id: "company-contact",
    title: "Contact Us",
    description: "Get in touch with our 24/7 customer support team for inquiries and help.",
    url: "/contact-us",
    category: "Company",
    keywords: ["contact", "support", "help", "phone", "email"],
  },

  // Legal pages
  {
    id: "legal-terms",
    title: "Terms of Service",
    description: "Read our standard terms, user agreements, and vehicle usage rules.",
    url: "/terms",
    category: "Legal",
    keywords: ["terms", "conditions", "policy", "agreement", "rules"],
  },
  {
    id: "legal-privacy",
    title: "Privacy Policy",
    description: "How we collect, protect, and handle your personal data and account info.",
    url: "/privacy",
    category: "Legal",
    keywords: ["privacy", "data", "security", "personal information"],
  },
  {
    id: "legal-cancellation",
    title: "Cancellation Policy",
    description: "Understand refund timelines, booking cancellations, and modification policies.",
    url: "/cancellation",
    category: "Legal",
    keywords: ["cancellation", "refund", "modify", "policy"],
  },
  {
    id: "legal-cookies",
    title: "Cookie Policy",
    description: "Information regarding cookies and web tracking standard practices on Drifully.",
    url: "/cookie-policy",
    category: "Legal",
    keywords: ["cookie", "cookies", "tracking", "browsing"],
  },
];

export function performSearch(query: string, items: SearchItem[] = STATIC_SEARCH_ITEMS): CategorizedSearchResults {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return {
      fleet: [],
      blog: [],
      company: [],
      legal: [],
      totalResults: 0,
    };
  }

  // Helper matching logic
  const matches = items.filter((item) => {
    const inTitle = item.title.toLowerCase().includes(normalized);
    const inDesc = item.description.toLowerCase().includes(normalized);
    const inCategory = item.category.toLowerCase().includes(normalized);
    const inTag = item.tag ? item.tag.toLowerCase().includes(normalized) : false;
    const inKeywords = item.keywords ? item.keywords.some((k) => k.toLowerCase().includes(normalized)) : false;

    return inTitle || inDesc || inCategory || inTag || inKeywords;
  });

  const fleet = matches.filter((i) => i.category === "Our Fleet");
  const blog = matches.filter((i) => i.category === "Blog");
  const company = matches.filter((i) => i.category === "Company");
  const legal = matches.filter((i) => i.category === "Legal");

  return {
    fleet,
    blog,
    company,
    legal,
    totalResults: matches.length,
  };
}
