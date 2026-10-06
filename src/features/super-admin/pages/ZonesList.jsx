// src/features/super-admin/pages/ZonesList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Plus, Pencil, Trash2, ArrowLeft, Grid3X3, Lock, Unlock, Calendar, Wand2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessesService } from '../services/businessesService';
import { zonesService } from '../services/zonesService';
import {
  Breadcrumb, CardsGrid, ZoneCard, Badge, SmallButton, PrimaryButton,
  Toolbar, EmptyState, LoadingState, ErrorBox,
} from './ZonesList.styles';
import { toast, confirmDialog } from '../../../utils/alerts';

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

export const ZonesList = () => {
  const { id: businessId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [biz, zonesData] = await Promise.all([
          businessesService.getById(businessId),
          zonesService.listByBusiness(businessId),
        ]);
        if (alive) {
          setBusiness(biz);
          setZones(zonesData);
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [businessId]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

const handleDelete = async (zoneId, zoneName) => {
  const confirmed = await confirmDialog({
    title: '¿Eliminar zona?',
    text: `Se eliminará "${zoneName}" y todas sus mesas.`,
    confirmText: 'Sí, eliminar',
    danger: true,
  });
  if (!confirmed) return;

  try {
    await zonesService.remove(zoneId);
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
    toast.success('Zona eliminada');
  } catch (err) {
    toast.error(err.message);
  }
};

  const getZoneTypeLabel = (type) => {
    const found = zonesService.ZONE_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Zonas del negocio"
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando zonas...</LoadingState>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/super-admin/negocios' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle={`Zonas: ${business?.name || ''}`}
      headerSubtitle="Gestiona las zonas y áreas del negocio"
    >
      <Breadcrumb>
        <Link to="/super-admin/negocios">Negocios</Link>
        <span>/</span>
        <span>{business?.name}</span>
        <span>/</span>
        <span>Zonas</span>
      </Breadcrumb>

      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      <Toolbar>
  <SmallButton onClick={() => navigate(`/super-admin/negocios/${businessId}`)}>
    <ArrowLeft size={14} /> Volver al negocio
  </SmallButton>
  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
    <SmallButton onClick={() => navigate(`/super-admin/negocios/${businessId}/editor`)}>
      <Wand2 size={14} /> Editor visual
    </SmallButton>
    <PrimaryButton onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas/nueva`)}>
      <Plus size={16} /> Nueva zona
    </PrimaryButton>
       </div>
      </Toolbar>

      {zones.length === 0 && !error && (
        <EmptyState>
          <Grid3X3 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>Este negocio aún no tiene zonas definidas.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Crea zonas como "Jardín", "Zona techada" o "Patio de juegos" para organizar las mesas.
          </p>
        </EmptyState>
      )}

      {zones.length > 0 && (
        <CardsGrid>
          {zones.map((zone) => {
            const tableCount = zone.tables?.length || 0;
            const activeTables = zone.tables?.filter((t) => t.is_active).length || 0;

            return (
              <ZoneCard key={zone.id}>
                <header>
                  <div>
                    <h3>{zone.name}</h3>
                  </div>
                  <Badge $variant={zone.is_active ? 'success' : 'danger'}>
                    {zone.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </header>

                {zone.description && (
                  <p className="description">{zone.description}</p>
                )}

                <div className="meta">
                  <Badge $variant="info">{getZoneTypeLabel(zone.zone_type)}</Badge>
                  <Badge $variant={zone.is_movable ? 'success' : 'warning'}>
                    {zone.is_movable ? <><Unlock size={10} /> Movible</> : <><Lock size={10} /> Fija</>}
                  </Badge>
                  <Badge $variant={zone.is_bookable ? 'success' : 'danger'}>
                    {zone.is_bookable ? <><Calendar size={10} /> Reservable</> : 'No reservable'}
                  </Badge>
                  {zone.max_capacity && (
                    <Badge>👥 Capacidad {zone.max_capacity}</Badge>
                  )}
                </div>

                <div className="meta">
                  <span>🪑 {activeTables} mesa{activeTables !== 1 ? 's' : ''} activa{activeTables !== 1 ? 's' : ''}</span>
                  {tableCount > activeTables && (
                    <span style={{ opacity: 0.6 }}>({tableCount - activeTables} inactiva{tableCount - activeTables !== 1 ? 's' : ''})</span>
                  )}
                </div>

                <div className="actions">
                  <SmallButton onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas/${zone.id}`)}>
                    <Pencil size={12} /> Editar
                  </SmallButton>
                  <SmallButton onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas/${zone.id}/mesas`)}>
                    <Grid3X3 size={12} /> Mesas ({activeTables})
                  </SmallButton>
                  <SmallButton $danger onClick={() => handleDelete(zone.id, zone.name)}>
                    <Trash2 size={12} /> Eliminar
                  </SmallButton>
                </div>
              </ZoneCard>
            );
          })}
        </CardsGrid>
      )}
    </DashboardLayout>
  );
};