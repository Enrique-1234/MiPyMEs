// src/features/business-admin/pages/ReservationsCalendar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, Users, ShoppingBag, Grid, Settings,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import {
  Header, NavButton, WeekGrid, DayColumn, DayHeader, DayBody,
  EmptyDay, ReservationChip, LoadingState, ErrorBox,
  ModalOverlay, ModalCard, DetailRow, ModalActions,
} from './ReservationsCalendar.styles';

const NAV_LINKS = [
  { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/dashboard/reservas', icon: <Calendar size={18} />, label: 'Citas y Reservas' },
  { to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' },
  { to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' },
  { to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: 'Catálogo / Menú' },
  { to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' },
  { to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' },
];

const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const STATUS_LABEL = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  seated: 'Sentados',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No se presentó',
};

// Devuelve el lunes (inicio de semana) de una fecha
const startOfWeek = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0=dom
  // Queremos semana iniciando en lunes
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
};

// Devuelve la clave 'YYYY-MM-DD' de una fecha (en timezone local)
const dateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const ReservationsCalendar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedReservation, setSelectedReservation] = useState(null);

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

  // Los 7 días de la semana actual
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      result.push(d);
    }
    return result;
  }, [weekStart]);

  // Agrupa reservas por día (YYYY-MM-DD) usando la TZ del negocio
  const byDay = useMemo(() => {
    const tz = business?.timezone || 'America/Mexico_City';
    const map = {};

    for (const r of reservations) {
      const { start } = businessAdminService.parseRange(r.during);
      if (!start) continue;

      // 'YYYY-MM-DD' en TZ del negocio
      const key = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(start);

      if (!map[key]) map[key] = [];
      map[key].push(r);
    }

    // Ordenar cada día por hora ascendente
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => {
        const sa = businessAdminService.parseRange(a.during).start;
        const sb = businessAdminService.parseRange(b.during).start;
        return sa - sb;
      });
    }

    return map;
  }, [reservations, business]);

  const weekRangeLabel = useMemo(() => {
    const start = days[0];
    const end = days[6];
    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();

    if (sameMonth && sameYear) {
      return `${start.getDate()} – ${end.getDate()} de ${MONTH_SHORT[start.getMonth()]} ${start.getFullYear()}`;
    }
    if (sameYear) {
      return `${start.getDate()} ${MONTH_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`;
    }
    return `${start.getDate()} ${MONTH_SHORT[start.getMonth()]} ${start.getFullYear()} – ${end.getDate()} ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`;
  }, [days]);

  const weekTotalReservations = useMemo(() => {
    return days.reduce((sum, d) => sum + (byDay[dateKey(d)]?.length || 0), 0);
  }, [days, byDay]);

  const weekTotalGuests = useMemo(() => {
    return days.reduce(
      (sum, d) => sum + (byDay[dateKey(d)]?.reduce((s, r) => s + (r.party_size || 0), 0) || 0),
      0
    );
  }, [days, byDay]);

  const goPrevWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const goNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const goToday = () => setWeekStart(startOfWeek(new Date()));

  const todayKey = dateKey(new Date());

  const formatTime = (range) => {
    const { start, end } = businessAdminService.parseRange(range);
    if (!start) return '—';
    const tz = business?.timezone || 'America/Mexico_City';
    const fmt = (d) =>
      d.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
      });
    return `${fmt(start)} – ${fmt(end)}`;
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
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/calendario' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Agenda Semanal"
      headerSubtitle={
        business
          ? `${weekTotalReservations} reservas · ${weekTotalGuests} personas esta semana`
          : 'Cargando...'
      }
    >
      {loading && <LoadingState>Cargando agenda...</LoadingState>}
      {error && !loading && <ErrorBox>⚠️ {error}</ErrorBox>}

      {!loading && !error && (
        <>
          <Header>
            <div className="week-range">
              <h2>{weekRangeLabel}</h2>
              <p>
                {weekTotalReservations === 0
                  ? 'Sin reservas esta semana'
                  : `${weekTotalReservations} reserva${weekTotalReservations !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="nav-buttons">
              <NavButton onClick={goPrevWeek} aria-label="Semana anterior">
                <ChevronLeft size={16} />
              </NavButton>
              <NavButton $primary onClick={goToday}>Hoy</NavButton>
              <NavButton onClick={goNextWeek} aria-label="Semana siguiente">
                <ChevronRight size={16} />
              </NavButton>
            </div>
          </Header>

          <WeekGrid>
            {days.map((day) => {
              const key = dateKey(day);
              const dayReservations = byDay[key] || [];
              const isToday = key === todayKey;
              const totalGuests = dayReservations.reduce(
                (sum, r) => sum + (r.party_size || 0),
                0
              );

              return (
                <DayColumn key={key} $today={isToday}>
                  <DayHeader $today={isToday}>
                    <div className="day-name">{DAY_SHORT[day.getDay()]}</div>
                    <div className="day-num">{day.getDate()}</div>
                    <div className="day-stats">
                      {dayReservations.length === 0
                        ? '—'
                        : `${dayReservations.length} · ${totalGuests} 👥`}
                    </div>
                  </DayHeader>

                  <DayBody>
                    {dayReservations.length === 0 ? (
                      <EmptyDay>Sin reservas</EmptyDay>
                    ) : (
                      dayReservations.map((r) => {
                        const { start } = businessAdminService.parseRange(r.during);
                        const tz = business?.timezone || 'America/Mexico_City';
                        const time = start
                          ? start.toLocaleTimeString('es-MX', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: tz,
                            })
                          : '—';

                        return (
                          <ReservationChip
                            key={r.id}
                            $status={r.status}
                            onClick={() => setSelectedReservation(r)}
                          >
                            <div className="time">{time}</div>
                            <div className="name">{r.guest_name}</div>
                            <div className="party">👥 {r.party_size} pers.</div>
                          </ReservationChip>
                        );
                      })
                    )}
                  </DayBody>
                </DayColumn>
              );
            })}
          </WeekGrid>
        </>
      )}

      {/* Modal de detalle */}
      {selectedReservation && (
        <ModalOverlay onClick={() => setSelectedReservation(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <h2>{selectedReservation.guest_name}</h2>
                <div className="code">🔑 {selectedReservation.confirmation_code}</div>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <DetailRow>
              <span className="label">📅 Fecha y hora</span>
              <span className="value">
                {(() => {
                  const { start } = businessAdminService.parseRange(selectedReservation.during);
                  if (!start) return '—';
                  const tz = business?.timezone || 'America/Mexico_City';
                  return start.toLocaleString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: tz,
                  });
                })()}
              </span>
            </DetailRow>

            <DetailRow>
              <span className="label">⏱️ Duración</span>
              <span className="value">{formatTime(selectedReservation.during)}</span>
            </DetailRow>

            <DetailRow>
              <span className="label">👥 Personas</span>
              <span className="value">{selectedReservation.party_size}</span>
            </DetailRow>

            <DetailRow>
              <span className="label">📞 Teléfono</span>
              <span className="value">{selectedReservation.guest_phone || '—'}</span>
            </DetailRow>

            <DetailRow>
              <span className="label">✉️ Email</span>
              <span className="value">{selectedReservation.guest_email || '—'}</span>
            </DetailRow>

            {selectedReservation.reservation_tables?.length > 0 && (
              <DetailRow>
                <span className="label">🪑 Mesas</span>
                <span className="value">
                  {selectedReservation.reservation_tables
                    .filter((rt) => rt.active)
                    .map((rt) => rt.table?.name)
                    .filter(Boolean)
                    .join(', ') || '—'}
                </span>
              </DetailRow>
            )}

            <DetailRow>
              <span className="label">📊 Estado</span>
              <span className="value">
                {STATUS_LABEL[selectedReservation.status] || selectedReservation.status}
              </span>
            </DetailRow>

            {selectedReservation.special_requests && (
              <DetailRow>
                <span className="label">💬 Notas</span>
                <span className="value">{selectedReservation.special_requests}</span>
              </DetailRow>
            )}

            <ModalActions>
              <NavButton onClick={() => setSelectedReservation(null)}>
                Cerrar
              </NavButton>
              <NavButton
                $primary
                onClick={() => {
                  setSelectedReservation(null);
                  navigate('/dashboard/reservas');
                }}
              >
                Gestionar
              </NavButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};