import { create } from 'zustand';
import { User, AuthResponse } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (response: AuthResponse) => void;
  logout: () => void;
  clearError: () => void;
}

/**
 * Auth Store - Manages authentication state globally
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,

  setUser: (user) => set({ user }),

  setTokens: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    set({ token, refreshToken, isAuthenticated: true });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  login: (response) => {
    const { user, token, refreshToken } = response;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));

interface ChatState {
  sessions: any[];
  currentSession: any | null;
  isLoading: boolean;
  error: string | null;

  setCurrentSession: (session: any) => void;
  setSessions: (sessions: any[]) => void;
  addMessage: (message: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Chat Store - Manages chatbot conversations
 */
export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  setCurrentSession: (session) => set({ currentSession: session }),

  setSessions: (sessions) => set({ sessions }),

  addMessage: (message) =>
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          messages: [...state.currentSession.messages, message],
        },
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * UI Store - Manages UI state
 */
export const useUIStore = create<UIState>((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',
  isSidebarOpen: true,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

  toggleDarkMode: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return {
        isDarkMode: newTheme === 'dark',
        theme: newTheme,
      };
    }),

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme, isDarkMode: theme === 'dark' });
  },
}));
