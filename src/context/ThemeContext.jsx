// src/context/ThemeContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { darkTheme, lightTheme } from '../styles/theme';

const ThemeContext = createContext();
const STORAGE_KEY = 'alpunto-theme';

// Detecta tema inicial: localStorage > preferencia del sistema > dark
const getInitialMode = () => {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  // Si el sistema prefiere light y no hay preferencia guardada, respétalo
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'dark';
};

export const AppThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState(getInitialMode);

  // Aplica el tema al DOM y persiste en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setMode = useCallback((newMode) => {
    if (newMode === 'dark' || newMode === 'light') {
      setModeState(newMode);
    }
  }, []);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({ mode, theme, toggleTheme, setMode }),
    [mode, theme, toggleTheme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de AppThemeProvider');
  }
  return ctx;
};