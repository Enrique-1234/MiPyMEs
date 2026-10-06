// src/features/super-admin/pages/TablesList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Plus, Pencil, Trash2, ArrowLeft, Armchair,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessesService } from '../services/businessesService';
import { zonesService } from '../services/zonesService';
import { tablesService } from '../services/tablesService';
import {
  Breadcrumb, Toolbar, CanvasPreview, PreviewTable, CardsGrid,
  TableCard, Badge, SmallButton, PrimaryButton, EmptyState, LoadingState, ErrorBox,
} from './TablesList.styles';
import { toast, confirmDialog } from '../../../utils/alerts';

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

export const TablesList = () => {
  const { id: businessId, zoneId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [zone, setZone] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [biz, zoneData, tablesData] = await Promise.all([
          businessesService.getById(businessId),
          zonesService.getById(zoneId),
          tablesService.listByFloor(zoneId),
        ]);
        if (alive) {
          setBusiness(biz);
          setZone(zoneData);
          setTables(tablesData);
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [businessId, zoneId]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

const handleDelete = async (tableId, name) => {
  const confirmed = await confirmDialog({
    title: '¿Eliminar mesa?',
    text: `Se eliminará la mesa "${name}" y sus reservas activas.`,
    confirmText: 'Sí, eliminar',
    danger: true,
  });
  if (!confirmed) return;

  try {
    await tablesService.remove(tableId);
    setTables((prev) => prev.filter((t) => t.id !== tableId));
    toast.success('Mesa eliminada');
  } catch (err) {
    toast.error(err.message);
  }
};

  const getShapeLabel = (shape) => {
    const found = tablesService.SHAPES.find((s) => s.value === shape);
    return found ? found.label : shape;
  };

  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Mesas"
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando mesas...</LoadingState>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/super-admin/negocios' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle={`Mesas: ${zone?.name || ''}`}
      headerSubtitle={`${business?.name || ''} · ${tables.length} mesa${tables.length !== 1 ? 's' : ''}`}
    >
      <Breadcrumb>
        <Link to="/super-admin/negocios">Negocios</Link>
        <span>/</span>
        <Link to={`/super-admin/negocios/${businessId}/zonas`}>{business?.name}</Link>
        <span>/</span>
        <Link to={`/super-admin/negocios/${businessId}/zonas`}>{zone?.name}</Link>
        <span>/</span>
        <span>Mesas</span>
      </Breadcrumb>

      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      <Toolbar>
        <SmallButton onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas`)}>
          <ArrowLeft size={14} /> Volver a zonas
        </SmallButton>
        <PrimaryButton onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas/${zoneId}/mesas/nueva`)}>
          <Plus size={16} /> Nueva mesa
        </PrimaryButton>
      </Toolbar>

      {/* Preview visual de las mesas */}
      <CanvasPreview>
        {tables.length === 0 ? (
          <div className="empty-preview">
            <Armchair size={40} style={{ opacity: 0.3 }} />
            <span>Aún no hay mesas. Crea la primera para ver el preview.</span>
          </div>
        ) : (
          tables.map((t) => (
            <PreviewTable
              key={t.id}
              $x={t.pos_x ?? 500}
              $y={t.pos_y ?? 400}
              $w={t.width ?? 80}
              $h={t.height ?? 80}
              $shape={t.shape}
              $active={t.is_active && t.is_bookable}
              title={`${t.name} · ${t.capacity} pers.`}
              onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas/${zoneId}/mesas/${t.id}`)}
            >
              {t.name}
            </PreviewTable>
          ))
        )}
      </CanvasPreview>

      {tables.length === 0 && !error && (
        <EmptyState>
          <Armchair size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>Esta zona aún no tiene mesas.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Crea la primera mesa para empezar a recibir reservas.
          </p>
        </EmptyState>
      )}

      {tables.length > 0 && (
        <CardsGrid>
          {tables.map((table) => (
            <TableCard key={table.id}>
              <header>
                <div>
                  <h3>{table.name}</h3>
                </div>
                <Badge $variant={table.is_active ? 'success' : 'danger'}>
                  {table.is_active ? 'Activa' : 'Inactiva'}
                </Badge>
              </header>

              <div className="meta">
                <Badge $variant="info">👥 {table.capacity} pers.</Badge>
                {table.min_capacity > 1 && (
                  <Badge>Mín {table.min_capacity}</Badge>
                )}
                {table.max_capacity && (
                  <Badge>Máx {table.max_capacity}</Badge>
                )}
              </div>

              <div className="meta">
                <Badge>{getShapeLabel(table.shape)}</Badge>
                <Badge $variant={table.is_bookable ? 'success' : 'danger'}>
                  {table.is_bookable ? 'Reservable' : 'No reservable'}
                </Badge>
              </div>

              <div className="meta">
                <span>Pos: ({table.pos_x ?? 0}, {table.pos_y ?? 0})</span>
                <span>·</span>
                <span>{table.width ?? 80}×{table.height ?? 80}</span>
                {table.rotation > 0 && <span>· {table.rotation}°</span>}
              </div>

              <div className="actions">
                <SmallButton onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas/${zoneId}/mesas/${table.id}`)}>
                  <Pencil size={12} /> Editar
                </SmallButton>
                <SmallButton $danger onClick={() => handleDelete(table.id, table.name)}>
                  <Trash2 size={12} /> Eliminar
                </SmallButton>
              </div>
            </TableCard>
          ))}
        </CardsGrid>
      )}
    </DashboardLayout>
  );
};