// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { authService, ROLE_HOME } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⚠️ Empieza en true
  const [error, setError] = useState(null);

  // 🎯 Al montar, recuperar la sesión activa (si existe)
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const profile = await authService.getCurrentUser();
        if (mounted) setUser(profile);
      } catch (err) {
        console.error('Error inicializando auth:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    // 🎯 Escuchar cambios de auth (login/logout desde otra pestaña, token expirado, etc.)
    const unsubscribe = authService.onAuthStateChange((profile) => {
      if (mounted) setUser(profile);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await authService.login(email, password);
      setUser(profile);
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getHomeRoute = useCallback(() => {
    if (!user) return '/login';
    return ROLE_HOME[user.role] || '/login';
  }, [user]);

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    getHomeRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);