// src/features/super-admin/pages/Security.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Lock, Activity, Eye, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

export const Security = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map(l => ({ ...l, active: l.to === '/super-admin/seguridad' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Seguridad del Sistema"
      headerSubtitle="Supervisa la actividad y los accesos a la plataforma"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Card: Estado de RLS */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '10px' }}>
              <Lock size={20} color="#22C55E" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Row Level Security</h3>
          </div>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Todas las tablas tienen RLS activo. El acceso está restringido por rol.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22C55E', fontWeight: 600, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> Todo en orden
          </div>
        </div>

        {/* Card: Actividad Reciente */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px' }}>
              <Activity size={20} color="#38BDF8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Logs de Acceso</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
              <span>Inicio de sesión (Super Admin)</span>
              <span>Hace 2 min</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
              <span>Nuevo negocio registrado</span>
              <span>Hace 1 hora</span>
            </li>
          </ul>
        </div>

        {/* Card: Auditoría Visual */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(250, 204, 21, 0.1)', borderRadius: '10px' }}>
              <Eye size={20} color="#FACC15" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Auditoría de Datos</h3>
          </div>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Historial de cambios en tablas críticas (quién editó qué y cuándo).</p>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(250, 204, 21, 0.1)', borderRadius: '8px', color: '#FACC15', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block' }}>
            Próximamente
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};