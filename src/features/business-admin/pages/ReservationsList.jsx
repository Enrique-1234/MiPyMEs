// src/features/business-admin/pages/ReservationsList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, Users, ShoppingBag, Grid, Settings, Search as SearchIcon,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import {
  Toolbar, SearchInput, FilterSelect, ChipsRow, Chip, List,
  ReservationCard, DateBlock, InfoBlock, StatusBadge, StatusSelect,
  EmptyState, LoadingState, ErrorBox,
} from './ReservationsList.styles';
import { toast } from '../../../utils/alerts';

const NAV_LINKS = [
  { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/dashboard/reservas', icon: <Calendar size={18} />, label: 'Citas y Reservas' },
  { to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' },
  { to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' },
  { to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: 'Catálogo / Menú' },
  { to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' },
  { to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' },
];

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'seated',    label: 'Sentados' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'no_show',   label: 'No se presentó' },
];

const STATUS_LABELS = STATUS_OPTIONS.reduce((acc, s) => {
  acc[s.value] = s.label;
  return acc;
}, {});

export const ReservationsList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({}); // { [id]: true }

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('upcoming'); // upcoming | today | week | past | all

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
          const data = await businessAdminService.listReservations(biz.id);
          if (alive) setReservations(data);
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

  // Filtrar
  const filtered = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart); todayEnd.setDate(todayEnd.getDate() + 1);
    const weekEnd = new Date(todayStart); weekEnd.setDate(weekEnd.getDate() + 7);

    return reservations.filter((r) => {
      // Búsqueda
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matches =
          r.guest_name?.toLowerCase().includes(q) ||
          r.guest_phone?.includes(q) ||
          r.guest_email?.toLowerCase().includes(q) ||
          r.confirmation_code?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Estado
      if (statusFilter && r.status !== statusFilter) return false;

      // Fecha
      const { start } = businessAdminService.parseRange(r.during);
      if (!start) return false;

      switch (dateFilter) {
        case 'today':
          return start >= todayStart && start < todayEnd;
        case 'week':
          return start >= todayStart && start < weekEnd;
        case 'upcoming':
          return start >= todayStart;
        case 'past':
          return start < todayStart;
        default:
          return true;
      }
    });
  }, [reservations, search, statusFilter, dateFilter]);

  // Ordenar: próximas primero (ascendente), pasadas al final (descendente)
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const sa = businessAdminService.parseRange(a.during).start;
      const sb = businessAdminService.parseRange(b.during).start;
      const now = new Date();
      const aFuture = sa && sa >= now;
      const bFuture = sb && sb >= now;
      if (aFuture && bFuture) return sa - sb;
      if (!aFuture && !bFuture) return sb - sa;
      return aFuture ? -1 : 1;
    });
  }, [filtered]);

const handleStatusChange = async (reservation, newStatus) => {
  if (reservation.status === newStatus) return;
  setUpdating((prev) => ({ ...prev, [reservation.id]: true }));
  try {
    await businessAdminService.updateReservationStatus(reservation.id, newStatus);
    setReservations((prev) =>
      prev.map((r) => (r.id === reservation.id ? { ...r, status: newStatus } : r))
    );

    const labels = {
      confirmed: 'Reserva confirmada',
      cancelled: 'Reserva cancelada',
      seated: 'Cliente sentado',
      completed: 'Reserva completada',
      no_show: 'Marcada como no-show',
      pending: 'Reserva marcada como pendiente',
    };
    toast.success(labels[newStatus] || 'Estado actualizado');
  } catch (err) {
    toast.error(err.message);
  } finally {
    setUpdating((prev) => {
      const next = { ...prev };
      delete next[reservation.id];
      return next;
    });
  }
};

  const counts = useMemo(() => {
    return {
      all: reservations.length,
      pending: reservations.filter((r) => r.status === 'pending').length,
      confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    };
  }, [reservations]);

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
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/reservas' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Citas y Reservas"
      headerSubtitle={
        business
          ? `${counts.all} reservas · ${counts.pending} pendientes`
          : 'Cargando...'
      }
    >
      {loading && <LoadingState>Cargando reservas...</LoadingState>}

      {error && !loading && <ErrorBox>⚠️ {error}</ErrorBox>}

      {!loading && !error && (
        <>
          <Toolbar>
            <SearchInput
              type="text"
              placeholder="Buscar por nombre, teléfono o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="upcoming">Próximas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="past">Pasadas</option>
              <option value="all">Todas</option>
            </FilterSelect>
          </Toolbar>

          <ChipsRow>
            <Chip $active={dateFilter === 'upcoming'} onClick={() => setDateFilter('upcoming')}>
              📅 Próximas
            </Chip>
            <Chip $active={dateFilter === 'today'} onClick={() => setDateFilter('today')}>
              Hoy
            </Chip>
            <Chip $active={statusFilter === 'pending'} onClick={() => setStatusFilter(statusFilter === 'pending' ? '' : 'pending')}>
              ⏳ Pendientes ({counts.pending})
            </Chip>
            <Chip $active={statusFilter === 'confirmed'} onClick={() => setStatusFilter(statusFilter === 'confirmed' ? '' : 'confirmed')}>
              ✓ Confirmadas ({counts.confirmed})
            </Chip>
          </ChipsRow>

          {sorted.length === 0 && (
            <EmptyState>
              <SearchIcon size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>
                {reservations.length === 0
                  ? 'Aún no tienes reservas. Cuando los clientes reserven, aparecerán aquí.'
                  : 'No hay reservas que coincidan con los filtros.'}
              </p>
            </EmptyState>
          )}

          {sorted.length > 0 && (
            <List>
              {sorted.map((r) => {
                const { start } = businessAdminService.parseRange(r.during);
                const tz = business?.timezone || 'America/Mexico_City';

                const dateParts = start
                  ? {
                      day: start.toLocaleDateString('es-MX', { day: 'numeric', timeZone: tz }),
                      month: start.toLocaleDateString('es-MX', { month: 'short', timeZone: tz }),
                      time: start.toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: tz,
                      }),
                    }
                  : { day: '?', month: '?', time: '?' };

                const tableNames = (r.reservation_tables || [])
                  .filter((rt) => rt.active)
                  .map((rt) => rt.table?.name)
                  .filter(Boolean)
                  .join(', ');

                return (
                  <ReservationCard key={r.id}>
                    <DateBlock>
                      <div className="day">{dateParts.day}</div>
                      <div className="month">{dateParts.month}</div>
                      <div className="time">{dateParts.time}</div>
                    </DateBlock>

                    <InfoBlock>
                      <div className="guest">{r.guest_name}</div>
                      <div className="meta">
                        <span>👥 {r.party_size} pers.</span>
                        {r.guest_phone && <span>📞 {r.guest_phone}</span>}
                        {tableNames && <span>🪑 {tableNames}</span>}
                        {r.floor?.name && <span>📍 {r.floor.name}</span>}
                      </div>
                      <div className="code">🔑 {r.confirmation_code}</div>
                    </InfoBlock>

                    <StatusBadge $status={r.status}>
                      {STATUS_LABELS[r.status] || r.status}
                    </StatusBadge>

                    <StatusSelect
                      value={r.status}
                      onChange={(e) => handleStatusChange(r, e.target.value)}
                      disabled={!!updating[r.id]}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </StatusSelect>
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