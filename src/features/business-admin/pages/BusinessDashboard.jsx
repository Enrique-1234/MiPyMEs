
 // src/features/business-admin/pages/BusinessDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Calendar, Users, ShoppingBag, Grid, Settings, AlertCircle, ArrowRight, Scissors,} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { getFeaturesForBusiness, BUSINESS_FEATURES,} from '../../../config/businessConfig';

import { StatsGrid, StatCard, SectionPanel, QuickList, EmptyState, EmptyBusiness,} from './BusinessDashboard.styles';

import { WeeklyChart } from '../../../components/common/WeeklyChart/WeeklyChart';

// Iconos para cada funcionalidad del negocio.
const FEATURE_ICONS = {
  dashboard: <Clock size={18} />,
  reservations: <Calendar size={18} />,
  appointments: <Calendar size={18} />,
  calendar: <Clock size={18} />,
  tables: <Grid size={18} />,
  menu: <ShoppingBag size={18} />,
  services: <Scissors size={18} />,
  staff: <Users size={18} />,
  settings: <Settings size={18} />,
};

// Etiquetas que aparecen en el sidebar.
const FEATURE_LABELS = {
  dashboard: 'Inicio',
  reservations: 'Citas y Reservas',
  appointments: 'Agenda de Citas',
  calendar: 'Calendario',
  tables: 'Mapa de Mesas',
  menu: 'Catálogo / Menú',
  services: 'Servicios y Precios',
  staff: 'Personal / Atención',
  settings: 'Ajustes del Negocio',
};

// Rutas de cada funcionalidad.
const FEATURE_PATHS = {
  dashboard: '/dashboard',
  reservations: '/dashboard/reservas',
  appointments: '/dashboard/reservas',
  calendar: '/dashboard/calendario',
  tables: '/dashboard/mesas',
  menu: '/dashboard/catalogo',
  services: '/dashboard/servicios',
  staff: '/dashboard/equipo',
  settings: '/dashboard/configuracion',
};

// Menú limitado para negocios pendientes de verificación.
const PENDING_NAV_LINKS = [
  {
    to: '/dashboard',
    icon: <Clock size={18} />,
    label: 'Inicio',
    active: true,
  },
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

        // Las estadísticas y reservas solo se cargan
        // cuando el negocio está verificado.
        if (biz && biz.is_verified === true) {
          const [statsData, reservationsData] = await Promise.all([
            businessAdminService.getStats(biz.id),
            businessAdminService.listReservations(biz.id, {
              limit: 50,
            }),
          ]);

          if (!alive) return;

          setStats(statsData);
          setAllReservations(reservationsData);

          // Obtener reservas futuras o de hoy.
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          const upcomingList = reservationsData
            .filter((reservation) => {
              const { start } = businessAdminService.parseRange(
                reservation.during
              );

              return (
                start &&
                start >= now &&
                ![
                  'cancelled',
                  'completed',
                  'no_show',
                ].includes(reservation.status)
              );
            })
            .sort((a, b) => {
              const startA = businessAdminService.parseRange(
                a.during
              ).start;

              const startB = businessAdminService.parseRange(
                b.during
              ).start;

              return startA - startB;
            })
            .slice(0, 5);

          setUpcoming(upcomingList);
        }
      } catch (err) {
        if (alive) {
          setError(
            err.message ||
              'Ocurrió un error al cargar el dashboard.'
          );
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Genera el sidebar según el tipo de negocio.
  const getNavLinks = () => {
    if (!business) return [];

    // No mostrar el menú completo antes de la verificación.
    if (business.is_verified !== true) {
      return PENDING_NAV_LINKS;
    }

    const activeFeatures = getFeaturesForBusiness(
      business.type_id
    );

    return activeFeatures
      .filter((feature) => FEATURE_PATHS[feature])
      .map((feature) => ({
        to: FEATURE_PATHS[feature],
        icon: FEATURE_ICONS[feature] || <Settings size={18} />,
        label: FEATURE_LABELS[feature] || feature,
        active: feature === 'dashboard',
      }));
  };

  const businessTypeLabel =
    BUSINESS_FEATURES[business?.type_id]?.label || 'Negocio';

  const headerTitle = business
    ? `Gestión de ${business.name}`
    : 'Mi Negocio';

  const headerSubtitle =
    business && business.is_verified !== true
      ? 'Verificación de tu negocio'
      : `Panel de ${businessTypeLabel}`;

  const renderContent = () => {
    if (loading) {
      return <EmptyState>Cargando dashboard...</EmptyState>;
    }

    if (error) {
      return (
        <SectionPanel title="Error">
          <p style={{ color: '#ef4444' }}>
            ⚠️ {error}
          </p>
        </SectionPanel>
      );
    }

    if (!business) {
      return (
        <EmptyBusiness>
          <AlertCircle
            size={40}
            style={{
              opacity: 0.3,
              marginBottom: '1rem',
            }}
          />

          <h2>Aún no tienes un negocio asignado</h2>

          <p>
            Contacta al administrador de ReservaPro para que te
            asigne un negocio. Una vez asignado, aquí verás
            tus reservas y estadísticas.
          </p>
        </EmptyBusiness>
      );
    }

    return (
      <>
        {/* Estadísticas */}
        <StatsGrid>
          <StatCard $highlight={stats?.pendingCount > 0}>
            <div className="stat-header">
              <span>Reservas hoy</span>
              <Calendar size={16} />
            </div>

            <div className="stat-value">
              {stats?.todayTotal ?? 0}
            </div>

            <div className="stat-subtext">
              {stats?.todayGuests ?? 0} personas esperadas
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <span>Esta semana</span>
              <Clock size={16} />
            </div>

            <div className="stat-value">
              {stats?.weekTotal ?? 0}
            </div>

            <div className="stat-subtext">
              {stats?.weekGuests ?? 0} personas en total
            </div>
          </StatCard>

          <StatCard $highlight={stats?.pendingCount > 0}>
            <div className="stat-header">
              <span>Pendientes</span>
              <AlertCircle size={16} />
            </div>

            <div className="stat-value">
              {stats?.pendingCount ?? 0}
            </div>

            <div className="stat-subtext">
              {stats?.pendingCount > 0
                ? 'Requieren confirmación'
                : 'Todo al día ✓'}
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
              No hay reservas próximas. Cuando los clientes
              reserven, aparecerán aquí.
            </EmptyState>
          ) : (
            <QuickList>
              {upcoming.map((reservation) => {
                const { start } =
                  businessAdminService.parseRange(
                    reservation.during
                  );

                const timeStr = start
                  ? start.toLocaleString('es-MX', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      timeZone:
                        business.timezone ||
                        'America/Mexico_City',
                    })
                  : '—';

                return (
                  <li key={reservation.id}>
                    <span className="time">{timeStr}</span>

                    <span className="guest">
                      {reservation.guest_name}

                      {reservation.status === 'pending' && (
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

                    <span className="party">
                      👥 {reservation.party_size}
                    </span>
                  </li>
                );
              })}
            </QuickList>
          )}
        </SectionPanel>

        {/* Actividad de la semana */}
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

  // Pantalla para negocios que siguen pendientes de verificación.
  if (
    !loading &&
    !error &&
    business &&
    business.is_verified !== true
  ) {
    return (
      <DashboardLayout
        sidebarLogo={
          <>
            <span className="badge-icon">A</span>

            <div>
              <span>ReservaPro</span>
              <span className="business-tag">
                {business.name}
              </span>
            </div>
          </>
        }
        navLinks={PENDING_NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Solicitud en revisión"
        headerSubtitle="Verificación de tu negocio"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2.5rem 2rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 35px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: '#fff7ed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Clock size={40} color="#F97316" />
            </div>

            <span
              style={{
                display: 'inline-block',
                padding: '0.45rem 0.9rem',
                marginBottom: '1rem',
                borderRadius: '999px',
                background: '#fff7ed',
                color: '#c2410c',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              PENDIENTE DE VERIFICACIÓN
            </span>

            <h2
              style={{
                margin: '0 0 1rem',
                color: '#111827',
                fontSize: '1.8rem',
                lineHeight: 1.3,
              }}
            >
              Tu negocio está en revisión
            </h2>

            <p
              style={{
                margin: '0 0 1rem',
                color: '#6b7280',
                fontSize: '1rem',
                lineHeight: 1.7,
              }}
            >
              Hemos recibido la información de tu negocio.
              El equipo de ReservaPro revisará los datos para
              comprobar que todo esté correcto.
            </p>

            <p
              style={{
                margin: '0 0 2rem',
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: 1.7,
              }}
            >
              Mientras se completa la revisión, puedes
              consultar y actualizar la información de tu
              negocio desde la configuración. Te notificaremos
              cuando haya una actualización sobre tu solicitud.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/configuracion')
              }
              style={{
                width: '100%',
                padding: '0.95rem 1.25rem',
                border: 'none',
                borderRadius: '12px',
                background: '#FF6B00',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              Revisar información del negocio
            </button>

            <p
              style={{
                margin: '1.5rem 0 0',
                color: '#9ca3af',
                fontSize: '0.8rem',
              }}
            >
              ReservaPro · Verificación de negocios
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Dashboard principal.
  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">A</span>

          <div>
            <span>ReservaPro</span>
            <span className="business-tag">
              {business?.name || 'Mi Negocio'}
            </span>
          </div>
        </>
      }
      navLinks={getNavLinks()}
      user={user}
      onLogout={handleLogout}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      {renderContent()}
    </DashboardLayout>
  );
};