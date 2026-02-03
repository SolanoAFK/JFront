
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { User } from '@/lib/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('buildflow_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // We don't have a direct /me endpoint in proposal, but we can list users or similar
      // For this implementation, we'll decode the token or just assume session is valid
      // if we can make a protected call. Let's try to get projects as a ping.
      await apiClient.get('/proyectos');
      
      // In a real app, we'd have /auth/me to get the user profile.
      // Mocking user profile based on typical JWT payload or generic admin for now.
      setUser({
        username: 'admin',
        nombre: 'Admin',
        apellido: 'User',
        email: 'admin@buildflow.com',
        rol: 'ADMIN'
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('buildflow_token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (token: string) => {
    localStorage.setItem('buildflow_token', token);
    setIsAuthenticated(true);
    await fetchUser();
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('buildflow_token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return { user, loading, isAuthenticated, login, logout, refreshUser: fetchUser };
};
