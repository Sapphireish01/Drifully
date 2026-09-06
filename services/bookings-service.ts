import { publicApi } from '@/lib/api-client';
import { getUserFriendlyMessage } from '@/lib/error-handler';

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

export interface TripFilters {
  start_date?: string;
  end_date?: string;
  status?: string;
  vehicle_type?: string;
  drive_type?: string;
}

export interface BookingExtensionQuote {
  previous_dropoff_date?: string;
  new_dropoff_date?: string;
  additional_days?: number;
  daily_rate?: string | number;
  extras_total?: string | number;
  tax_amount?: string | number;
  additional_amount?: string | number;
  detail?: string;
  message?: string;
}

export interface BookingExtensionConfirmation {
  id: string;
  reference: string;
  booking?: string;
  previous_dropoff_date: string;
  new_dropoff_date: string;
  additional_days: number;
  daily_rate_snapshot?: string;
  extras_total?: string;
  tax_amount?: string;
  additional_amount?: string;
  payment_method?: string;
  status: string;
  created_at?: string;
  confirmed_at?: string;
}

export interface RebookCheckDatesResponse {
  available: boolean;
  vehicle?: string;
  pickup_date?: string;
  dropoff_date?: string;
  rental_days?: number;
  daily_rate?: string | number;
  subtotal?: string | number;
  tax_amount?: string | number;
  total_amount?: string | number;
  message?: string;
}

export interface RebookConfirmResponse {
  id: string;
  reference: string;
  status: string;
  drive_type: string;
  vehicle?: any;
  pickup_date: string;
  dropoff_date: string;
  daily_rate_snapshot?: string;
  subtotal?: string;
  extras_total?: string;
  tax_amount?: string;
  total_amount?: string;
  booking_extras?: any[];
  hold_expires_at?: string;
  is_hold_expired?: boolean;
}

export interface BookingReceiptData {
  paid_at?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  date_created?: string;
  booking_type?: string;
  transaction_id?: string;
  booking_id?: string;
  amount?: number;
  fees?: number | null;
  taxes?: number;
  payment_method?: string;
  reference_number?: string;
  payment_initiated?: string;
  payment_received?: string;
  payable_type?: string;
  amount_paid?: number;
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

  initiateBookingExtension: async (
    bookingRef: string,
    newDropoffDate: string
  ): Promise<BookingExtensionQuote> => {
    try {
      const response = await publicApi.get('', {
        params: {
          path: 'api/v1/bookings/initiate/extension/',
          booking_ref: bookingRef,
          new_dropoff_date: newDropoffDate,
        }
      });
      return response.data;
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.get('', {
          params: {
            path: 'bookings/initiate/extension/',
            booking_ref: bookingRef,
            new_dropoff_date: newDropoffDate,
          }
        });
        return fallbackRes.data;
      } catch (fallbackError) {
        console.error(`Failed to initiate booking extension for ${bookingRef}:`, fallbackError);
        throw fallbackError;
      }
    }
  },

  confirmBookingExtension: async (
    bookingRef: string,
    data: { new_dropoff_date: string; payment_method?: string }
  ): Promise<BookingExtensionConfirmation> => {
    const formData = new FormData();
    formData.append('new_dropoff_date', data.new_dropoff_date);
    formData.append('payment_method', data.payment_method || 'card');

    try {
      const response = await publicApi.post('', formData, {
        params: { path: 'api/v1/bookings/confirm/extension/', booking_ref: bookingRef },
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.post('', formData, {
          params: { path: 'bookings/confirm/extension/', booking_ref: bookingRef },
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return fallbackRes.data;
      } catch (fallbackError) {
        console.error(`Failed to confirm booking extension for ${bookingRef}:`, fallbackError);
        throw fallbackError;
      }
    }
  },

  checkRebookDates: async (
    bookingRef: string,
    data: { pickup_date: string; dropoff_date: string }
  ): Promise<RebookCheckDatesResponse> => {
    const formData = new FormData();
    formData.append('pickup_date', data.pickup_date);
    formData.append('dropoff_date', data.dropoff_date);

    try {
      const response = await publicApi.post('', formData, {
        params: { path: 'api/v1/bookings/rebook/check-dates/', booking_ref: bookingRef },
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.post('', formData, {
          params: { path: 'bookings/rebook/check-dates/', booking_ref: bookingRef },
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return fallbackRes.data;
      } catch (fallbackError) {
        console.error(`Failed to check rebook dates for ${bookingRef}:`, fallbackError);
        throw fallbackError;
      }
    }
  },

  confirmRebook: async (
    bookingRef: string,
    data: { pickup_date: string; dropoff_date: string; drive_type?: string }
  ): Promise<RebookConfirmResponse> => {
    const formData = new FormData();
    formData.append('pickup_date', data.pickup_date);
    formData.append('dropoff_date', data.dropoff_date);
    const normalizedDriveType = data.drive_type?.toLowerCase().includes('chauffeur') ? 'chauffeur' : 'drive_yourself';
    formData.append('drive_type', normalizedDriveType);

    try {
      const response = await publicApi.post('', formData, {
        params: { path: 'api/v1/bookings/rebook/confirm/', booking_ref: bookingRef },
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.post('', formData, {
          params: { path: 'bookings/rebook/confirm/', booking_ref: bookingRef },
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return fallbackRes.data;
      } catch (fallbackError) {
        console.error(`Failed to confirm rebook for ${bookingRef}:`, fallbackError);
        throw fallbackError;
      }
    }
  },

  getTrips: async (filters?: TripFilters): Promise<ApiTrip[]> => {
    try {
      const cleanParams: Record<string, string> = { path: 'api/v1/bookings/trips/' };
      if (filters?.start_date) cleanParams.start_date = filters.start_date;
      if (filters?.end_date) cleanParams.end_date = filters.end_date;
      if (filters?.status) cleanParams.status = filters.status;
      if (filters?.vehicle_type) cleanParams.vehicle_type = filters.vehicle_type;
      if (filters?.drive_type) cleanParams.drive_type = filters.drive_type;

      const response = await publicApi.get('', {
        params: cleanParams
      });
      return response.data;
    } catch (error) {
      try {
        const fallbackParams: Record<string, string> = { path: 'bookings/trips/' };
        if (filters?.start_date) fallbackParams.start_date = filters.start_date;
        if (filters?.end_date) fallbackParams.end_date = filters.end_date;
        if (filters?.status) fallbackParams.status = filters.status;
        if (filters?.vehicle_type) fallbackParams.vehicle_type = filters.vehicle_type;
        if (filters?.drive_type) fallbackParams.drive_type = filters.drive_type;

        const fallbackRes = await publicApi.get('', {
          params: fallbackParams
        });
        return fallbackRes.data;
      } catch (fallbackError) {
        console.error('Failed to fetch trips:', fallbackError);
        throw fallbackError;
      }
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

  /**
   * Sets or updates pickup and dropoff dates on a booking
   * POST api/v1/bookings/?booking_ref=BK-XXXXXX (with fallback to bookings/)
   */
  setBookingDates: async (bookingRef: string, pickupDate: string, dropoffDate: string) => {
    const formData = new FormData();
    formData.append('pickup_date', pickupDate);
    formData.append('dropoff_date', dropoffDate);

    try {
      const response = await publicApi.post('', formData, {
        params: { path: 'api/v1/bookings/', booking_ref: bookingRef },
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      try {
        const fallbackRes = await publicApi.post('', formData, {
          params: { path: 'bookings/', booking_ref: bookingRef },
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return { success: true, data: fallbackRes.data };
      } catch (fallbackErr: any) {
        console.error(`Failed to set booking dates for ${bookingRef}:`, fallbackErr);
        return {
          success: false,
          message: getUserFriendlyMessage(fallbackErr || error)
        };
      }
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

  /**
   * Fetches booking receipt details
   * GET admin/bookings/receipt/?booking_ref=...
   */
  getBookingReceipt: async (bookingRef: string): Promise<BookingReceiptData> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/receipt/', booking_ref: bookingRef }
      });
      return response.data;
    } catch (error) {
      try {
        const fallbackRes = await publicApi.get('', {
          params: { path: 'admin/bookings/receipt/', booking_ref: bookingRef }
        });
        return fallbackRes.data;
      } catch (fallbackError) {
        const altRes = await publicApi.get('', {
          params: { path: 'bookings/receipt/', booking_ref: bookingRef }
        });
        return altRes.data;
      }
    }
  },
};
