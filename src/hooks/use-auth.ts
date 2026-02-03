
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
        setIsAuthenticated(false);
        return;
      }

      // Intentamos verificar la sesión. 
      // Si el servidor falla pero tenemos token, en prototipo asumimos que el usuario sigue ahí.
      try {
        await apiClient.get('/proyectos');
      } catch (err: any) {
        // Si es error 401 (Unauthorized), sí borramos la sesión
        if (err.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        // Para otros errores (conexión, etc.), permitimos continuar en prototipo
        console.warn("API check failed, but keeping session for prototype");
      }
      
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
