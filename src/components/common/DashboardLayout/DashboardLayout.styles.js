// src/components/common/DashboardLayout/DashboardLayout.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
`;

/* 🎯 Overlay oscuro detrás del sidebar en móvil */
export const SidebarOverlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 998;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.3s ease;

  @media (max-width: 900px) {
    display: block;
  }
`;

export const SidebarContainer = styled.aside`
  width: 260px;
  min-width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  z-index: 999;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* 🎯 En móvil: drawer lateral deslizante */
  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    box-shadow: ${({ $open }) =>
      $open ? '4px 0 30px rgba(0, 0, 0, 0.5)' : 'none'};
  }
`;

export const SidebarLogo = styled(Link)`
  font-size: 1.25rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  .badge-icon {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: bold;
    flex-shrink: 0;
  }

  .business-tag {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
    display: block;
    font-weight: 500;
  }
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  overflow-y: auto;

  a, button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;

    &:hover, &.active {
      background-color: rgba(37, 99, 235, 0.08);
      color: ${({ theme }) => theme.colors.primary};
    }

    svg {
      flex-shrink: 0;
    }
  }
`;

export const SidebarUser = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .user-details {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    span { font-size: 0.75rem; color: ${({ theme }) => theme.colors.textSoft}; }
    strong { font-size: 0.85rem; color: ${({ theme }) => theme.colors.text}; }
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  width: calc(100vw - 260px);
  min-width: 0;

  @media (max-width: 900px) {
    width: 100%;
    padding: 5rem 1.25rem 2rem;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  .header-titles {
    h1 {
      font-size: 1.875rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
      line-height: 1.2;

      @media (max-width: 600px) {
        font-size: 1.5rem;
      }
    }
    p {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.textSoft};
      margin-top: 0.25rem;
    }
  }
`;

/* 🎯 Botón hamburguesa: solo visible en móvil */
export const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 900px) {
    display: flex;
  }
`;