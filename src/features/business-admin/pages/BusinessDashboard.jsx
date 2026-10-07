// src/features/business-admin/pages/BusinessDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock, Calendar, Users, ShoppingBag, Grid, Settings, LogOut,
  AlertCircle, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import {
  StatsGrid, StatCard, SectionPanel, QuickList, EmptyState, EmptyBusiness,
} from './BusinessDashboard.styles';
import { WeeklyChart } from '../../../components/common/WeeklyChart/WeeklyChart';


const NAV_LINKS = [
  { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/dashboard/reservas', icon: <Calendar size={18} />, label: 'Citas y Reservas' },
  { to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' },
  { to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' },
  { to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: 'Catálogo / Menú' },
  { to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' },
  { to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' },
];

export const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allReservations, setAllReservations] = useState([]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const biz = await businessAdminService.getMyBusiness();
        if (!alive) return;
        setBusiness(biz);

        if (biz) {
          const [statsData, reservationsData] = await Promise.all([
            businessAdminService.getStats(biz.id),
            businessAdminService.listReservations(biz.id, { limit: 50 }),
          ]);
          if (!alive) return;
          setStats(statsData);
          setAllReservations(reservationsData);

          // Filtrar próximas reservas (futuras o de hoy, no canceladas)
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const upcomingList = reservationsData
            .filter((r) => {
              const { start } = businessAdminService.parseRange(r.during);
              return (
                start &&
                start >= now &&
                !['cancelled', 'completed', 'no_show'].includes(r.status)
              );
            })
            .sort((a, b) => {
              const sa = businessAdminService.parseRange(a.during).start;
              const sb = businessAdminService.parseRange(b.during).start;
              return sa - sb;
            })
            .slice(0, 5);
          setUpcoming(upcomingList);
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard' }));

  const headerTitle = business ? `Gestión de ${business.name}` : 'Mi Negocio';
  const headerSubtitle = 'Resumen general de actividad y métricas';

  const renderContent = () => {
    if (loading) {
      return <EmptyState>Cargando dashboard...</EmptyState>;
    }

    if (error) {
      return (
        <SectionPanel title="Error">
          <p style={{ color: '#ef4444' }}>⚠️ {error}</p>
        </SectionPanel>
      );
    }

    if (!business) {
      return (
        <EmptyBusiness>
          <AlertCircle size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h2>Aún no tienes un negocio asignado</h2>
          <p>
            Contacta al administrador de AlPunto para que te asigne un negocio.
            Una vez asignado, aquí verás tus reservas y estadísticas.
          </p>
        </EmptyBusiness>
      );
    }

    return (
      <>
        {/* Stats */}
        <StatsGrid>
          <StatCard $highlight={stats?.pendingCount > 0}>
            <div className="stat-header">
              <span>Reservas hoy</span>
              <Calendar size={16} />
            </div>
            <div className="stat-value">{stats?.todayTotal ?? 0}</div>
            <div className="stat-subtext">
              {stats?.todayGuests ?? 0} personas esperadas
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <span>Esta semana</span>
              <Clock size={16} />
            </div>
            <div className="stat-value">{stats?.weekTotal ?? 0}</div>
            <div className="stat-subtext">
              {stats?.weekGuests ?? 0} personas en total
            </div>
          </StatCard>

          <StatCard $highlight={stats?.pendingCount > 0}>
            <div className="stat-header">
              <span>Pendientes</span>
              <AlertCircle size={16} />
            </div>
            <div className="stat-value">{stats?.pendingCount ?? 0}</div>
            <div className="stat-subtext">
              {stats?.pendingCount > 0 ? 'Requieren confirmación' : 'Todo al día ✓'}
            </div>
          </StatCard>
        </StatsGrid>

        {/* Próximas reservas */}
        <SectionPanel>
          <div className="panel-header">
            <h3>Próximas reservas</h3>
            <Link
              to="/dashboard/reservas"
              style={{
                fontSize: '0.85rem',
                color: '#FF6B00',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState>
              No hay reservas próximas. Cuando los clientes reserven, aparecerán aquí.
            </EmptyState>
          ) : (
            <QuickList>
              {upcoming.map((r) => {
                const { start } = businessAdminService.parseRange(r.during);
                const timeStr = start
                  ? start.toLocaleString('es-MX', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: business.timezone || 'America/Mexico_City',
                    })
                  : '—';
                return (
                  <li key={r.id}>
                    <span className="time">{timeStr}</span>
                    <span className="guest">
                      {r.guest_name}
                      {r.status === 'pending' && (
                        <span
                          style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.7rem',
                            color: '#FACC15',
                            fontWeight: 700,
                          }}
                        >
                          · PENDIENTE
                        </span>
                      )}
                    </span>
                    <span className="party">👥 {r.party_size}</span>
                  </li>
                );
              })}
            </QuickList>
          )}
        </SectionPanel>

        {/* ⬇️ NUEVO: Actividad de la semana — como hermano, no anidado */}
        <SectionPanel>
          <div className="panel-header">
            <h3>Actividad de la semana</h3>
          </div>
          <WeeklyChart
            reservations={allReservations}
            parseRange={businessAdminService.parseRange}
            timezone={business.timezone}
          />
        </SectionPanel>
      </>
    );
  };

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">A</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">{business?.name || 'Mi Negocio'}</span>
          </div>
        </>
      }
      navLinks={navLinks}
      user={user}
      onLogout={handleLogout}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      {renderContent()}
    </DashboardLayout>
  );
};