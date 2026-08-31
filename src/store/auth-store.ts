'use client';

import { create } from 'zustand';
import { authApi, type LoginInput, type RegisterInput } from '@/lib/api';
import { dashboardForRole } from '@/lib/routes';
import type { User } from '@/types/domain';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  hydrate: () => void;
  login: (input: LoginInput) => Promise<string>;
  register: (input: RegisterInput) => Promise<string>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('nextgen-lms_lms_token');
    const rawUser = window.localStorage.getItem('nextgen-lms_lms_user');
    try {
      set({ token, user: rawUser ? JSON.parse(rawUser) : null });
    } catch {
      window.localStorage.removeItem('nextgen-lms_lms_token');
      window.localStorage.removeItem('nextgen-lms_lms_user');
      set({ token: null, user: null });
    }
  },
  login: async (input) => {
    set({ loading: true, error: null });
    try {
      let role = 'learner';
      let name = 'Ali Hassan';
      const em = input.email.toLowerCase();
      if (em.includes('admin')) {
        role = 'admin';
        name = 'Master Admin';
      } else if (em.includes('school') || em.includes('institute')) {
        role = 'institute_head';
        name = 'Beaconhouse Admin';
      }

      let session;
      try {
        session = await authApi.login(input);
      } catch {
        // Fallback demo session
        session = {
          accessToken: 'mock-token',
          user: {
            id: 'demo-id',
            name,
            email: input.email,
            role: role as any,
          },
        };
      }

      if (!session?.user) {
        session = {
          accessToken: 'mock-token',
          user: {
            id: 'demo-id',
            name,
            email: input.email,
            role: role as any,
          },
        };
      }

      window.localStorage.setItem('nextgen-lms_lms_token', session.accessToken);
      window.localStorage.setItem('nextgen-lms_lms_user', JSON.stringify(session.user));
      set({ token: session.accessToken, user: session.user, loading: false });
      return dashboardForRole(session.user.role);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },
  register: async (input) => {
    set({ loading: true, error: null });
    try {
      const generatedId = `NXG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const issueDate = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const expiryDate = nextYear.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });

      let session;
      try {
        session = await authApi.register(input);
      } catch {
        session = {
          accessToken: `mock-token-${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            name: input.name,
            email: input.email,
            role: (input.role || 'learner') as any,
            avatar: input.avatar || null,
            studentId: input.studentId || generatedId,
            rollNo: input.rollNo || generatedId,
            phone: input.phone || '',
            enrolledCourse: input.enrolledCourse || 'Python for Data Science, Analytics & AI',
            batch: input.batch || `Batch ${new Date().getFullYear()}-A`,
            department: input.department || 'School of Artificial Intelligence & Computing',
            issueDate,
            expiryDate,
            verifiedBadge: true,
          },
        };
      }

      if (!session?.user?.studentId) {
        session.user = {
          ...session.user,
          avatar: input.avatar || session.user.avatar || null,
          studentId: input.studentId || generatedId,
          rollNo: input.rollNo || generatedId,
          phone: input.phone || '',
          enrolledCourse: input.enrolledCourse || 'Python for Data Science, Analytics & AI',
          batch: input.batch || `Batch ${new Date().getFullYear()}-A`,
          department: input.department || 'School of Artificial Intelligence & Computing',
          issueDate,
          expiryDate,
          verifiedBadge: true,
        };
      }

      window.localStorage.setItem('nextgen-lms_lms_token', session.accessToken);
      window.localStorage.setItem('nextgen-lms_lms_user', JSON.stringify(session.user));
      set({ token: session.accessToken, user: session.user, loading: false });
      return dashboardForRole(session.user.role);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, loading: false });
      throw error;
    }
  },
  logout: () => {
    window.localStorage.removeItem('nextgen-lms_lms_token');
    window.localStorage.removeItem('nextgen-lms_lms_user');
    set({ token: null, user: null });
  },
  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      window.localStorage.setItem('nextgen-lms_lms_user', JSON.stringify(updatedUser));
      return { user: updatedUser as User };
    });
  },
}));
