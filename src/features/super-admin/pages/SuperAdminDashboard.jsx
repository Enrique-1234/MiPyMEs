import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Settings, 
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { StatsGrid } from '../../../components/common/StatsGrid/StatsGrid';
import { SectionPanel } from '../../../components/common/SectionPanel/SectionPanel';

export const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global', active: true },
    { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
    { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
    { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
    { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
    { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
  ];

  const stats = [
    { label: 'Negocios activos', value: '128', subtext: '+8 este mes', icon: <Building2 size={16} /> },
    { label: 'Usuarios totales', value: '4,320', subtext: '+12% vs mes anterior', icon: <Users size={16} /> },
    { label: 'Suscripciones activas', value: '96', subtext: '75% del total', icon: <CreditCard size={16} /> },
    { label: 'Ingresos mensuales', value: '$142,800 MXN', subtext: '+18% YoY', icon: <TrendingUp size={16} /> },
  ];

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">SA</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">Super Admin</span>
          </div>
        </>
      }
      navLinks={navLinks}
      user={user}
      onLogout={handleLogout}
      headerTitle="Panel de Control Central"
      headerSubtitle="Vista global de la plataforma AlPunto"
    >
      <StatsGrid stats={stats} />

      <SectionPanel title="Solicitudes Pendientes de Aprobación">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.95rem' }}>
          <AlertCircle size={18} />
          <span>Hay 5 negocios esperando revisión para ser aprobados.</span>
        </div>
      </SectionPanel>
    </DashboardLayout>
  );
};