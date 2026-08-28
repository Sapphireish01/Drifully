import { publicApi } from '@/lib/api-client';

export interface BookingExtra {
  id: string;
  name: string;
  description: string;
  price_per_booking: string;
  icon: string;
}

export interface BookingSummaryExtraItem {
  name?: string;
  unit_price?: string;
  line_total?: string;
  extra?: {
    id?: string;
    name?: string;
    description?: string;
    price_per_booking?: string;
    icon?: string;
  };
  unit_price_snapshot?: string;
}

export interface BookingSummaryData {
  booking_info?: {
    vehicle?: string;
    drive_type?: string;
    date?: string;
  };
  price_info?: {
    subtotal?: number | string;
    extras?: number | string;
    taxes?: number | string;
    total?: number | string;
  };
  extras_info?: BookingSummaryExtraItem[];
  // Top-level fields from booking detail endpoint:
  subtotal?: string | number;
  extras_total?: string | number;
  tax_amount?: string | number;
  total_amount?: string | number;
  booking_extras?: BookingSummaryExtraItem[];
  vehicle?: {
    model?: string;
    brand?: number | string;
  } | number;
  pickup_date?: string;
  dropoff_date?: string;
  drive_type?: string;
}

export interface ApiTrip {
  id: string;
  reference: string;
  vehicle: string;
  booking_date: string;
  drive_type: string;
  status: string;
  status_color?: string;
  location?: string;
  ready_for_pickup?: boolean;
  pickup_code?: string;
}

export interface ExpandedTripFeature {
  id?: number | string;
  name?: string;
  icon?: string | null;
  category?: string;
}

export interface ExpandedTripImage {
  image: string;
  is_primary?: boolean;
}

export interface ExpandedTripData {
  vehicle_info?: {
    brand?: string;
    model?: string;
    category?: string;
    seats?: number;
    transmission?: string;
    fuel_type?: string;
    features?: ExpandedTripFeature[];
    images?: ExpandedTripImage[];
  };
  review_info?: {
    review_count?: number;
    average_rating?: number;
  };
  booking_info?: {
    vehicle?: string;
    drive_type?: string;
    status?: string;
    date?: string;
    number_of_days?: number;
  };
  price_info?: {
    daily_rate?: number;
    subtotal?: number;
    extras?: number;
    taxes?: number;
    total?: number;
  };
  extras_info?: Array<{
    name: string;
    unit_price?: string;
    line_total?: string;
  }>;
}

export const bookingsService = {
  getExpandedTripDetail: async (bookingRef: string): Promise<ExpandedTripData> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/bookings/trips/expanded/', booking_ref: bookingRef }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch expanded trip detail for ${bookingRef}:`, error);
      throw error;
    }
  },

  getTrips: async (): Promise<ApiTrip[]> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/bookings/trips/' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      throw error;
    }
  },

  getBookingSummary: async (bookingRef: string): Promise<BookingSummaryData> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/bookings/summary/', booking_ref: bookingRef }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch summary for booking ${bookingRef}:`, error);
      throw error;
    }
  },

  getBookingExtras: async (): Promise<BookingExtra[]> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/bookings/extras/' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch booking extras:', error);
      throw error;
    }
  },

  addExtras: async (bookingRef: string, extraIds: string[]) => {
    try {
      const payload = {
        extras: extraIds.map((id) => ({ extra_id: id }))
      };
      const response = await publicApi.put('', payload, {
        params: { path: 'api/v1/bookings/add-extras/', booking_ref: bookingRef }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to add extras for booking ${bookingRef}:`, error);
      throw error;
    }
  },

  getBookings: async () => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/list/' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw error;
    }
  },

  getBookingDetail: async (bookingRef: string) => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/', booking_ref: bookingRef }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch booking detail for ${bookingRef}:`, error);
      throw error;
    }
  },

  cancelBooking: async (bookingRef: string, data: { reason: string }) => {
    try {
      const response = await publicApi.post('', data, {
        params: { path: `api/v1/admin/bookings/cancel/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel booking ${bookingRef}:`, error);
      throw error;
    }
  },

  getMetrics: async () => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/metrics/' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch booking metrics:', error);
      throw error;
    }
  },

  exportBookings: async () => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/list/', export: 'xlsx' },
        responseType: 'arraybuffer',
      });
      return response;
    } catch (error) {
      console.error('Failed to export bookings:', error);
      throw error;
    }
  },

  confirmPickup: async (bookingRef: string, data?: { otp_code: string }) => {
    try {
      const formData = new FormData();
      if (data?.otp_code) {
        formData.append('otp_code', data.otp_code);
      }
      const response = await publicApi.post('', formData, {
        params: { path: `api/v1/admin/bookings/confirm-pickup/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to confirm pickup for booking ${bookingRef}:`, error);
      throw error;
    }
  },

  uploadVehicleImages: async (
    bookingRef: string,
    data: { images: { [key: string]: File }; mileage: string }
  ) => {
    try {
      const formData = new FormData();
      Object.entries(data.images).forEach(([key, file]) => {
        if (file) {
          formData.append("images", file);
        }
      });
      formData.append("mileage_at_pickup", data.mileage);

      const response = await publicApi.post("", formData, {
        params: { path: `api/v1/admin/bookings/upload-pickup-data/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to upload vehicle images for booking ${bookingRef}:`, error);
      throw error;
    }
  },

  modifyBooking: async (bookingRef: string, data: {}) => {
    try {
      const response = await publicApi.put('', data, {
        params: { path: `api/v1/admin/bookings/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to modify booking ${bookingRef}:`, error);
      throw error;
    }
  },

  sendReminder: async (bookingRef: string, data: { reason: string }) => {
    try {
      const response = await publicApi.post('', data, {
        params: { path: `api/v1/admin/bookings/send-reminder/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to send reminder for booking ${bookingRef}:`, error);
      throw error;
    }
  },
};
