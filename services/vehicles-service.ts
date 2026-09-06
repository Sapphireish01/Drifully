import { publicApi } from '@/lib/api-client';
import { getUserFriendlyMessage } from '@/lib/error-handler';

export const vehiclesService = {
  /**
   * Fetches all available vehicle features
   */
  getFeatures: async () => {
    try {
      const response = await publicApi.get("", {
        params: { path: "api/v1/vehicles/features/" }
      });
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error("Failed to fetch features:", error);
      return [];
    }
  },
  /**
   * Fetches all dynamic options for vehicle forms (brands, colors, fuels, transmissions, features)
   */
  getVehicleOptions: async () => {
    try {
      const [brandsRes, colorsRes, fuelsRes, transRes, featuresRes, categoriesRes] = await Promise.all([
        publicApi.get("", { params: { path: "api/v1/vehicles/brands/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/colors/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/fuel-types/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/transmissions/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/features/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/categories/" } }),
      ]);

      return {
        brands: Array.isArray(brandsRes.data) ? brandsRes.data : brandsRes.data?.results || [],
        colors: Array.isArray(colorsRes.data) ? colorsRes.data : colorsRes.data?.results || [],
        fuels: Array.isArray(fuelsRes.data) ? fuelsRes.data : fuelsRes.data?.results || [],
        transmissions: Array.isArray(transRes.data) ? transRes.data : transRes.data?.results || [],
        features: Array.isArray(featuresRes.data) ? featuresRes.data : featuresRes.data?.results || [],
        categories: Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.results || [],
      };
    } catch (error) {
      console.error("Failed to fetch vehicle options:", error);
      throw error;
    }
  },

  /**
   * Uploads identification document linked to booking reference
   */
  uploadIdentification: async (bookingRef: string, identificationType: string, file: File) => {
    const formData = new FormData();
    formData.append("identification_type", identificationType);
    formData.append("identification_file", file);

    try {
      const response = await publicApi.post("", formData, {
        params: { path: "api/v1/bookings/upload/id/", booking_ref: bookingRef },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.post("", formData, {
          params: { path: "bookings/upload/id/", booking_ref: bookingRef },
          headers: { "Content-Type": "multipart/form-data" }
        });
        return { success: true, data: fallbackRes.data };
      } catch (fallbackErr: any) {
        console.error("Failed to upload identification:", fallbackErr);
        return {
          success: false,
          message: getUserFriendlyMessage(fallbackErr || error)
        };
      }
    }
  },

  /**
   * Uploads driver's license images linked to booking reference
   */
  uploadLicense: async (bookingRef: string, frontImage: File, backImage?: File) => {
    const formData = new FormData();
    formData.append("front_image", frontImage);
    if (backImage) {
      formData.append("back_image", backImage);
    }

    try {
      const response = await publicApi.post("", formData, {
        params: { path: "api/v1/bookings/upload/license/", booking_ref: bookingRef },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.post("", formData, {
          params: { path: "bookings/upload/license/", booking_ref: bookingRef },
          headers: { "Content-Type": "multipart/form-data" }
        });
        return { success: true, data: fallbackRes.data };
      } catch (fallbackErr: any) {
        console.error("Failed to upload driver license:", fallbackErr);
        return {
          success: false,
          message: getUserFriendlyMessage(fallbackErr || error)
        };
      }
    }
  },

  /**
   * Initiates a booking for a vehicle
   */
  initiateBooking: async (vehicleId: number | string, driveType: string) => {
    const formData = new FormData();
    const driveTypeValue = driveType === "self" || driveType === "self_drive" ? "self_drive" : "chauffeur";
    formData.append("drive_type", driveTypeValue);

    try {
      const response = await publicApi.post("", formData, {
        params: { path: "api/v1/bookings/initiate/", vehicle_id: vehicleId },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      try {
        const driveTypeValueUpper = driveType === "self" || driveType === "self_drive" ? "Self_drive" : "Chauffeur_drive";
        const fallbackFormData = new FormData();
        fallbackFormData.append("drive_type", driveTypeValueUpper);

        const fallbackRes = await publicApi.post("", fallbackFormData, {
          params: { path: "bookings/initiate/", vehicle_id: vehicleId },
          headers: { "Content-Type": "multipart/form-data" }
        });
        return { success: true, data: fallbackRes.data };
      } catch (fallbackErr: any) {
        console.error("Failed to initiate booking:", fallbackErr);
        return {
          success: false,
          message: getUserFriendlyMessage(fallbackErr || error)
        };
      }
    }
  },

  /**
   * Checks vehicle availability for given pickup and dropoff dates
   */
  checkAvailability: async (vehicleId: number | string, pickupDate: string, dropoffDate: string) => {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "api/v1/bookings/check-availability/",
          vehicle_id: vehicleId,
          pickup_date: pickupDate,
          dropoff_date: dropoffDate,
        }
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.get("", {
          params: {
            path: "bookings/check-availability/",
            vehicle_id: vehicleId,
            pickup_date: pickupDate,
            dropoff_date: dropoffDate,
          }
        });
        return { success: true, data: fallbackRes.data };
      } catch (fallbackErr: any) {
        console.error("Failed to check vehicle availability:", fallbackErr);
        return {
          success: false,
          message: getUserFriendlyMessage(fallbackErr || error)
        };
      }
    }
  },

  /**
   * Fetches home page vehicles grouped by tags at vehicles/manage/
   * Optionally filtered by search, min_price, max_price, vehicle_type, and features
   */
  getManagedVehicles: async (filters?: {
    search?: string;
    min_price?: string | number;
    max_price?: string | number;
    vehicle_type?: string[] | string;
    features?: string[] | string;
  }): Promise<Record<string, any>> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("path", "api/v1/vehicles/manage/");
      if (filters?.search !== undefined && filters?.search.trim() !== "") {
        searchParams.append("search", filters.search.trim());
      }
      if (filters?.min_price !== undefined && filters?.min_price !== "") {
        searchParams.append("min_price", String(filters.min_price));
      }
      if (filters?.max_price !== undefined && filters?.max_price !== "") {
        searchParams.append("max_price", String(filters.max_price));
      }
      if (filters?.vehicle_type) {
        const types = Array.isArray(filters.vehicle_type) ? filters.vehicle_type : [filters.vehicle_type];
        types.forEach((t) => {
          if (t && t.trim()) {
            searchParams.append("vehicle_type", t.trim());
          }
        });
      }
      if (filters?.features) {
        const feats = Array.isArray(filters.features) ? filters.features : [filters.features];
        feats.forEach((f) => {
          if (f && f.trim()) {
            searchParams.append("features", f.trim());
          }
        });
      }
      const response = await publicApi.get(`?${searchParams.toString()}`);
      return response.data || {};
    } catch (error) {
      console.error("Failed to fetch managed vehicles:", error);
      return {};
    }
  },

  /**
   * Fetches reviews for a booking reference
   */
  getReviews: async (bookingRef?: string) => {
    try {
      const params: Record<string, string> = { path: "bookings/review/" };
      if (bookingRef) params.booking_ref = bookingRef;
      const response = await publicApi.get("", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return null;
    }
  },

  /**
   * Fetches single vehicle detail from api/v1/vehicles/manage/?vehicle_id=ID
   */
  getVehicleDetail: async (vehicleId: number | string) => {
    try {
      const response = await publicApi.get("", {
        params: { path: "api/v1/vehicles/manage/", vehicle_id: vehicleId }
      });
      if (Array.isArray(response.data)) {
        return response.data[0] || null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Failed to fetch vehicle detail:", error);
      return null;
    }
  },

  /**
   * Creates a new vehicle using FormData
   */
  createVehicle: async (payload: FormData) => {
    try {
      const response = await publicApi.post("", payload, {
        params: { path: "api/v1/vehicles/manage/" },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      throw error;
    }
  },

  /**
   * Updates a vehicle's status (Booked, Maintenance, Inactive)
   */
  updateVehicleStatus: async (vehicleId: number, status: string) => {
    try {
      const formData = new FormData();
      formData.append("status", status);

      const response = await publicApi.patch("", formData, {
        params: { path: "api/v1/admin/vehicles/update-status/", vehicle_id: vehicleId },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update vehicle status:", error);
      throw error;
    }
  },

  /**
   * Fetches the dashboard vehicles, stats, and pagination data
   */
  getVehicles: async (page: number = 1, filters?: Record<string, string>): Promise<any> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/vehicles/dashboard/', page, ...filters }
      });
      return response.data;
    } catch (error) {
      // Fallback in case api/v1 is not needed
      try {
        const fallbackResponse = await publicApi.get('', {
          params: { path: 'admin/vehicles/dashboard/', page, ...filters }
        });
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Failed to fetch dashboard vehicles:', fallbackError);
        throw fallbackError;
      }
    }
  },

  /**
   * Fetches brands and categories for mapping
   */
  getBrandsAndCategories: async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        publicApi.get("", { params: { path: "api/v1/vehicles/brands/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/categories/" } })
      ]);
      return {
        brands: Array.isArray(brandsRes.data) ? brandsRes.data : brandsRes.data?.results || [],
        categories: Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.results || []
      };
    } catch (e) {
      console.error("Failed to fetch brands and categories:", e);
      return { brands: [], categories: [] };
    }
  },

  bulkUploadVehicles: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await publicApi.post("", formData, {
        params: { path: "api/v1/vehicles/bulk-upload/" },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to bulk upload vehicles:", error);
      throw error;
    }
  }
};
