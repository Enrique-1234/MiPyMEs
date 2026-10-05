// src/components/common/DashboardLayout/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';

import {
  LayoutWrapper,
  SidebarOverlay,
  SidebarContainer,
  SidebarLogo,
  SidebarNav,
  SidebarUser,
  MainContent,
  Header,
  MobileMenuButton,
} from './DashboardLayout.styles';

export const DashboardLayout = ({
  sidebarLogo,
  navLinks = [],
  user,
  onLogout,
  headerTitle,
  headerSubtitle,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 Cierra el sidebar al cambiar de ruta (móvil)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // 🎯 Bloquea el scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // 🎯 Cierra con tecla ESC
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <LayoutWrapper>
      {/* Overlay en móvil */}
      <SidebarOverlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      {/* Botón hamburguesa en móvil */}
      <MobileMenuButton
        onClick={() => setSidebarOpen((s) => !s)}
        aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </MobileMenuButton>

      <SidebarContainer $open={sidebarOpen}>
        <SidebarLogo to="/" title="Volver al Home">
          {sidebarLogo || (
            <>
              <span className="badge-icon">A</span>
              <div>
                <span>AlPunto</span>
                <span className="business-tag">Panel</span>
              </div>
            </>
          )}
        </SidebarLogo>

        <SidebarNav>
          {navLinks.map((link, index) => (
            <Link key={index} to={link.to} className={link.active ? 'active' : ''}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </SidebarNav>

        <SidebarUser>
          <div className="user-details">
            <div className="avatar">
              {(user?.name || user?.email || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{user?.name || 'Usuario'}</strong>
              <span>
                {user?.role === 'business-admin' || user?.role === 'super-admin'
                  ? 'Administrador'
                  : 'Cliente'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={18} />
          </button>
        </SidebarUser>
      </SidebarContainer>

      <MainContent>
        <Header>
          <div className="header-titles">
            <h1>{headerTitle}</h1>
            <p>{headerSubtitle}</p>
          </div>
        </Header>
        {children}
      </MainContent>
    </LayoutWrapper>
  );
};