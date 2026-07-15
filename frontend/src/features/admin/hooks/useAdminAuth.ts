'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSession();
  }, [fetchSession]);

  const login = async (email: string, pass: string, remember: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, remember }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        router.push('/admin');
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch {
      return { success: false, message: 'Connection error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, login, logout, refreshSession: fetchSession };
}
