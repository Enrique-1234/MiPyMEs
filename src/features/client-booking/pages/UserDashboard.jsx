import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Star, 
  Search, 
  Heart,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { StatsGrid } from '../../../components/common/StatsGrid/StatsGrid';
import { SectionPanel } from '../../../components/common/SectionPanel/SectionPanel';

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/user/dashboard', icon: <Clock size={18} />, label: 'Inicio', active: true },
    { to: '/user/reservas', icon: <Calendar size={18} />, label: 'Mis Reservas' },
    { to: '/user/explorar', icon: <Search size={18} />, label: 'Explorar Negocios' },
    { to: '/user/favoritos', icon: <Heart size={18} />, label: 'Favoritos' },
    { to: '/user/perfil', icon: <UserIcon size={18} />, label: 'Mi Perfil' },
  ];

  const stats = [
    { label: 'Próximas reservas', value: '3', subtext: 'Esta semana', icon: <Calendar size={16} /> },
    { label: 'Visitas totales', value: '47', subtext: 'Desde tu registro', icon: <Clock size={16} /> },
    { label: 'Negocios favoritos', value: '8', subtext: 'Guardados', icon: <Heart size={16} /> },
    { label: 'Puntos de fidelidad', value: '1,250', subtext: 'Nivel Oro', icon: <Star size={16} /> },
  ];

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">U</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">Mi Cuenta</span>
          </div>
        </>
      }
      navLinks={navLinks}
      user={user}
      onLogout={handleLogout}
      headerTitle={`Hola, ${user?.name || 'Usuario'}`}
      headerSubtitle="Gestiona tus reservas y descubre nuevos lugares"
    >
      <StatsGrid stats={stats} />

      <SectionPanel title="Mis Próximas Citas">
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          No tienes reservas próximas. ¡Explora nuevos negocios y agenda tu próxima visita!
        </p>
      </SectionPanel>
    </DashboardLayout>
  );
};