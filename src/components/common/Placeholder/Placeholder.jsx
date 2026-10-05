// src/components/common/Placeholder/Placeholder.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Calendar, Clock, ShoppingBag, Grid, User as UserIcon, Search, Heart,
  TrendingUp, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../DashboardLayout/DashboardLayout';
import { SectionPanel } from '../SectionPanel/SectionPanel';

// 🎯 Definición de links por rol (centralizada)
const NAV_LINKS_BY_ROLE = {
  'super-admin': [
    { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
    { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
    { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
    { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
    { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
    { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
  ],
  'business-admin': [
    { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
    { to: '/dashboard/reservas', icon: <Calendar size={18} />, label: 'Citas y Reservas' },
    { to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' },
    { to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' },
    { to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: 'Catálogo / Menú' },
    { to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' },
    { to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' },
  ],
  'client': [
    { to: '/user/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
    { to: '/user/reservas', icon: <Calendar size={18} />, label: 'Mis Reservas' },
    { to: '/user/explorar', icon: <Search size={18} />, label: 'Explorar Negocios' },
    { to: '/user/favoritos', icon: <Heart size={18} />, label: 'Favoritos' },
    { to: '/user/perfil', icon: <UserIcon size={18} />, label: 'Mi Perfil' },
  ],
};

// 🎯 Configuración del sidebar según el rol
const SIDEBAR_CONFIG_BY_ROLE = {
  'super-admin': { badge: 'SA', brand: 'AlPunto', subtitle: 'Super Admin' },
  'business-admin': { badge: 'A', brand: 'AlPunto', subtitle: 'Mi Negocio' },
  'client': { badge: 'U', brand: 'AlPunto', subtitle: 'Mi Cuenta' },
};

export const Placeholder = ({ title, subtitle = 'Esta sección estará disponible pronto' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'client';
  const navLinks = NAV_LINKS_BY_ROLE[role] || [];
  const sidebarCfg = SIDEBAR_CONFIG_BY_ROLE[role] || SIDEBAR_CONFIG_BY_ROLE.client;

  // Marca el link activo según la ruta actual
  const currentPath = window.location.pathname;
  const linksWithActive = navLinks.map((link) => ({
    ...link,
    active: link.to === currentPath,
  }));

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">{sidebarCfg.badge}</span>
          <div>
            <span>{sidebarCfg.brand}</span>
            <span className="business-tag">
              {role === 'business-admin' ? (user?.businessName || sidebarCfg.subtitle) : sidebarCfg.subtitle}
            </span>
          </div>
        </>
      }
      navLinks={linksWithActive}
      user={user}
      onLogout={handleLogout}
      headerTitle={title}
      headerSubtitle={subtitle}
    >
      <SectionPanel title="🚧 En construcción">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#94a3b8',
            fontSize: '0.95rem',
            padding: '1rem 0',
          }}
        >
          <AlertCircle size={20} />
          <span>Esta sección estará disponible en la próxima versión. Mientras tanto, puedes seguir navegando por el resto del panel.</span>
        </div>
      </SectionPanel>
    </DashboardLayout>
  );
};