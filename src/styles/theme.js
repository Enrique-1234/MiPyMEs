export const theme = {
  colors: {
    // ----- Marca Al Punto -----
    primary: '#FF6B00',
    primaryDark: '#CC5500',
    primaryHover: '#FF8A2B',
    primaryGlow: 'rgba(255,107,0,0.45)',

    secondary: '#FF2E93',
    accent: '#FFD400',

    // ----- Acentos street  -----
    accentPink: '#FF2E93',
    accentLime: '#C6FF00',
    accentCyan: '#00E5FF',
    accentYellow: '#FFD400',

    // ----- Superficies -----
    background: '#0A0A0A',
    backgroundAlt: '#141414',
    surface: '#1C1C1C',
    border: '#2A2A2A',

    // ----- Texto -----
    text: '#F5F5F5',
    textSoft: '#A1A1AA',

    // ----- Estados -----
    success: '#22C55E',
    warning: '#FACC15',
    error: '#EF4444',
    info: '#38BDF8',

    // ----- Gradientes -----
    gradientPrimary: 'linear-gradient(135deg, #FF6B00 0%, #FF2E93 100%)',
    gradientFire: 'linear-gradient(135deg, #FFD400 0%, #FF6B00 50%, #CC5500 100%)',
  },

  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
  },

  fonts: {
    display: "'Anton', 'Bebas Neue', system-ui, sans-serif",
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.5)',
    md: '0 4px 12px rgba(0,0,0,0.6)',
    lg: '0 10px 30px rgba(0,0,0,0.75)',
    glowPrimary: '0 0 20px rgba(255,107,0,0.55), 0 0 40px rgba(255,107,0,0.25)',
    glowPink: '0 0 20px rgba(255,46,147,0.55)',
    glowLime: '0 0 20px rgba(198,255,0,0.55)',
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