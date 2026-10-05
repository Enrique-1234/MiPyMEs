// src/features/business-admin/pages/Dashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, ShoppingBag, Grid, Clock, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { StatsGrid } from '../../../components/common/StatsGrid/StatsGrid';
import { SectionPanel } from '../../../components/common/SectionPanel/SectionPanel';

export const Dashboard = ({ tenantConfig }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tenant = tenantConfig || {
    name: user?.businessName || 'AlPunto Partner',
    type: user?.businessType || 'general',
    modules: {
      hasReservations: true,
      hasCalendar: true,
      hasCatalog: true,
      hasTableMap: false,
      hasStaff: true,
    }
  };

  const isAdmin = user?.role === 'business-admin' || user?.role === 'super-admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Definimos los links del sidebar dinámicamente
  const navLinks = [
    { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio', active: true },
    ...(tenant.modules.hasReservations ? [{ to: '/dashboard/reservas', icon: <Calendar size={18} />, label: tenant.type === 'restaurante' ? 'Reservas de Mesas' : 'Citas y Reservas' }] : []),
    ...(tenant.modules.hasCalendar ? [{ to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' }] : []),
    ...(tenant.modules.hasTableMap ? [{ to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' }] : []),
    ...(isAdmin && tenant.modules.hasCatalog ? [{ to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: tenant.type === 'barberia' ? 'Servicios y Precios' : 'Catálogo / Menú' }] : []),
    ...(isAdmin && tenant.modules.hasStaff ? [{ to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' }] : []),
    ...(isAdmin ? [{ to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' }] : []),
  ];

  const stats = isAdmin ? [
    { label: 'Citas de hoy', value: '16', subtext: '+14% respecto a ayer', icon: <Clock size={16} /> },
    { label: 'Próximas reservas', value: '22', subtext: 'Esta semana', icon: <Calendar size={16} /> },
    { label: 'Clientes registrados', value: '340', subtext: 'Total activo', icon: <Users size={16} /> },
    { label: 'Ingresos estimados', value: '$38,500 MXN', subtext: 'Este mes', icon: <DollarSign size={16} /> },
  ] : [];

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">A</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">{tenant.name}</span>
          </div>
        </>
      }
      navLinks={navLinks}
      user={user}
      onLogout={handleLogout}
      headerTitle={isAdmin ? `Gestión de ${tenant.name}` : 'Mis Reservas'}
      headerSubtitle={isAdmin ? 'Resumen general de actividad y métricas' : 'Consulta el estado de tus citas agendadas'}
    >
      {isAdmin && <StatsGrid stats={stats} />}
      <SectionPanel title={isAdmin ? 'Actividad Reciente' : 'Mis Citas Próximas'}>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          No hay registros pendientes por mostrar en este momento.
        </p>
      </SectionPanel>
    </DashboardLayout>
  );
};