import { User } from '@/types';

import { apiClient } from './client';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}

export class AuthService {
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);

    if (response.success && response.token) {
      localStorage.setItem('afrovibz-token', response.token);
    }

    return response;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    if (response.success && response.token) {
      localStorage.setItem('afrovibz-token', response.token);
    }

    return response;
  }

  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/logout');
      localStorage.removeItem('afrovibz-token');
      return response;
    } catch (error) {
      // Même en cas d'erreur, on supprime le token local
      localStorage.removeItem('afrovibz-token');
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
    return response.user;
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('afrovibz-token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static clearToken(): void {
    localStorage.removeItem('afrovibz-token');
  }
}
