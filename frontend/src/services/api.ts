import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../context/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * API Service
 * Handles all HTTP requests with authentication
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        interface AxiosRequestConfig extends Record<string, unknown> {
          _retry?: boolean;
          headers?: { Authorization?: string };
        }
        const originalRequest = error.config as AxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await this.api.post('/auth/refresh', {
              refreshToken,
            });

            const { token } = response.data.data;
            localStorage.setItem('token', token);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.api(originalRequest);
          } catch (refreshError) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Authentication Endpoints
   */
  async register(data: Record<string, unknown>) {
    return this.api.post('/auth/register', data);
  }

  async login(email: string, password: string) {
    return this.api.post('/auth/login', { email, password });
  }

  async getProfile() {
    return this.api.get('/auth/profile');
  }

  async updateProfile(data: Record<string, unknown>) {
    return this.api.put('/auth/profile', data);
  }

  /**
   * Chatbot Endpoints
   */
  async startChatSession() {
    return this.api.post('/chat/start');
  }

  async sendChatMessage(message: string, sessionId?: string) {
    return this.api.post('/chat/send', { message, sessionId });
  }

  async getChatHistory(sessionId: string) {
    return this.api.get(`/chat/history/${sessionId}`);
  }

  async getAllSessions() {
    return this.api.get('/chat/sessions');
  }

  async endChatSession(sessionId: string) {
    return this.api.post(`/chat/end/${sessionId}`);
  }

  /**
   * Appointment Endpoints
   */
  async getDoctors(specialization?: string, skip?: number, limit?: number) {
    return this.api.get('/appointments/doctors', {
      params: { specialization, skip, limit },
    });
  }

  async getDoctorDetails(doctorId: string) {
    return this.api.get(`/appointments/doctors/${doctorId}`);
  }

  async bookAppointment(data: Record<string, unknown>) {
    return this.api.post('/appointments/book', data);
  }

  async getUserAppointments() {
    return this.api.get('/appointments');
  }

  async cancelAppointment(appointmentId: string) {
    return this.api.post(`/appointments/${appointmentId}/cancel`);
  }

  async rateAppointment(appointmentId: string, rating: number, comment: string) {
    return this.api.post(`/appointments/${appointmentId}/rate`, {
      rating,
      comment,
    });
  }

  /**
   * Medicine Endpoints
   */
  async searchMedicines(query: string, skip?: number, limit?: number) {
    return this.api.get('/medicines/search', {
      params: { query, skip, limit },
    });
  }

  async getAllMedicines(skip?: number, limit?: number) {
    return this.api.get('/medicines', { params: { skip, limit } });
  }

  async getMedicineDetails(medicineId: string) {
    return this.api.get(`/medicines/${medicineId}`);
  }

  /**
   * Health Endpoints
   */
  async createHealthRecord(data: Record<string, unknown>) {
    return this.api.post('/health/records', data);
  }

  async getUserHealthRecords(recordType?: string, skip?: number, limit?: number) {
    return this.api.get('/health/records', {
      params: { recordType, skip, limit },
    });
  }

  async getLatestVitals() {
    return this.api.get('/health/vitals');
  }

  async calculateBMI(weight: number, height: number) {
    return this.api.post('/health/bmi', { weight, height });
  }
}

export const apiService = new ApiService();
