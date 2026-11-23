// src/styles/theme.js

// Colores de marca compartidos entre ambos temas
const BRAND = {
  primary: '#FF6B00',
  primaryDark: '#CC5500',
  primaryHover: '#FF8A2B',
  secondary: '#FF2E93',
  accent: '#FFD400',
  accentPink: '#FF2E93',
  accentLime: '#C6FF00',
  accentCyan: '#00E5FF',
  accentYellow: '#FFD400',
  gradientPrimary: 'linear-gradient(135deg, #FF6B00 0%, #FF2E93 100%)',
  gradientFire: 'linear-gradient(135deg, #FFD400 0%, #FF6B00 50%, #CC5500 100%)',
};

// Estructura compartida (fonts, breakpoints, radii, transitions)
const SHARED = {
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
  },
  fonts: {
    display: "'Anton', 'Bebas Neue', system-ui, sans-serif",
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  transitions: {
    fast: '150ms ease',
    base: '250ms ease',
    slow: '400ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
};

// =====================================================================
// DARK THEME (el actual)
// =====================================================================
export const darkTheme = {
  mode: 'dark',
  ...SHARED,
  colors: {
    ...BRAND,
    primaryGlow: 'rgba(255,107,0,0.45)',

    // Superficies oscuras
    background: '#0A0A0A',
    backgroundAlt: '#141414',
    surface: '#1C1C1C',
    border: '#2A2A2A',

    // Texto claro
    text: '#F5F5F5',
    textSoft: '#A1A1AA',

    // Estados
    success: '#22C55E',
    warning: '#FACC15',
    error: '#EF4444',
    info: '#38BDF8',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.5)',
    md: '0 4px 12px rgba(0,0,0,0.6)',
    lg: '0 10px 30px rgba(0,0,0,0.75)',
    glowPrimary: '0 0 20px rgba(255,107,0,0.55), 0 0 40px rgba(255,107,0,0.25)',
    glowPink: '0 0 20px rgba(255,46,147,0.55)',
    glowLime: '0 0 20px rgba(198,255,0,0.55)',
  },
};

// =====================================================================
// LIGHT THEME
// =====================================================================
export const lightTheme = {
  mode: 'light',
  ...SHARED,
  colors: {
    ...BRAND,
    primaryGlow: 'rgba(255,107,0,0.25)',

    // Superficies claras
    background: '#FFFFFF',
    backgroundAlt: '#F8F9FA',
    surface: '#FFFFFF',
    border: '#E5E7EB',

    // Texto oscuro
    text: '#111827',
    textSoft: '#6B7280',

    // Estados (tonos más oscuros para contraste en blanco)
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 10px 30px rgba(0,0,0,0.1)',
    glowPrimary: '0 0 20px rgba(255,107,0,0.3), 0 0 40px rgba(255,107,0,0.15)',
    glowPink: '0 0 20px rgba(255,46,147,0.3)',
    glowLime: '0 0 20px rgba(198,255,0,0.3)',
  },
};

// Retrocompatibilidad: `theme` exportado por defecto es darkTheme
export const theme = darkTheme;