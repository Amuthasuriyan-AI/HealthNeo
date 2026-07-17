import { useEffect, useState } from 'react';
import { useAuthStore } from '../context/store';
import { apiService } from '../services/api';
import { AuthResponse, User } from '../types';

/**
 * useAuth Hook
 * Provides authentication functionality
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      authStore.setUser(JSON.parse(user));
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      authStore.setLoading(true);
      const response = await apiService.login(email, password);
      authStore.login(response.data.data);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as Record<string, unknown>;
      const message =
        (error.response as Record<string, unknown>)?.data?.message || 'Login failed';
      authStore.setError(message as string);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  const register = async (data: Record<string, unknown>) => {
    try {
      authStore.setLoading(true);
      const response = await apiService.register(data);
      authStore.login(response.data.data);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as Record<string, unknown>;
      const message =
        (error.response as Record<string, unknown>)?.data?.message || 'Registration failed';
      authStore.setError(message as string);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  const logout = () => {
    authStore.logout();
  };

  const updateProfile = async (data: Record<string, unknown>) => {
    try {
      authStore.setLoading(true);
      const response = await apiService.updateProfile(data);
      authStore.setUser(response.data.data as User);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    } catch (err: unknown) {
      const error = err as Record<string, unknown>;
      const message =
        (error.response as Record<string, unknown>)?.data?.message || 'Update failed';
      authStore.setError(message as string);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    isInitialized,
    login,
    register,
    logout,
    updateProfile,
    clearError: authStore.clearError,
  };
};

/**
 * useFetch Hook
 * Generic hook for fetching data
 */
export const useFetch = <T = unknown,>(
  fetchFn: () => Promise<unknown>,
  dependencies: unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn();
      const responseData = response as Record<string, unknown>;
      setData((responseData.data as T) || (response as T));
    } catch (err: unknown) {
      const error = err as Record<string, unknown>;
      setError((error.response as Record<string, unknown>)?.data?.message as string || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};

/**
 * useLocalStorage Hook
 * Manage localStorage state
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (_error) {
      console.error(_error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (_error) {
      console.error(_error);
    }
  };

  return [storedValue, setValue] as const;
};

/**
 * useDebounce Hook
 * Debounce values
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
