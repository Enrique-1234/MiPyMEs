// src/features/client-booking/pages/UserReservations.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock, Calendar, Search, Heart, User as UserIcon,
  CalendarX2, Search as SearchIcon,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { reservationsService } from '../services/reservationsService';
import { toast, confirmDialog } from '../../../utils/alerts';
import {
  ChipsRow, Chip, List, ReservationCard, DateBlock, InfoBlock,
  StatusBadge, ActionsCell, SmallButton, EmptyState, LoadingState, ErrorBox,
} from './UserReservations.styles';

const NAV_LINKS = [
  { to: '/user/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/user/reservas', icon: <Calendar size={18} />, label: 'Mis Reservas' },
  { to: '/user/explorar', icon: <Search size={18} />, label: 'Explorar Negocios' },
  { to: '/user/favoritos', icon: <Heart size={18} />, label: 'Favoritos' },
  { to: '/user/perfil', icon: <UserIcon size={18} />, label: 'Mi Perfil' },
];

const STATUS_LABEL = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  seated: 'En curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asististe',
};

const MONTH_SHORT = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export const UserReservations = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming'); // upcoming | past | cancelled | all
  const [cancelling, setCancelling] = useState({});

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

  const handleCancel = async (reservation) => {
    const confirmed = await confirmDialog({
      title: '¿Cancelar reserva?',
      text: `Se cancelará tu reserva en ${reservation.business?.name}. Esta acción no se puede deshacer.`,
      confirmText: 'Sí, cancelar',
      cancelText: 'Volver',
      danger: true,
      icon: 'warning',
    });
    if (!confirmed) return;

    setCancelling((prev) => ({ ...prev, [reservation.id]: true }));
    try {
      await reservationsService.cancelMyReservation(reservation.id);
      setReservations((prev) =>
        prev.map((r) => (r.id === reservation.id ? { ...r, status: 'cancelled' } : r))
      );
      toast.success('Reserva cancelada');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling((prev) => {
        const next = { ...prev };
        delete next[reservation.id];
        return next;
      });
    }
  };

  // Filtrar
  const filtered = useMemo(() => {
    const now = new Date();
    return reservations.filter((r) => {
      const { start } = reservationsService.parseRange(r.during);
      if (!start) return false;

      switch (filter) {
        case 'upcoming':
          return start >= now && !['cancelled', 'completed', 'no_show'].includes(r.status);
        case 'past':
          return start < now || ['completed', 'no_show'].includes(r.status);
        case 'cancelled':
          return r.status === 'cancelled';
        default:
          return true;
      }
    });
  }, [reservations, filter]);

  const counts = useMemo(() => {
    const now = new Date();
    return {
      upcoming: reservations.filter((r) => {
        const { start } = reservationsService.parseRange(r.during);
        return start >= now && !['cancelled', 'completed', 'no_show'].includes(r.status);
      }).length,
      past: reservations.filter((r) => {
        const { start } = reservationsService.parseRange(r.during);
        return start < now || ['completed', 'no_show'].includes(r.status);
      }).length,
      cancelled: reservations.filter((r) => r.status === 'cancelled').length,
    };
  }, [reservations]);

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
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/user/reservas' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Mis Reservas"
      headerSubtitle={
        loading
          ? 'Cargando...'
          : `${counts.upcoming} próxima${counts.upcoming !== 1 ? 's' : ''} · ${reservations.length} en total`
      }
    >
      {loading && <LoadingState>Cargando tus reservas...</LoadingState>}

      {error && !loading && <ErrorBox>⚠️ {error}</ErrorBox>}

      {!loading && !error && (
        <>
          <ChipsRow>
            <Chip
              $active={filter === 'upcoming'}
              onClick={() => setFilter('upcoming')}
            >
              📅 Próximas ({counts.upcoming})
            </Chip>
            <Chip
              $active={filter === 'past'}
              onClick={() => setFilter('past')}
            >
              Historial ({counts.past})
            </Chip>
            <Chip
              $active={filter === 'cancelled'}
              onClick={() => setFilter('cancelled')}
            >
              Canceladas ({counts.cancelled})
            </Chip>
            <Chip
              $active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              Todas ({reservations.length})
            </Chip>
          </ChipsRow>

          {filtered.length === 0 && (
            <EmptyState>
              <CalendarX2 size={48} />
              <p>
                {reservations.length === 0
                  ? 'Aún no tienes reservas.'
                  : filter === 'upcoming'
                    ? 'No tienes reservas próximas.'
                    : filter === 'cancelled'
                      ? 'No tienes reservas canceladas.'
                      : 'No hay reservas para mostrar.'}
              </p>
              <Link to="/">Explorar negocios →</Link>
            </EmptyState>
          )}

          {filtered.length > 0 && (
            <List>
              {filtered.map((r) => {
                const { start } = reservationsService.parseRange(r.during);
                const tz = r.business?.timezone || 'America/Mexico_City';

                const dateParts = start
                  ? {
                      day: start.toLocaleDateString('es-MX', { day: 'numeric', timeZone: tz }),
                      month: MONTH_SHORT[start.getMonth()],
                      time: start.toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: tz,
                      }),
                    }
                  : { day: '?', month: '???', time: '?' };

                const tableNames = (r.reservation_tables || [])
                  .filter((rt) => rt.active)
                  .map((rt) => rt.table?.name)
                  .filter(Boolean)
                  .join(', ');

                const canCancel =
                  ['pending', 'confirmed'].includes(r.status) &&
                  start &&
                  start > new Date();

                return (
                  <ReservationCard key={r.id}>
                    <DateBlock>
                      <div className="day">{dateParts.day}</div>
                      <div className="month">{dateParts.month}</div>
                      <div className="time">{dateParts.time}</div>
                    </DateBlock>

                    <InfoBlock>
                      <div className="business-name">
                        {r.business?.name || 'Negocio'}
                      </div>
                      <div className="meta">
                        <span>👥 {r.party_size} pers.</span>
                        {r.business?.city && <span>📍 {r.business.city}</span>}
                        {tableNames && <span>🪑 {tableNames}</span>}
                        <StatusBadge $status={r.status}>
                          {STATUS_LABEL[r.status] || r.status}
                        </StatusBadge>
                      </div>
                      <div className="code">🔑 {r.confirmation_code}</div>
                    </InfoBlock>

                    <ActionsCell>
                      {r.business?.slug && (
                        <SmallButton
                          onClick={() => navigate(`/negocio/${r.business.slug}`)}
                        >
                          Ver negocio
                        </SmallButton>
                      )}
                      {canCancel && (
                        <SmallButton
                          $danger
                          onClick={() => handleCancel(r)}
                          disabled={!!cancelling[r.id]}
                        >
                          {cancelling[r.id] ? 'Cancelando...' : 'Cancelar reserva'}
                        </SmallButton>
                      )}
                    </ActionsCell>
                  </ReservationCard>
                );
              })}
            </List>
          )}
        </>
      )}
    </DashboardLayout>
  );
};