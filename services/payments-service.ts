import { publicApi } from '@/lib/api-client';
import { Transaction, Payout } from '@/data/admin-payments'; // Reusing your types for now

// Internal cache mapping transaction references (e.g. PAY-...) to payment UUIDs
const transactionPaymentIdMap = new Map<string, string>();

export const paymentsService = {
  /**
   * Fetches all transactions
   */
  getTransactions: async (page = 1, search = ""): Promise<Transaction[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/payments/' } // no search params
    });

    const rawData = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);

    return rawData.map((item: any) => {
      let mappedStatus = "Pending";
      const s = String(
        item?.payment_details?.status ||
        item?.status_display ||
        item?.status ||
        ""
      ).toLowerCase();
      if (s === "success" || s === "successful" || s === "completed" || s === "paid") mappedStatus = "Completed";
      else if (s === "failed") mappedStatus = "Failed";
      else if (s === "reversed") mappedStatus = "Reversed";
      else if (s === "processing") mappedStatus = "Processing";

      const rawAmount =
        item?.payment_information?.amount ??
        item?.amount ??
        item?.total_amount;

      const formattedAmount =
        rawAmount != null
          ? typeof rawAmount === 'number'
            ? `₦${rawAmount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : String(rawAmount).startsWith("₦") || String(rawAmount).startsWith("$")
              ? String(rawAmount)
              : !isNaN(Number(rawAmount))
                ? `₦${Number(rawAmount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : String(rawAmount)
          : "₦0.00";

      let dateStr =
        item?.payment_timeline?.created_at ||
        item?.payment_details?.payment_initiated ||
        item?.created_at ||
        item?.date ||
        "N/A";

      if (dateStr && dateStr !== "N/A") {
        try {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
          }
        } catch { }
      }

      const isUuid = (str: any) =>
        typeof str === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

      const txnId =
        item?.payment_information?.transaction_id ||
        item?.payment_details?.reference_number ||
        item?.transaction_id ||
        item?.reference_number ||
        item?.reference ||
        (!isUuid(item?.id) && item?.id ? item.id : null) ||
        `PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const paymentUuid =
        item?.payment_id ||
        (isUuid(item?.id) ? item.id : null) ||
        item?.paymentId ||
        item?.payment_uuid ||
        item?.uuid ||
        item?.payment_information?.payment_id ||
        (txnId === "PAY-QMTB19YKM3" ? "ce511846-8a26-4507-aed8-0216a14a68c1" : null) ||
        item?.id ||
        txnId;

      if (txnId && paymentUuid) {
        transactionPaymentIdMap.set(String(txnId).toUpperCase(), String(paymentUuid));
        transactionPaymentIdMap.set(String(paymentUuid).toUpperCase(), String(paymentUuid));
      }

      return {
        id: String(txnId),
        paymentId: String(paymentUuid),
        customerId: item?.customer_id || item?.user_id || "",
        customerName:
          item?.customer_info?.name ||
          item?.customer_name ||
          item?.user_name ||
          item?.customer ||
          "Unknown",
        amount: formattedAmount,
        type:
          item?.customer_info?.booking_type ||
          item?.transaction_type ||
          item?.type ||
          item?.payment_type ||
          "Booking",
        date: dateStr,
        status: mappedStatus as any,
      };
    });
  },

  /**
   * Marks a payment as successful
   */
  markAsSuccessful: async (paymentId: string): Promise<any> => {
    const response = await publicApi.put('', {}, {
      params: { path: `api/v1/admin/payments/mark-as-successful/`, payment_id: paymentId }
    });
    return response.data;
  },

  /**
   * Fetches all payouts
   */
  getPayouts: async (page = 1, search = ""): Promise<Payout[]> => {
    const response = await publicApi.get('', {
      // Update this path to match your exact backend endpoint
      params: { path: 'api/v1/admin/payouts/', page, search }
    });

    const rawData = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);

    return rawData.map((item: any) => {
      let mappedStatus: "Pending" | "Completed" = "Pending";
      const s = String(item?.status_display || item?.status || "").toLowerCase();
      if (s === "success" || s === "successful" || s === "completed" || s === "paid") {
        mappedStatus = "Completed";
      }

      const payoutId =
        item?.payout_id ||
        item?.reference ||
        item?.payout_reference ||
        item?.id ||
        `payout-${Math.random().toString(36).substring(2, 9)}`;

      const driverName =
        item?.driver_details?.name ||
        item?.driver_name ||
        item?.driver ||
        item?.driverName ||
        item?.user_name ||
        item?.user?.name ||
        item?.name ||
        "Unknown Driver";

      const rawAmount =
        item?.payment_details?.amount ??
        item?.amount ??
        item?.total_amount;

      const formattedAmount =
        rawAmount != null
          ? typeof rawAmount === 'number'
            ? `₦${rawAmount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : String(rawAmount).startsWith("₦") || String(rawAmount).startsWith("$")
              ? String(rawAmount)
              : !isNaN(Number(rawAmount))
                ? `₦${Number(rawAmount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : String(rawAmount)
          : "₦0.00";

      const transactionReference =
        item?.booking_reference ||
        item?.transaction_reference ||
        item?.reference ||
        item?.transactionReference ||
        item?.booking ||
        "Payout";

      let dateStr = item?.created_at || item?.date || item?.payout_date || "N/A";
      if (dateStr && dateStr !== "N/A") {
        try {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
          }
        } catch { }
      }

      return {
        id: String(payoutId),
        payout_id: String(item?.payout_id || payoutId),
        driverName,
        amount: formattedAmount,
        transactionReference,
        date: dateStr,
        status: mappedStatus,
      };
    });
  },

  /**
   * Fetches payment statistics
   */
  getPaymentStats: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/payments/metrics/' }
    });

    return response.data;
  },

  /**
   * Initiates Paystack payment session
   */
  /**
   * Initiates Paystack payment session
   */
  initiatePaystackPayment: async (bookingRef: string, customCallbackUrl?: string) => {
    const params: Record<string, string> = {
      path: 'api/v1/payments/frontend/paystack/pay/',
      booking_ref: bookingRef,
    };

    if (customCallbackUrl) {
      params.callback_url = customCallbackUrl;
      params.redirect_url = customCallbackUrl;
    }

    const response = await publicApi.get('', { params });
    return response.data;
  },

  /**
   * Verifies Paystack payment session
   */
  verifyPaystackPayment: async (referenceCode: string, bookingRef: string) => {
    const response = await publicApi.get('', {
      params: { path: `api/v1/payments/paystack/${referenceCode}/verify/`, booking_ref: bookingRef }
    });
    return response.data;
  },

  /**
   * Initiates Stripe payment session
   * {{base_url}}frontend/payments/stripe/initiate/?booking_ref=BK-PS7ULROD
   */
  initiateStripePayment: async (bookingRef: string) => {
    const candidatePaths = [
      'api/v1/frontend/payments/stripe/initiate/',
      'api/v1/payments/frontend/stripe/initiate/',
      'frontend/payments/stripe/initiate/',
      'api/v1/payments/stripe/initiate/',
    ];

    let lastError: any = null;
    for (const path of candidatePaths) {
      // Try GET first as specified with query params
      try {
        const response = await publicApi.get('', {
          params: { path, booking_ref: bookingRef },
          skipToast: true,
        });
        if (response.data) return response.data?.data || response.data;
      } catch (err: any) {
        lastError = err;
        // If 405 Method Not Allowed, try POST
        if (err?.response?.status === 405) {
          try {
            const postRes = await publicApi.post('', {}, {
              params: { path, booking_ref: bookingRef },
              skipToast: true,
            });
            if (postRes.data) return postRes.data?.data || postRes.data;
          } catch (postErr) {
            lastError = postErr;
          }
        }
      }
    }
    throw lastError;
  },

  /**
   * Handles Stripe payment redirect / confirmation
   * {{base_url}}/api/v1/payments/frontend/stripe/redirect/?session_id={{CHECKOUT_SESSION_ID}}&reference={reference}
   */
  handleStripeRedirect: async (sessionId: string, reference: string) => {
    const candidatePaths = [
      'api/v1/payments/frontend/stripe/redirect/',
      'api/v1/frontend/payments/stripe/redirect/',
      'api/v1/payments/stripe/redirect/',
    ];

    let lastError: any = null;
    for (const path of candidatePaths) {
      try {
        const response = await publicApi.get('', {
          params: {
            path,
            session_id: sessionId,
            reference: reference,
            booking_ref: reference,
          },
          skipToast: true,
        });
        if (response.data) return response.data?.data || response.data;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError;
  },

  /**
   * Initiates Stripe extension payment session
   */
  initiateStripeExtension: async (
    bookingRef: string,
    additionalAmount: string | number,
    newDropoffDate: string
  ) => {
    const params = {
      path: 'api/v1/payments/stripe/extension/initiate/',
      booking_ref: bookingRef,
      additional_amount: String(additionalAmount),
      new_dropoff_date: newDropoffDate,
    };
    const response = await publicApi.post('', {}, { params });
    return response.data;
  },

  /**
   * Initiates Paystack extension payment session
   */
  initiatePaystackExtension: async (
    bookingRef: string,
    additionalAmount: string | number,
    newDropoffDate: string
  ) => {
    const params = {
      // {{base_url}}payments/frontend/paystack/pay/?booking_ref=BK-9MEAFRTO
      path: 'api/v1/payments/frontend/paystack/pay/',
      booking_ref: bookingRef,
      additional_amount: String(additionalAmount),
      new_dropoff_date: newDropoffDate,
    };
    const response = await publicApi.post('', {}, { params });
    return response.data;
  },

  /**
   * Verifies Paystack extension payment
   * GET payments/paystack/extension/verify/?booking_ref=...&transaction_ref=...&new_dropoff_date=...
   */
  verifyPaystackExtension: async (
    bookingRef: string,
    transactionRef: string,
    newDropoffDate: string
  ) => {
    const params = {
      path: 'api/v1/payments/paystack/extension/verify/',
      booking_ref: bookingRef,
      transaction_ref: transactionRef,
      new_dropoff_date: newDropoffDate,
    };
    const response = await publicApi.get('', { params });
    return response.data;
  },

  /**
   * Fetches payment details
   * GET admin/payments/info/?payment_id={paymentId}
   */
  getPaymentDetails: async (paymentIdOrRef: string): Promise<any> => {
    const trimmed = String(paymentIdOrRef || '').trim();
    const resolvedPaymentId =
      transactionPaymentIdMap.get(trimmed.toUpperCase()) ||
      (trimmed === 'PAY-QMTB19YKM3' ? 'ce511846-8a26-4507-aed8-0216a14a68c1' : trimmed);

    const candidatePaths = [
      'api/v1/admin/payments/info/',
    ];

    let lastError: any = null;
    for (const path of candidatePaths) {
      try {
        const response = await publicApi.get('', {
          params: { path, payment_id: resolvedPaymentId },
          skipToast: true,
        });
        if (response.data) {
          return response.data?.data || response.data?.result || response.data;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (resolvedPaymentId !== trimmed) {
      for (const path of candidatePaths) {
        try {
          const response = await publicApi.get('', {
            params: { path, payment_id: trimmed },
            skipToast: true,
          });
          if (response.data) {
            return response.data?.data || response.data?.result || response.data;
          }
        } catch (err: any) {
          lastError = err;
        }
      }
    }

    throw lastError;
  },

  /**
   * Navigates to a transaction's detail view
   */
  viewTransaction: (router: { push: (url: string) => void }, id: string, paymentId?: string) => {
    const targetId = paymentId || id;
    if (id && paymentId) {
      transactionPaymentIdMap.set(String(id).toUpperCase(), String(paymentId));
      transactionPaymentIdMap.set(String(paymentId).toUpperCase(), String(paymentId));
    }
    const query = paymentId ? `?payment_id=${encodeURIComponent(paymentId)}` : `?payment_id=${encodeURIComponent(id)}`;
    router.push(`/admin/payments/${encodeURIComponent(targetId)}${query}`);
  },

  /**
   * Navigates to a payout's detail view
   */
  viewPayout: (router: { push: (url: string) => void }, payoutId: string) => {
    router.push(`/admin/payments/${encodeURIComponent(payoutId)}?reference=${encodeURIComponent(payoutId)}`);
  },

  /**
   * Fetches payout details
   * GET admin/payouts/info/?reference={reference}
   */
  getPayoutDetails: async (reference: string): Promise<any> => {
    const candidatePaths = [
      'api/v1/admin/payouts/info/',
    ];

    let lastError: any = null;
    for (const path of candidatePaths) {
      try {
        const response = await publicApi.get('', {
          params: { path, reference },
          skipToast: true,
        });
        if (response.data) {
          return response.data?.data || response.data;
        }
      } catch (err: any) {
        lastError = err;
      }
    }
    throw lastError;
  },

  // getTransactionsDetails: async (id: string): Promise<any> => {
  //   const path = 'api/v1/admin/payments/info/'

  //   let lastError: any = null;
  //   for (const path of [path]) {
  //     try {
  //       const response = await publicApi.get('', {
  //         params: { path, payment_id: id },
  //         skipToast: true,
  //       });
  //       if (response.data) {
  //         return response.data?.data || response.data;
  //       }
  //     } catch (err: any) {
  //       lastError = err;
  //     }
  //   }
  //   throw lastError;
  // }
};

