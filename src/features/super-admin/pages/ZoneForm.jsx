// src/features/super-admin/pages/ZoneForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Save, ArrowLeft, Lock, Unlock, Calendar,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessesService } from '../services/businessesService';
import { zonesService } from '../services/zonesService';
import {
  FormCard, FieldGroup, Row, ToggleRow, ActionsRow,
  GhostButton, PrimaryButton, ErrorBox, LoadingState,
} from './BusinessForm.styles';
import { Breadcrumb } from './ZonesList.styles';
import { toast } from '../../../utils/alerts';

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

const EMPTY_FORM = {
  name: '',
  description: '',
  zone_type: 'dining',
  is_movable: true,
  is_bookable: true,
  max_capacity: '',
  sort_order: 0,
  is_active: true,
};

export const ZoneForm = () => {
  const { id: businessId, zoneId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isEdit = !!zoneId;
  const [form, setForm] = useState(EMPTY_FORM);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const biz = await businessesService.getById(businessId);
        if (alive) setBusiness(biz);

        if (isEdit) {
          const zone = await zonesService.getById(zoneId);
          if (!alive) return;
          setForm({
            name: zone.name || '',
            description: zone.description || '',
            zone_type: zone.zone_type || 'dining',
            is_movable: zone.is_movable ?? true,
            is_bookable: zone.is_bookable ?? true,
            max_capacity: zone.max_capacity ?? '',
            sort_order: zone.sort_order ?? 0,
            is_active: zone.is_active ?? true,
          });
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [businessId, zoneId, isEdit]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        max_capacity: form.max_capacity === '' ? null : parseInt(form.max_capacity, 10),
        sort_order: parseInt(form.sort_order, 10) || 0,
      };
      await zonesService.save(payload, isEdit ? zoneId : null, businessId);
      toast.success(isEdit ? 'Zona actualizada' : 'Zona creada');
      navigate(`/super-admin/negocios/${businessId}/zonas`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle={isEdit ? 'Editar zona' : 'Nueva zona'}
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando...</LoadingState>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/super-admin/negocios' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle={isEdit ? `Editar zona: ${form.name}` : 'Nueva zona'}
      headerSubtitle={`Negocio: ${business?.name || ''}`}
    >
      <Breadcrumb>
        <Link to="/super-admin/negocios">Negocios</Link>
        <span>/</span>
        <Link to={`/super-admin/negocios/${businessId}/zonas`}>{business?.name}</Link>
        <span>/</span>
        <span>{isEdit ? 'Editar zona' : 'Nueva zona'}</span>
      </Breadcrumb>

      <FormCard onSubmit={handleSubmit}>
        {error && <ErrorBox>⚠️ {error}</ErrorBox>}

        <FieldGroup>
          <label htmlFor="name">Nombre de la zona *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ej: Jardín, Zona techada, Patio de juegos"
            required
            maxLength={80}
          />
        </FieldGroup>

        <FieldGroup>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Ej: Zona de pasto al aire libre. Las mesas se pueden acomodar."
            maxLength={300}
          />
        </FieldGroup>

        <Row>
          <FieldGroup>
            <label htmlFor="zone_type">Tipo de zona</label>
            <select
              id="zone_type"
              value={form.zone_type}
              onChange={(e) => updateField('zone_type', e.target.value)}
            >
              {zonesService.ZONE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup>
            <label htmlFor="max_capacity">Capacidad máxima (opcional)</label>
            <input
              id="max_capacity"
              type="number"
              min={1}
              max={500}
              value={form.max_capacity}
              onChange={(e) => updateField('max_capacity', e.target.value)}
              placeholder="Ej: 40"
            />
            <span className="hint">Total de personas en la zona (no por mesa)</span>
          </FieldGroup>
        </Row>

        <Row>
          <FieldGroup>
            <label htmlFor="sort_order">Orden de aparición</label>
            <input
              id="sort_order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => updateField('sort_order', e.target.value)}
            />
            <span className="hint">Menor número = aparece primero</span>
          </FieldGroup>
        </Row>

        <ToggleRow>
          <span><Unlock size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} /> Las mesas se pueden mover</span>
          <input
            type="checkbox"
            checked={form.is_movable}
            onChange={(e) => updateField('is_movable', e.target.checked)}
          />
        </ToggleRow>

        <ToggleRow>
          <span><Calendar size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} /> Los clientes pueden reservar en esta zona</span>
          <input
            type="checkbox"
            checked={form.is_bookable}
            onChange={(e) => updateField('is_bookable', e.target.checked)}
          />
        </ToggleRow>

        <ToggleRow>
          <span>Zona activa</span>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => updateField('is_active', e.target.checked)}
          />
        </ToggleRow>

        <ActionsRow>
          <GhostButton
            type="button"
            onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas`)}
            disabled={saving}
          >
            <ArrowLeft size={14} /> Cancelar
          </GhostButton>
          <PrimaryButton type="submit" disabled={saving}>
            <Save size={14} />
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear zona'}
          </PrimaryButton>
        </ActionsRow>
      </FormCard>
    </DashboardLayout>
  );
};