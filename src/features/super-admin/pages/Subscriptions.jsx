// src/features/super-admin/pages/Subscriptions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  CheckCircle2, TrendingUp, DollarSign, Wallet
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

export const Subscriptions = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>ReservaPro</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map(l => ({ ...l, active: l.to === '/super-admin/suscripciones' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Suscripciones y Pagos"
      headerSubtitle="Gestiona los planes y la facturación de la plataforma"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Card 1 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Ingresos del Mes</span>
            <DollarSign size={20} color="#22C55E" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>$12,450 <span style={{ fontSize: '1rem', color: 'var(--text-soft)' }}>MXN</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#22C55E', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>
            <TrendingUp size={14} /> +15% vs mes anterior
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Suscripciones Activas</span>
            <Wallet size={20} color="#FF6B00" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>48</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-soft)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            De 60 negocios registrados
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255, 107, 0, 0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
          <CreditCard size={32} color="#FF6B00" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Módulo de Facturación en Desarrollo</h2>
        <p style={{ color: 'var(--text-soft)', maxWidth: '500px', margin: '0 auto' }}>
          Próximamente podrás gestionar cobros recurrentes, descargar facturas y administrar los planes de suscripción directamente desde aquí.
        </p>
      </div>
    </DashboardLayout>
  );
};