import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3000/api';
  } else {
    return 'http://localhost:3000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

export const tokenManager = {
  async setToken(token: string) {
    await SecureStore.setItemAsync('accessToken', token);
  },

  async getToken() {
    return await SecureStore.getItemAsync('accessToken');
  },

  async setMFAToken(token: string) {
    await SecureStore.setItemAsync('mfaToken', token);
  },

  async getMFAToken() {
    return await SecureStore.getItemAsync('mfaToken');
  },

  async clearTokens() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('mfaToken');
  }
};

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (options.headers) {
    const optionsHeaders = options.headers as Record<string, string>;
    Object.assign(headers, optionsHeaders);
  }
  
  const config: RequestInit = {
    ...options,
    headers,
  };

  if (!headers['Authorization']) {
    const token = await tokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network request failed');
  }
}

export const authAPI = {
  async register(userData: { username: string; email: string; password: string }) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(credentials: { username: string; password: string }) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.mfaToken) {
      await tokenManager.setMFAToken(response.data.mfaToken);
    }

    return response;
  },

  async verifyEmail(code: string) {
    const mfaToken = await tokenManager.getMFAToken();
    
    const response = await apiRequest('/auth/verify-email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mfaToken}`,
      },
      body: JSON.stringify({ code }),
    });

    if (response.data?.accessToken) {
      await tokenManager.setToken(response.data.accessToken);
      await SecureStore.deleteItemAsync('mfaToken');
    }

    return response;
  },

  async resendCode() {
    const mfaToken = await tokenManager.getMFAToken();
    
    return apiRequest('/auth/resend-code', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mfaToken}`,
      },
    });
  },

  async logout() {
    await tokenManager.clearTokens();
  },
};


export async function isAuthenticated() {
  const token = await tokenManager.getToken();
  return !!token;
}
