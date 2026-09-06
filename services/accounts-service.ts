import { publicApi } from '@/lib/api-client';

export function formatApiError(err: any, fallback = "An error occurred. Please try again."): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  const data = err.response?.data || err.data;
  if (!data) return err.message || fallback;

  if (typeof data === "string") return data;
  if (data.message && typeof data.message === "string") return data.message;
  if (data.detail && typeof data.detail === "string") return data.detail;
  if (data.error && typeof data.error === "string") return data.error;

  if (typeof data === "object") {
    const messages: string[] = [];
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (Array.isArray(val)) {
        messages.push(val.join(", "));
      } else if (typeof val === "string") {
        messages.push(val);
      }
    }
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return err.message || fallback;
}

export interface Country {
  id: number;
  name: string;
  iso_code: string;
  dial_code: string;
  flag: string | null;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  country_code: string | number; // Country ID selected from list countries
  referral_code?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface DeactivateAccountPayload {
  password: string;
  mfa_code?: string;
}

export interface ContactUsPayload {
  full_name: string;
  email: string;
  phone_number?: string;
  country?: string | number;
  subject: string;
  message: string;
}

export interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  is_active: boolean;
  order: number;
  created: string;
  last_updated: string;
}

export interface Manage2FAPayload {
  mfa_enabled: boolean | string;
  mfa_method?: string;
}

export interface Setup2FAPinPayload {
  user_pin: string;
  confirm_pin: string;
}

export interface InitiatePinChangePayload {
  current_pin: string;
}

export interface ConfirmPinChangePayload {
  user_pin: string;
  confirm_pin: string;
}

export interface EmergencyContactResponse {
  id: number;
  name: string;
  country: number;
  country_name?: string;
  phone_code?: string;
  phone_number: string;
  full_phone_number: string;
}

export interface CreateEmergencyContactPayload {
  name: string;
  country: number;
  phone_number: string;
}

export interface UpdateEmergencyContactPayload {
  name?: string;
  country?: number;
  phone_number?: string;
}

export const accountsService = {
  /**
   * Sets the password for a team member
   * @param uid - User ID
   * @param token - Secure token
   * @param payload - Password payload object
   */
  setPassword: async (uid: string, token: string, payload: any): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: {
        path: `api/v1/admin/set-password/`,
        uid: uid,
        token: token
      }
    });
    return response.data;
  },

  /**
   * Fetches the list of countries from accounts/countries/
   * Returns an array of countries
   */
  getCountries: async (): Promise<Country[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/countries/' }
    });

    // API response formatting handles both arrays directly or wrapped results
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.results || response.data?.data || [];
  },

  /**
   * Logs a user into the account at accounts/login/
   * @param payload - LoginPayload object
   */
  login: async (payload: LoginPayload): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/accounts/login/' },
      skipToast: true,
    } as any);
    return response.data;
  },

  /**
   * Creates a new user account at accounts/register/
   * @param payload - RegisterPayload object
   */
  register: async (payload: RegisterPayload): Promise<any> => {
    const formData = new FormData();
    formData.append('full_name', payload.full_name);
    formData.append('email', payload.email);
    formData.append('phone_number', payload.phone_number);
    formData.append('password', payload.password);
    formData.append('confirm_password', payload.confirm_password);
    formData.append('country_code', String(payload.country_code));
    if (payload.referral_code) {
      formData.append('referral_code', payload.referral_code);
    }

    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/accounts/register/' },
      skipToast: true,
    } as any);
    return response.data;
  },

  /**
   * Verifies the OTP sent to the user after registration
   * @param otp - The one-time password code
   */
  verifyOTP: async (otp: string): Promise<any> => {
    const response = await publicApi.post('', { otp }, {
      params: { path: 'api/v1/accounts/verify-otp/' }
    });
    return response.data;
  },

  /**
   * Submits the contact us form
   * @param payload - ContactUsPayload object
   */
  contactUs: async (payload: ContactUsPayload): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/accounts/contact-us/' }
    });
    return response.data;
  },

  /**
   * Creates a new role in the admin account at admin/roles/
   * @param payload - RolePayload object
   */
  createRole: async (payload: any): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/admin/roles/' }
    });
    return response.data;
  },
  /**
   * Updates an existing role in the admin account at admin/roles/{id}/
   * @param payload - RolePayload object
   */
  updateRole: async (id: string, payload: any): Promise<any> => {
    const response = await publicApi.put('', payload, {
      params: { path: `api/v1/admin/roles/`, role_id: id }
    });
    return response.data;
  },
  /**
   * Deletes a role from the admin account at admin/roles/?role_id={id}
   * @param id - The ID of the role to delete
   */
  deleteRole: async (id: string): Promise<any> => {
    const response = await publicApi.delete('', {
      params: { path: `api/v1/admin/roles/`, role_id: id }
    });
    return response.data;
  },
  /**
   * Deactivates a role from the admin account at admin/roles/deactivate/?role_id={id}
   * @param id - The ID of the role to deactivate
   */
  deactivateRole: async (id: string): Promise<any> => {
    const response = await publicApi.patch('', {}, {
      params: { path: `api/v1/admin/roles/deactivate/`, role_id: id }
    });
    return response.data;
  },
  /**
   * Gets all roles from the admin account at admin/roles/
   * @param payload - RolePayload object
   */
  getRoles: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/roles/' }
    });
    return response.data;
  },

  /**
   * Gets all team members from the admin account at admin/members/
   */
  getTeamMembers: async (): Promise<unknown> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/members/' }
    });
    return response.data;
  },

  /**
   * Adds a team member to the admin account at admin/members/
   * @param payload - Team member payload object
   */
  addTeamMember: async (payload: any): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/admin/members/' },
      // skipToast: true
    } as any);
    return response.data;
  },

  /**
   * Updates a team member's role
   */
  updateTeamMember: async (id: string, payload: any): Promise<any> => {
    const response = await publicApi.put('', payload, {
      params: { path: `api/v1/admin/member/update-role/`, member_id: id }
    });
    return response.data;
  },

  /**
   * Suspends a team member
   */
  suspendTeamMember: async (id: string, payload: { reason: string }): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: `api/v1/admin/suspend-member/`, user_id: id }
    });
    return response.data;
  },

  /**
   * Logs the user out by hitting the custom proxy logout route which clears cookies
   */
  logout: async () => {
    try {
      await publicApi.get('', {
        params: { path: 'auth/logout' }
      });
    } catch (e) {
      console.error('Logout failed:', e);
      throw e;
    }
  },

  /**
   * Verifies the referral code for driver online registration
   * @param data - FormData containing referral_code
   */
  verifyDriverReferral: async (data: FormData): Promise<any> => {
    const response = await publicApi.post('', data, {
      params: { path: 'api/v1/drivers/verify-referral/' },
      skipToast: true
    } as any);
    return response.data;
  },

  /**
   * Registers a new driver online
   * @param referralCode - Validated referral code
   * @param data - FormData containing driver metadata and files
   */
  registerDriverOnline: async (referralCode: string, data: FormData): Promise<any> => {
    const response = await publicApi.post('', data, {
      params: {
        path: 'api/v1/drivers/online/register/',
        referral_code: referralCode
      },
      skipToast: true
    } as any);
    return response.data;
  },

  /**
   * Fetches user profile details at accounts/profile/
   */
  getProfile: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/profile/' }
    });
    return response.data;
  },

  /**
   * Updates user profile details at accounts/profile/
   */
  updateProfile: async (payload: any): Promise<any> => {
    const response = await publicApi.put('', payload, {
      params: { path: 'api/v1/accounts/profile/' }
    });
    return response.data;
  },

  /**
   * Fetches user referral details at accounts/referrals/
   */
  getReferrals: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/referrals/' }
    });
    return response.data;
  },

  /**
   * Gets emergency contacts for user at accounts/emergency/contact/
   */
  getEmergencyContacts: async (): Promise<EmergencyContactResponse[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/emergency/contact/' }
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.results || response.data?.data || [];
  },

  /**
   * Creates an emergency contact using form-data at accounts/emergency/contact/
   */
  createEmergencyContact: async (payload: CreateEmergencyContactPayload): Promise<EmergencyContactResponse> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('country', String(payload.country));
    formData.append('phone_number', payload.phone_number);

    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/accounts/emergency/contact/' }
    });
    return response.data;
  },

  /**
   * Updates an emergency contact using form-data at accounts/emergency/contact/?contact_id={id}
   */
  updateEmergencyContact: async (contactId: number, payload: UpdateEmergencyContactPayload): Promise<any> => {
    const formData = new FormData();
    if (payload.name !== undefined) formData.append('name', payload.name);
    if (payload.country !== undefined) formData.append('country', String(payload.country));
    if (payload.phone_number !== undefined) formData.append('phone_number', payload.phone_number);

    const response = await publicApi.put('', formData, {
      params: {
        path: 'api/v1/accounts/emergency/contact/',
        contact_id: contactId
      }
    });
    return response.data;
  },

  /**
   * Deletes an emergency contact at accounts/emergency/contact/?contact_id={id}
   */
  deleteEmergencyContact: async (contactId: number): Promise<any> => {
    const response = await publicApi.delete('', {
      params: {
        path: 'api/v1/accounts/emergency/contact/',
        contact_id: contactId
      }
    });
    return response.data;
  },

  /**
   * Fetches FAQs at accounts/faqs/
   */
  getFaqs: async (): Promise<FaqItem[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/faqs/' }
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.results || response.data?.data || [];
  },

  /**
   * Updates 2FA settings at accounts/2fa/manage/
   */
  manage2FA: async (payload: Manage2FAPayload): Promise<any> => {
    const formData = new FormData();
    const isEnabledStr = typeof payload.mfa_enabled === 'boolean'
      ? (payload.mfa_enabled ? 'True' : 'False')
      : String(payload.mfa_enabled);
    formData.append('mfa_enabled', isEnabledStr);
    formData.append('mfa_method', payload.mfa_method || '2FA_PIN');

    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/accounts/2fa/manage/' }
    });
    return response.data;
  },

  /**
   * Sets up 2FA PIN at accounts/2fa/setup/
   */
  setup2FA: async (payload: Setup2FAPinPayload): Promise<any> => {
    const formData = new FormData();
    formData.append('user_pin', payload.user_pin);
    formData.append('confirm_pin', payload.confirm_pin);

    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/accounts/2fa/setup/' }
    });
    return response.data;
  },

  /**
   * Deactivates 2FA at accounts/2fa/deactivate/
   */
  deactivate2FA: async (): Promise<any> => {
    const response = await publicApi.post('', {}, {
      params: { path: 'api/v1/accounts/2fa/deactivate/' }
    });
    return response.data;
  },

  /**
   * Initiates PIN change by verifying current PIN at accounts/2fa/initiate-pin-change/
   */
  initiatePinChange: async (payload: InitiatePinChangePayload): Promise<any> => {
    const formData = new FormData();
    formData.append('current_pin', payload.current_pin);

    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/accounts/2fa/initiate-pin-change/' }
    });
    return response.data;
  },

  /**
   * Confirms PIN change by setting new PIN at accounts/2fa/confirm-pin-change/
   */
  confirmPinChange: async (payload: ConfirmPinChangePayload): Promise<any> => {
    const formData = new FormData();
    formData.append('user_pin', payload.user_pin);
    formData.append('confirm_pin', payload.confirm_pin);

    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/accounts/2fa/confirm-pin-change/' }
    });
    return response.data;
  },

  /**
   * Deactivates user account at accounts/deactivate/
   */
  deactivateAccount: async (payload: DeactivateAccountPayload): Promise<any> => {
    const formData = new FormData();
    formData.append('password', payload.password);
    if (payload.mfa_code) {
      formData.append('mfa_code', payload.mfa_code);
    }

    const response = await publicApi.post('', formData, {
      params: { path: 'api/v1/accounts/deactivate/' }
    });
    return response.data;
  }
};
