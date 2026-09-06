import axios from 'axios';
import { getUserFriendlyMessage } from '@/lib/error-handler';

// Extend AxiosRequestConfig to support custom toast metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** Custom success message shown in the toast after a successful mutation. */
    successMessage?: string;
    /** Set to true to suppress all toasts for this request. */
    skipToast?: boolean;
  }
}

const MUTATION_METHODS = new Set(['post', 'put', 'patch', 'delete']);

export const publicApi = axios.create({
  baseURL: '/api/proxy',
  timeout: 30000, // 30 seconds
});

publicApi.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase() ?? '';
    const skipToast = (response.config as any).skipToast;
    const path = (response.config as any).params?.path || '';

    // Never show default success toast for authentication operations (login, register, token, logout)
    const isAuthPath =
      path.includes('login') ||
      path.includes('register') ||
      path.includes('token') ||
      path.includes('logout');

    // Fire a success toast only for mutations (not GETs), unless silenced
    if (MUTATION_METHODS.has(method) && !skipToast && !isAuthPath) {
      const message =
        (response.config as any).successMessage ||
        getDefaultSuccessMessage(method);

      const triggerToast = (type: 'success' | 'error', msg: string) => {
        if (typeof (window as any).__showToast === 'function') {
          (window as any).__showToast(type, msg);
        } else if (typeof (window as any).__showAdminToast === 'function') {
          (window as any).__showAdminToast(type, msg);
        }
      };

      triggerToast('success', message);
    }

    return response;
  },
  (error) => {
    const method = error.config?.method?.toLowerCase() ?? '';
    const skipToast = error.config?.skipToast;
    const is401 = error.response?.status === 401;

    // Keep customer/admin sessions in the authentication flow without triggering session-expired toasts
    if (is401) {
      if (typeof window !== 'undefined') {
        const isCustomerPath = window.location.pathname.startsWith('/customer');
        if (isCustomerPath) {
          localStorage.removeItem('drifully_customer_user');
          window.location.href = '/customer/login';
        } else {
          localStorage.removeItem('drifully_admin_user');
          localStorage.removeItem('drifully_admin_role');
          window.location.href = '/admin/login';
        }
      }
    }

    // Fire an error toast for failed requests unless silenced or unauthorized (401 session expired)
    if (!skipToast && !is401) {
      const message = getUserFriendlyMessage(error);
      if (typeof (window as any).__showToast === 'function') {
        (window as any).__showToast('error', message);
      } else if (typeof (window as any).__showAdminToast === 'function') {
        (window as any).__showAdminToast('error', message);
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/** Default success messages per HTTP method */
function getDefaultSuccessMessage(method: string): string {
  switch (method) {
    case 'post':   return 'Created successfully.';
    case 'put':
    case 'patch':  return 'Updated successfully.';
    case 'delete': return 'Deleted successfully.';
    default:       return 'Action completed successfully.';
  }
}

