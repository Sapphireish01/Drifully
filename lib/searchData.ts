import { VEHICLES } from "@/data/vehicles";
import { marketingService } from "@/services/marketing-service";
import Fuse from "fuse.js";

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
}

export interface CategorizedSearchResults {
  fleet: SearchItem[];
  blog: SearchItem[];
  company: SearchItem[];
  legal: SearchItem[];
  faq: SearchItem[];
  totalResults: number;
}

// Fallback / Static marketing index items
export const STATIC_SEARCH_ITEMS: SearchItem[] = [
  // Static Fleet fallback items
  ...VEHICLES.map((car) => ({
    id: `fleet-${car.id}`,
    title: car.name,
    description: `A stylish, comfortable ${car.type} built for smooth everyday drives and longer journeys (${car.fuel}, ${car.capacity} Seats, ${car.transmission})`,
    url: `/our-fleet/${car.id}`,
    category: "Our Fleet" as const,
    tag: car.type || car.category || "Jeep",
    rating: car.rating || "4.8",
    reviewsCount: car.reviewsCount || 124,
    keywords: [
      car.name,
      car.type,
      car.category,
      car.fuel,
      car.location,
      car.transmission,
      ...(car.features || []),
    ],
  })),

  {
    id: "fleet-chevrolet-demo",
    title: "Chevrolet",
    description: "A stylish, comfortable SUV built for smooth everyday drives and longer journeys",
    url: "/our-fleet",
    category: "Our Fleet",
    tag: "Jeep",
    rating: "4.8",
    reviewsCount: 124,
    keywords: ["chevrolet", "chevy", "suv", "jeep", "automatic", "luxury"],
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
    keywords: ["about", "mission", "company", "drifully", "story", "vision", "values"],
  },
  {
    id: "company-fleet",
    title: "Our Fleet",
    description: "Explore our wide range of premium vans, sedans, SUVs, and luxury rental cars.",
    url: "/our-fleet",
    category: "Company",
    keywords: ["fleet", "cars", "vehicles", "all cars", "sedan", "suv", "luxury"],
  },
  {
    id: "company-drive",
    title: "Drive with Drifully",
    description: "Join as a driver partner or list your vehicle to start earning with Drifully.",
    url: "/drive-with-drifully",
    category: "Company",
    keywords: ["driver", "partner", "earn", "list vehicle", "apply", "chauffeur driver"],
  },
  {
    id: "company-contact",
    title: "Contact Us",
    description: "Get in touch with our 24/7 customer support team for inquiries and help.",
    url: "/contact-us",
    category: "Company",
    keywords: ["contact", "support", "help", "phone", "email", "customer service"],
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
    keywords: ["privacy", "data", "security", "personal information", "protection"],
  },
  {
    id: "legal-cancellation",
    title: "Cancellation Policy",
    description: "Understand refund timelines, booking cancellations, and modification policies.",
    url: "/cancellation",
    category: "Legal",
    keywords: ["cancellation", "refund", "modify", "policy", "cancel booking"],
  },
  {
    id: "legal-cookies",
    title: "Cookie Policy",
    description: "Information regarding cookies and web tracking standard practices on Drifully.",
    url: "/cookie-policy",
    category: "Legal",
    keywords: ["cookie", "cookies", "tracking", "browsing", "analytics"],
  },
];

// In-memory cache for merged search index
let cachedSearchItems: SearchItem[] = [...STATIC_SEARCH_ITEMS];
let isHydrated = false;
let isHydrating = false;

// Async function to hydrate search index with live API data (Vehicles, Blogs, FAQs)
export async function hydrateSearchIndex(): Promise<SearchItem[]> {
  if (isHydrated || isHydrating) return cachedSearchItems;

  isHydrating = true;
  try {
    const [apiVehicles, apiBlogs, apiFaqs] = await Promise.allSettled([
      marketingService.getVehicles(),
      marketingService.getBlogs(),
      marketingService.getFaqs(),
    ]);

    const dynamicItems: SearchItem[] = [];

    // Process API Vehicles
    if (apiVehicles.status === "fulfilled" && Array.isArray(apiVehicles.value)) {
      apiVehicles.value.forEach((v) => {
        dynamicItems.push({
          id: `api-fleet-${v.id}`,
          title: v.name,
          description: `${v.type} - ${v.fuel} transmission ${v.transmission}. Capacity ${v.capacity} persons.`,
          url: `/our-fleet/${v.id}`,
          category: "Our Fleet",
          tag: v.type || v.category || "Vehicle",
          rating: String(v.rating || "4.8"),
          reviewsCount: Number(v.reviews || 0),
          keywords: [v.name, v.type, v.category, v.fuel, v.transmission, ...(v.features || [])],
        });
      });
    }

    // Process API Blogs
    if (apiBlogs.status === "fulfilled" && Array.isArray(apiBlogs.value)) {
      apiBlogs.value.forEach((b: any) => {
        dynamicItems.push({
          id: `api-blog-${b.id}`,
          title: b.title || b.name,
          description: b.excerpt || b.summary || b.description || "Read latest insights on Drifully Blog",
          url: `/blog/${b.id}`,
          category: "Blog",
          date: b.created_at || b.date || "Recent",
          keywords: [b.title, b.category, b.author, ...(b.tags || [])],
        });
      });
    }

    // Process API FAQs
    if (apiFaqs.status === "fulfilled" && Array.isArray(apiFaqs.value)) {
      apiFaqs.value.forEach((f: any) => {
        dynamicItems.push({
          id: `api-faq-${f.id}`,
          title: f.question || f.title,
          description: f.answer || f.content || "Frequently Asked Question",
          url: "/customer/help-support",
          category: "FAQ",
          keywords: ["faq", "help", "support", f.question, f.category],
        });
      });
    }

    if (dynamicItems.length > 0) {
      // Deduplicate by URL or title
      const existingUrls = new Set(cachedSearchItems.map((i) => i.url));
      const filteredDynamic = dynamicItems.filter((item) => !existingUrls.has(item.url));

      cachedSearchItems = [...cachedSearchItems, ...filteredDynamic];
    }

    isHydrated = true;
  } catch (err) {
    console.warn("Search index hydration failed, using static fallback:", err);
  } finally {
    isHydrating = false;
  }

  return cachedSearchItems;
}

// Perform search using Fuse.js fuzzy matching
export function performSearch(query: string, items: SearchItem[] = cachedSearchItems): CategorizedSearchResults {
  const normalized = query.trim();

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

  const fuse = new Fuse(items, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "keywords", weight: 0.3 },
      { name: "description", weight: 0.2 },
      { name: "tag", weight: 0.1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });

  const searchResults = fuse.search(normalized).map((res) => res.item);

  const fleet = searchResults.filter((i) => i.category === "Our Fleet");
  const blog = searchResults.filter((i) => i.category === "Blog");
  const company = searchResults.filter((i) => i.category === "Company");
  const legal = searchResults.filter((i) => i.category === "Legal");
  const faq = searchResults.filter((i) => i.category === "FAQ");

  return {
    fleet,
    blog,
    company,
    legal,
    faq,
    totalResults: searchResults.length,
  };
}
