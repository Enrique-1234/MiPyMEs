import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fonts?.body || 'system-ui, sans-serif'};
    background-color: ${({ theme }) => theme.colors.background};
    background-image:
      radial-gradient(circle at 15% 0%, rgba(255, 107, 0, 0.18), transparent 45%),
      radial-gradient(circle at 85% 100%, rgba(255, 46, 147, 0.12), transparent 50%);
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.fonts?.display || 'system-ui, sans-serif'};
    letter-spacing: 0.02em;
    line-height: 1.1;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    background: ${({ theme }) => theme.colors.gradientFire};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  h2 { font-size: clamp(1.75rem, 4vw, 3rem); }
  h3 { font-size: clamp(1.25rem, 2.5vw, 1.75rem); color: ${({ theme }) => theme.colors.primary}; }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions?.fast || '150ms ease'};

    &:hover { color: ${({ theme }) => theme.colors.primary}; }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
    transition: transform ${({ theme }) => theme.transitions?.fast || '150ms ease'};

    &:hover { transform: translateY(-1px); }
    &:active { transform: translateY(0); }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: #000;
  }

  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.backgroundAlt}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gradientPrimary};
    border-radius: 999px;
  }
`;