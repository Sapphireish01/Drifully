/**
 * Helper utility for Paystack Inline JS Modal
 * Allows resuming transactions directly in an in-app modal overlay without leaving Drifully.
 */

let paystackPromise: Promise<void> | null = null;

export const loadPaystackScript = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cannot load Paystack on server side"));
  }

  if ((window as any).PaystackPop) {
    return Promise.resolve();
  }

  if (paystackPromise) {
    return paystackPromise;
  }

  paystackPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("paystack-inline-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = (err) => {
      // Fallback attempt with v1 if v2 fails to load
      script.remove();
      const fallbackScript = document.createElement("script");
      fallbackScript.id = "paystack-inline-script-v1";
      fallbackScript.src = "https://js.paystack.co/v1/inline.js";
      fallbackScript.async = true;
      fallbackScript.onload = () => resolve();
      fallbackScript.onerror = () => reject(new Error("Failed to load Paystack Inline SDK"));
      document.body.appendChild(fallbackScript);
    };

    document.body.appendChild(script);
  });

  return paystackPromise;
};

export interface OpenPaystackModalOptions {
  accessCode: string;
  onOpen?: () => void;
  onSuccess: (transaction: any) => void;
  onCancel: () => void;
  onError?: (error: any) => void;
}

/**
 * Opens the Paystack modal using the generated access_code.
 * Returns true if the modal was successfully initialized, or throws if unavailable.
 */
export const openPaystackModal = async (options: OpenPaystackModalOptions): Promise<boolean> => {
  await loadPaystackScript();

  const PaystackPop = (window as any).PaystackPop;
  if (!PaystackPop) {
    throw new Error("Paystack SDK not found after loading script");
  }

  let isSettled = false;

  const handleSuccess = (transaction: any) => {
    if (isSettled) return;
    isSettled = true;
    options.onSuccess(transaction);
  };

  const handleCancel = () => {
    if (isSettled) return;
    isSettled = true;
    options.onCancel();
  };

  const handleError = (err: any) => {
    if (isSettled) return;
    isSettled = true;
    if (options.onError) {
      options.onError(err);
    } else {
      options.onCancel();
    }
  };

  // Paystack v2 method: new PaystackPop().resumeTransaction(...)
  if (typeof PaystackPop === "function") {
    try {
      const popup = new PaystackPop();
      if (popup && typeof popup.resumeTransaction === "function") {
        if (options.onOpen) options.onOpen();

        popup.resumeTransaction(options.accessCode, {
          onSuccess: (transaction: any) => handleSuccess(transaction),
          onCancel: () => handleCancel(),
          onClose: () => handleCancel(),
          onError: (error: any) => handleError(error),
        });

        // Add a DOM monitor fallback to detect when Paystack iframe/wrapper is dismissed
        monitorPaystackDismissal(() => {
          if (!isSettled) {
            handleCancel();
          }
        });

        return true;
      }
    } catch (e) {
      console.warn("PaystackPop instance initialization failed, attempting setup() fallback", e);
    }
  }

  // Paystack v1 / setup fallback: PaystackPop.setup({ access_code, ... }).openIframe()
  if (typeof PaystackPop.setup === "function") {
    if (options.onOpen) options.onOpen();

    const handler = PaystackPop.setup({
      access_code: options.accessCode,
      callback: (response: any) => handleSuccess(response),
      onClose: () => handleCancel(),
      onCancel: () => handleCancel(),
    });

    if (handler && typeof handler.openIframe === "function") {
      handler.openIframe();

      monitorPaystackDismissal(() => {
        if (!isSettled) {
          handleCancel();
        }
      });

      return true;
    }
  }

  throw new Error("No compatible Paystack popup handler found on window.PaystackPop");
};

/**
 * Helper to monitor DOM and detect when the user closes Paystack iframe/dialog
 */
function monitorPaystackDismissal(onDismissed: () => void) {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") return;

  let hasFoundFrame = false;
  let intervalCount = 0;

  const checkInterval = setInterval(() => {
    intervalCount++;
    const frame = document.querySelector('iframe[src*="paystack"], div[id*="paystack"], div[class*="paystack"]');

    if (frame) {
      hasFoundFrame = true;
    } else if (hasFoundFrame) {
      // It was open previously, but now it's gone from the DOM
      clearInterval(checkInterval);
      setTimeout(() => onDismissed(), 100);
    }

    // Stop checking after 10 minutes
    if (intervalCount > 600) {
      clearInterval(checkInterval);
    }
  }, 500);
}
