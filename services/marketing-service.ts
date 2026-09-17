import { publicApi } from '@/lib/api-client';
import { Vehicle } from '@/types/vehicle';
import { Faq } from '@/types/faq';

export interface MiniFleetItem {
  id: number;
  primary_image: string;
}

export interface MiniFleetResponse {
  results: {
    [key: string]: MiniFleetItem[];
  };
}

// Baseline Brand ID to name mapping from api/v1/vehicles/brands/
const INITIAL_BRAND_MAP: { [key: number]: string } = {
  1: 'Toyota',
  2: 'BMW',
  3: 'Mercedes',
  4: 'Honda',
  5: 'Ford',
  6: 'Audi',
  7: 'Chevrolet',
  8: 'Nissan',
  9: 'Volkswagen',
  10: 'Lexus',
  12: 'Hyundai',
  13: 'Mercedes-Benz',
  14: 'Kia',
};

// Dynamic in-memory Brand ID to name mapping, synchronized with brand API
export const BRAND_MAP: { [key: number]: string } = { ...INITIAL_BRAND_MAP };

// Category ID to name mapping
const CATEGORY_MAP: { [key: number]: string } = {
  1: 'Sedan',
  2: 'SUV',
  3: 'Hatchback',
  4: 'Van',
  5: 'Luxury',
  6: 'Sports',
};

// Helper function to transform API vehicle to Vehicle interface
const transformVehicle = (apiVehicle: any): Vehicle => {
  const brandId = Number(apiVehicle.brand);
  const brandName =
    apiVehicle.brand_name ||
    (typeof apiVehicle.brand === 'object' && apiVehicle.brand?.name) ||
    BRAND_MAP[brandId] ||
    (apiVehicle.brand && isNaN(Number(apiVehicle.brand)) ? String(apiVehicle.brand) : '');

  const categoryName =
    apiVehicle.category_name ||
    (typeof apiVehicle.category === 'object' && apiVehicle.category?.name) ||
    CATEGORY_MAP[apiVehicle.category] ||
    (apiVehicle.category && isNaN(Number(apiVehicle.category)) ? String(apiVehicle.category) : '');

  const primaryImage = apiVehicle.images?.find((img: any) => img.is_primary)?.image ||
    apiVehicle.images?.[0]?.image ||
    '/images/placeholder-car.png';

  const fullName = brandName
    ? `${brandName} ${apiVehicle.model || ''}`.trim()
    : apiVehicle.model || 'Rental Vehicle';

  return {
    id: apiVehicle.id,
    name: fullName,
    type: categoryName || 'Sedan',
    transmission: apiVehicle.transmission || 'Automatic',
    capacity: apiVehicle.seats || 5,
    price: apiVehicle.price_per_day || '0',
    location: 'Available', // Default location since API doesn't provide it
    image: primaryImage,
    category: categoryName || 'Sedan',
    rating: apiVehicle.rating || '4.5',
    reviews: apiVehicle.reviews || 0,
    fuel: apiVehicle.fuel_type || 'Petrol',
    gallery: apiVehicle.images?.map((img: any) => img.image) || [],
    features: apiVehicle.features || [],
    rules: [],
    brand_id: apiVehicle.brand,
    category_id: apiVehicle.category,
    model: apiVehicle.model,
  };
};

export const marketingService = {
  /**
   * Fetches vehicle brands from api/v1/vehicles/brands/ and synchronizes BRAND_MAP
   */
  getBrands: async (): Promise<any[]> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/vehicles/brands/' }
      });
      const brands = Array.isArray(response.data) ? response.data : response.data?.results || [];
      brands.forEach((b: any) => {
        if (b && b.id && b.name) {
          BRAND_MAP[Number(b.id)] = b.name;
        }
      });
      return brands;
    } catch (e) {
      console.warn('Failed to fetch dynamic vehicle brands from API:', e);
      return Object.entries(BRAND_MAP).map(([id, name]) => ({ id: Number(id), name }));
    }
  },

  /**
   * Fetches vehicles with optional filters, ensuring brand definitions are up to date
   * @param vehicleTypes - Array of vehicle types (e.g., ['suv', 'sedan'])
   */
  getVehicles: async (vehicleTypes?: string[]): Promise<Vehicle[]> => {
    const params: any = {
      path: 'api/v1/vehicles/fleet/',
    };

    if (vehicleTypes && vehicleTypes.length > 0) {
      params.vehicle_type = vehicleTypes.map(t => t.toLowerCase());
    }

    const [fleetRes] = await Promise.allSettled([
      publicApi.get('', { params }),
      marketingService.getBrands(),
    ]);

    const vehicles = fleetRes.status === 'fulfilled' ? fleetRes.value.data : [];

    // Transform API response to Vehicle interface
    return Array.isArray(vehicles) ? vehicles.map(transformVehicle) : [];
  },

  getVehicleById: async (id: string | number): Promise<Vehicle> => {
    const [fleetRes] = await Promise.allSettled([
      publicApi.get('', {
        params: { path: `api/v1/vehicles/fleet/?vehicle_id=${id}` }
      }),
      marketingService.getBrands(),
    ]);

    if (fleetRes.status === 'fulfilled') {
      return transformVehicle(fleetRes.value.data);
    }
    throw new Error(`Failed to fetch vehicle ${id}`);
  },

  getFaqs: async (): Promise<Faq[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/faqs/' }
    });
    return response.data;
  },

  getTestimonials: async (): Promise<any[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/testimonials/' },
      timeout: 3000,
      skipToast: true
    } as any);
    return response.data;
  },

  getBlogs: async (): Promise<any[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/blogs/all/' }
    });
    return response.data;
  },

  getBlogById: async (id: number | string): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/blogs/all/', blog_id: id }
    });
    const blogs = response.data;
    if (Array.isArray(blogs)) {
      return blogs.find((b: any) => String(b.id) === String(id)) || null;
    } else if (blogs && typeof blogs === 'object') {
      return blogs; // Single object returned by API
    }
    return null;
  },

  getMiniFleet: async (): Promise<MiniFleetResponse> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/vehicles/mini-fleet/' }
    });
    return response.data;
  },
};
