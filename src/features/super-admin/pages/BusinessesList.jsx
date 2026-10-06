// src/features/super-admin/pages/BusinessesList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Plus, MapPin, Phone, CheckCircle2, XCircle, Clock, Trash2, Pencil, Grid3X3,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessesService } from '../services/businessesService';
import {
  Toolbar, SearchInput, FilterSelect, PrimaryButton,
  CardsGrid, Card, Badge, SmallButton, EmptyState, LoadingState,
} from './BusinessesList.styles';
import { toast, confirmDialog } from '../../../utils/alerts';

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

export const BusinessesList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  // Cargar tipos + negocios al montar
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [typesData, businessesData] = await Promise.all([
          businessesService.listTypes(),
          businessesService.list(),
        ]);
        if (alive) {
          setTypes(typesData);
          setBusinesses(businessesData);
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

  // Filtrar localmente (más rápido que re-consultar)
  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const matchSearch =
        !search.trim() ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.slug.toLowerCase().includes(search.toLowerCase());
      const matchType = !typeFilter || b.type_id === typeFilter;
      const matchVerified =
        verifiedFilter === '' ||
        (verifiedFilter === 'yes' && b.is_verified) ||
        (verifiedFilter === 'no' && !b.is_verified);
      return matchSearch && matchType && matchVerified;
    });
  }, [businesses, search, typeFilter, verifiedFilter]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

const handleToggleField = async (id, field, currentValue) => {
  try {
    await businessesService.toggleField(id, field, !currentValue);
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: !currentValue } : b))
    );
    if (field === 'is_verified') {
      toast.success(currentValue ? 'Negocio desverificado' : 'Negocio verificado');
    } else {
      toast.success('Estado actualizado');
    }
  } catch (err) {
    toast.error(err.message);
  }
};

const handleDelete = async (id, name) => {
  const confirmed = await confirmDialog({
    title: '¿Eliminar negocio?',
    text: `Se eliminará "${name}" y todo su contenido (zonas, mesas y reservas). Esta acción no se puede deshacer.`,
    confirmText: 'Sí, eliminar',
    danger: true,
    icon: 'warning',
  });
  if (!confirmed) return;

  try {
    await businessesService.remove(id);
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    toast.success('Negocio eliminado');
  } catch (err) {
    toast.error(err.message);
  }
};

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">SA</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">Super Admin</span>
          </div>
        </>
      }
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/super-admin/negocios' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Negocios Registrados"
      headerSubtitle="Gestiona todos los negocios de la plataforma"
    >
      <Toolbar>
        <SearchInput
          type="text"
          placeholder="Buscar por nombre o slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">Todos los tipos</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="yes">Verificados</option>
          <option value="no">Pendientes</option>
        </FilterSelect>
        <PrimaryButton onClick={() => navigate('/super-admin/negocios/nuevo')}>
          <Plus size={16} style={{ verticalAlign: '-3px', marginRight: '0.35rem' }} />
          Nuevo negocio
        </PrimaryButton>
      </Toolbar>

      {loading && <LoadingState>Cargando negocios...</LoadingState>}

      {error && !loading && (
        <EmptyState>
          <p style={{ color: '#ef4444' }}>Error: {error}</p>
        </EmptyState>
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState>
          <Building2 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>
            {businesses.length === 0
              ? 'No hay negocios registrados todavía.'
              : 'Ningún negocio coincide con los filtros.'}
          </p>
        </EmptyState>
      )}

      {!loading && !error && filtered.length > 0 && (
        <CardsGrid>
          {filtered.map((biz) => (
            <Card key={biz.id}>
              <header>
                <div>
                  <h3>{biz.name}</h3>
                  <div className="slug">/{biz.slug}</div>
                </div>
                <Badge $variant={biz.is_verified ? 'success' : 'warning'}>
                  {biz.is_verified ? (
                    <><CheckCircle2 size={12} /> Verificado</>
                  ) : (
                    <><Clock size={12} /> Pendiente</>
                  )}
                </Badge>
              </header>

              <div className="meta">
                {biz.business_types && (
                  <span>📂 {biz.business_types.label}</span>
                )}
                {biz.city && (
                  <span><MapPin size={12} style={{ verticalAlign: '-2px' }} /> {biz.city}</span>
                )}
                {biz.phone && (
                  <span><Phone size={12} style={{ verticalAlign: '-2px' }} /> {biz.phone}</span>
                )}
              </div>

              <div className="meta">
                <Badge $variant={biz.is_active ? 'success' : 'danger'}>
                  {biz.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

<div className="actions">
  <SmallButton
    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
    onClick={() => navigate(`/super-admin/negocios/${biz.id}`)}
  >
    <Pencil size={12} />
    Editar
  </SmallButton>

  <SmallButton
    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
    onClick={() => navigate(`/super-admin/negocios/${biz.id}/zonas`)}
  >
    <Grid3X3 size={12} />
    Zonas
  </SmallButton>

  <SmallButton
    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
    onClick={() => handleToggleField(biz.id, 'is_verified', biz.is_verified)}
  >
    {biz.is_verified ? (
      <>
        <XCircle size={12} />
        Desverificar
      </>
    ) : (
      <>
        <CheckCircle2 size={12} />
        Verificar
      </>
    )}
  </SmallButton>

  <SmallButton
    $danger
    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
    onClick={() => handleDelete(biz.id, biz.name)}
  >
    <Trash2 size={12} />
    Eliminar
  </SmallButton>
</div>
            </Card>
          ))}
        </CardsGrid>
      )}
    </DashboardLayout>
  );
};