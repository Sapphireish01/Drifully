/**
 * Formats a field name from snake_case, camelCase, or kebab-case into Title Case.
 */
export function formatFieldName(fieldName: string): string {
  if (!fieldName) return "";
  return fieldName
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formats a specific key/value pair into a user-friendly error string.
 */
function formatFieldError(key: string, message: string): string {
  const cleanMsg = typeof message === "string" ? message.trim() : String(message);
  const lowerKey = key.toLowerCase();

  // If the key is a generic wrapper or non-field key, return message as is
  const genericKeys = ["detail", "error", "message", "msg", "non_field_errors", "errors", "data", "general"];
  if (genericKeys.includes(lowerKey)) {
    return cleanMsg;
  }

  const formattedKey = formatFieldName(key);

  // If the message already starts with or prominently mentions the field name, avoid duplication
  const lowerMsg = cleanMsg.toLowerCase();
  const lowerFormatted = formattedKey.toLowerCase();
  if (
    lowerMsg.startsWith(lowerFormatted) ||
    lowerMsg.startsWith(lowerKey) ||
    lowerMsg.includes(`this ${lowerFormatted}`) ||
    lowerMsg.includes(`the ${lowerFormatted}`) ||
    lowerMsg.includes(`this ${lowerKey}`)
  ) {
    return cleanMsg;
  }

  return `${formattedKey}: ${cleanMsg}`;
}

/**
 * Recursively extracts and formats all field-level and top-level error messages from any API error structure.
 * Supports Django REST Framework format, nested dictionaries, arrays of errors, and string errors.
 */
export function extractErrorMessages(data: any, parentKey: string = ""): string[] {
  if (!data) return [];

  if (typeof data === "string") {
    return [parentKey ? formatFieldError(parentKey, data) : data];
  }

  if (Array.isArray(data)) {
    return data.flatMap((item) => extractErrorMessages(item, parentKey));
  }

  if (typeof data === "object") {
    const messages: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      // Ignore internal metadata, boolean success flags, and status codes
      if (key === "success" || key === "status" || key === "code" || key === "status_code") {
        continue;
      }

      if (typeof value === "string") {
        messages.push(formatFieldError(key, value));
      } else if (Array.isArray(value)) {
        const itemMessages = value.map((v) => {
          if (typeof v === "string") return formatFieldError(key, v);
          return extractErrorMessages(v, key).join(" ");
        }).filter(Boolean);

        messages.push(...itemMessages);
      } else if (typeof value === "object" && value !== null) {
        const nestedMessages = extractErrorMessages(value, key);
        messages.push(...nestedMessages);
      }
    }

    return messages;
  }

  return [String(data)];
}

/**
 * Parses an Axios error or raw error response into a user-friendly string message.
 * Extracts all field errors (e.g. {"vehicle": ["This vehicle is not currently available for rental."]})
 */
export function getUserFriendlyMessage(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  // If string was passed directly
  if (typeof error === "string") return error;

  // Extract from error payload / response data
  const data = error?.response?.data || error?.data || (error?.isAxiosError ? null : error);
  const status = error?.response?.status || error?.status;

  if (data && typeof data === "object") {
    const extracted = extractErrorMessages(data);
    if (extracted.length > 0) {
      // Return joined unique messages
      const uniqueMessages = Array.from(new Set(extracted));
      return uniqueMessages.join(" ");
    }
  } else if (typeof data === "string" && data.trim()) {
    return data;
  }

  // Network / timeout errors
  if (!error.response && error.message) {
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      return "Network error. Please check your connection and try again.";
    }
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    return error.message;
  }

  // Status-based fallbacks
  switch (status) {
    case 400:
      return "The submitted data is invalid. Please check your inputs.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "A conflict occurred. This item may already exist.";
    case 422:
      return "The submitted data could not be processed. Please review your inputs.";
    case 429:
      return "Too many requests. Please slow down and try again.";
    case 500:
    case 502:
    case 503:
      return "A server error occurred. Please try again later.";
    default:
      return status ? `An error occurred (${status}). Please try again.` : "An unexpected error occurred. Please try again.";
  }
}

/**
 * Programmatically triggers a global toast error notification.
 */
export function toastError(errorOrMessage: any, fallbackMessage: string = "An error occurred"): void {
  const message = typeof errorOrMessage === "string"
    ? errorOrMessage
    : getUserFriendlyMessage(errorOrMessage) || fallbackMessage;

  if (typeof window !== "undefined") {
    if (typeof (window as any).__showToast === "function") {
      (window as any).__showToast("error", message);
    } else if (typeof (window as any).__showAdminToast === "function") {
      (window as any).__showAdminToast("error", message);
    } else {
      console.error("[Toast Error]:", message);
    }
  }
}

/**
 * Programmatically triggers a global toast success notification.
 */
export function toastSuccess(message: string): void {
  if (typeof window !== "undefined") {
    if (typeof (window as any).__showToast === "function") {
      (window as any).__showToast("success", message);
    } else if (typeof (window as any).__showAdminToast === "function") {
      (window as any).__showAdminToast("success", message);
    }
  }
}

/**
 * Programmatically triggers a global toast info notification.
 */
export function toastInfo(message: string): void {
  if (typeof window !== "undefined") {
    if (typeof (window as any).__showToast === "function") {
      (window as any).__showToast("info", message);
    } else if (typeof (window as any).__showAdminToast === "function") {
      (window as any).__showAdminToast("info", message);
    }
  }
}

