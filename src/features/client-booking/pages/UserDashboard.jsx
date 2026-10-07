// src/features/client-booking/pages/UserDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Clock, Star, Search, Heart,
  User as UserIcon, ArrowRight, CalendarX2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { SectionPanel } from '../../../components/common/SectionPanel/SectionPanel';
import { StatsGrid } from '../../../components/common/StatsGrid/StatsGrid';
import { reservationsService } from '../services/reservationsService';
import {
  QuickList, EmptyState,
} from '../../business-admin/pages/BusinessDashboard.styles';

const NAV_LINKS = [
  { to: '/user/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/user/reservas', icon: <Calendar size={18} />, label: 'Mis Reservas' },
  { to: '/user/explorar', icon: <Search size={18} />, label: 'Explorar Negocios' },
  { to: '/user/favoritos', icon: <Heart size={18} />, label: 'Favoritos' },
  { to: '/user/perfil', icon: <UserIcon size={18} />, label: 'Mi Perfil' },
];

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await reservationsService.listMyReservations();
        if (alive) setReservations(data);
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

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = reservations.filter((r) => {
      const { start } = reservationsService.parseRange(r.during);
      return start && start >= now && !['cancelled', 'completed', 'no_show'].includes(r.status);
    });
    const completed = reservations.filter((r) => r.status === 'completed');
    const uniqueBusinesses = new Set(reservations.map((r) => r.business?.id).filter(Boolean));

    return {
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      totalCount: reservations.length,
      uniqueBusinessesCount: uniqueBusinesses.size,
    };
  }, [reservations]);

  // Próximas 3
  const upcoming = useMemo(() => {
    const now = new Date();
    return reservations
      .filter((r) => {
        const { start } = reservationsService.parseRange(r.during);
        return start && start >= now && !['cancelled', 'completed', 'no_show'].includes(r.status);
      })
      .sort((a, b) => {
        const sa = reservationsService.parseRange(a.during).start;
        const sb = reservationsService.parseRange(b.during).start;
        return sa - sb;
      })
      .slice(0, 3);
  }, [reservations]);

  const statsCards = [
    {
      label: 'Próximas reservas',
      value: stats.upcomingCount,
      subtext: stats.upcomingCount === 0 ? 'Sin reservas próximas' : 'Confirmadas o pendientes',
      icon: <Calendar size={16} />,
    },
    {
      label: 'Visitas totales',
      value: stats.completedCount,
      subtext: 'Reservas completadas',
      icon: <Clock size={16} />,
    },
    {
      label: 'Negocios visitados',
      value: stats.uniqueBusinessesCount,
      subtext: 'A donde has reservado',
      icon: <Star size={16} />,
    },
    {
      label: 'Total de reservas',
      value: stats.totalCount,
      subtext: 'Desde tu registro',
      icon: <Heart size={16} />,
    },
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
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/user/dashboard' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle={`Hola, ${user?.name || 'Usuario'}`}
      headerSubtitle="Gestiona tus reservas y descubre nuevos lugares"
    >
      {loading && (
        <SectionPanel title="Cargando...">
          <p style={{ color: '#94A3B8' }}>Consultando tus reservas...</p>
        </SectionPanel>
      )}

      {error && !loading && (
        <SectionPanel title="Error">
          <p style={{ color: '#EF4444' }}>⚠️ {error}</p>
        </SectionPanel>
      )}

      {!loading && !error && (
        <>
          <StatsGrid stats={statsCards} />

          <SectionPanel title="Mis Próximas Reservas">
            {upcoming.length === 0 ? (
              <EmptyState>
                <CalendarX2 size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p>
                  No tienes reservas próximas.{' '}
                  <Link
                    to="/"
                    style={{ color: '#FF6B00', fontWeight: 700 }}
                  >
                    Explorar negocios →
                  </Link>
                </p>
              </EmptyState>
            ) : (
              <QuickList>
                {upcoming.map((r) => {
                  const { start } = reservationsService.parseRange(r.during);
                  const tz = r.business?.timezone || 'America/Mexico_City';
                  const dateStr = start
                    ? start.toLocaleString('es-MX', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: tz,
                      })
                    : '—';

                  return (
                    <li
                      key={r.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/user/reservas')}
                    >
                      <span className="time">{dateStr}</span>
                      <span className="guest">
                        {r.business?.name || 'Negocio'}
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

            {upcoming.length > 0 && (
              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'right',
                }}
              >
                <Link
                  to="/user/reservas"
                  style={{
                    color: '#FF6B00',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  Ver todas mis reservas <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </SectionPanel>
        </>
      )}
    </DashboardLayout>
  );
};