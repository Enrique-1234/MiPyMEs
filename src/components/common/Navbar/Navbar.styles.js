import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

const sweep = keyframes`0%,65%{transform:translateX(-120%)}100%{transform:translateX(120%)}`;
const ping = keyframes`0%{transform:scale(1);opacity:.6}100%{transform:scale(1.9);opacity:0}`;

export const NavHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(1rem, 3vw, 2rem);
  z-index: 9999; /* Asegura estar siempre por encima del Hero y fondos */
  background: ${({ $scrolled }) => ($scrolled ? 'rgba(28, 28, 28, 0.88)' : 'rgba(10, 10, 10, 0.75)')};
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ $scrolled }) => ($scrolled ? '0 10px 30px -18px rgba(0,0,0,0.5)' : 'none')};
  transition: background 0.35s ease, box-shadow 0.35s ease;
`;

export const NavProgress = styled.div`
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 3px;
  transform: scaleX(0);
  transform-origin: left;
  background: linear-gradient(90deg, ${({ theme }) => theme?.colors?.primary || '#2563eb'}, ${({ theme }) => theme?.colors?.accent || '#06b6d4'});
`;

export const LogoBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};

  .logo-mark {
    position: relative;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(135deg, ${({ theme }) => theme?.colors?.primary || '#2563eb'}, ${({ theme }) => theme?.colors?.accent || '#06b6d4'});
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .logo-mark::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme?.colors?.primary || '#2563eb'};
    animation: ${ping} 2.4s ease-out infinite;
  }
  &:hover .logo-mark { transform: rotate(-12deg) scale(1.1); }
`;

export const NavLinksGroup = styled.nav`
  display: flex;
  gap: 2rem;

  a {
    position: relative;
    padding: 0.4rem 0;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSoft || '#64748b'};
    transition: color 0.25s ease;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      border-radius: 2px;
      transform: scaleX(0);
      transform-origin: right;
      background: linear-gradient(90deg, ${({ theme }) => theme?.colors?.primary || '#2563eb'}, ${({ theme }) => theme?.colors?.accent || '#06b6d4'});
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    &:hover { color: ${({ theme }) => theme?.colors?.text || '#1e293b'}; }
    &:hover::after { transform: scaleX(1); transform-origin: left; }
  }

  @media (max-width: 860px) { display: none; }
`;

export const NavActionsGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

export const NavButton = styled(Link)`
  position: relative;
  overflow: hidden;
  max-width: 200px;
  padding: 0.55rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s, box-shadow 0.25s;

  &:hover { transform: translateY(-2px); }
  &:focus-visible { outline: 3px solid ${({ theme }) => theme?.colors?.accent || '#06b6d4'}; outline-offset: 2px; }

  ${({ $primary, theme }) =>
    $primary
      ? css`
    background-color: ${theme?.colors?.primary || '#2563eb'};
    color: #ffffff;
    &:hover { background-color: ${theme?.colors?.primaryDark || '#1d4ed8'}; box-shadow: 0 10px 20px -8px ${theme?.colors?.primary || '#2563eb'}; }
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.45) 50%, transparent 70%);
      animation: ${sweep} 3.5s ease-in-out infinite;
    }
  `
      : css`
    border: 1px solid ${theme?.colors?.border || '#cbd5e1'};
    color: ${theme?.colors?.text || '#1e293b'};
    &:hover { border-color: ${theme?.colors?.primary || '#2563eb'}; color: ${theme?.colors?.primary || '#2563eb'}; }
    @media (max-width: 640px) { display: none; }
  `}
`;

export const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme?.colors?.error || '#ef4444'};
  font-weight: 600;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const MenuButton = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-content: center;
  gap: 6px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#cbd5e1'};
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s;

  span {
    display: block;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme?.colors?.text || '#1e293b'};
    transition: width 0.3s ease;
  }
  span:last-child { width: 11px; margin-left: auto; }
  &:hover { transform: scale(1.08); border-color: ${({ theme }) => theme?.colors?.primary || '#2563eb'}; }
  &:hover span:last-child { width: 18px; }
  &:focus-visible { outline: 3px solid ${({ theme }) => theme?.colors?.accent || '#06b6d4'}; outline-offset: 2px; }
`;