import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, User, getAuthToken, removeAuthToken } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.getCurrentUser()
        .then(setUser)
        .catch(() => {
          // Token is invalid, remove it
          removeAuthToken();
          router.push('/login');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await api.login({ email, password });
      if (result.access_token) {
        const userData = await api.getCurrentUser();
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: result.detail || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}