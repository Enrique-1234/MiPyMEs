// src/features/super-admin/pages/TableForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Save, ArrowLeft, Armchair,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessesService } from '../services/businessesService';
import { zonesService } from '../services/zonesService';
import { tablesService } from '../services/tablesService';
import {
  FormCard, FieldGroup, Row, ToggleRow, ActionsRow,
  GhostButton, PrimaryButton, ErrorBox, LoadingState,
} from './BusinessForm.styles';
import { Breadcrumb } from './TablesList.styles';
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
  capacity: 4,
  min_capacity: 1,
  max_capacity: '',
  shape: 'rectangle',
  pos_x: 500,
  pos_y: 400,
  width: 80,
  height: 80,
  rotation: 0,
  is_bookable: true,
  is_active: true,
};

export const TableForm = () => {
  const { id: businessId, zoneId, tableId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isEdit = !!tableId;
  const [form, setForm] = useState(EMPTY_FORM);
  const [business, setBusiness] = useState(null);
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [biz, zoneData] = await Promise.all([
          businessesService.getById(businessId),
          zonesService.getById(zoneId),
        ]);
        if (alive) {
          setBusiness(biz);
          setZone(zoneData);
        }

        if (isEdit) {
          const table = await tablesService.getById(tableId);
          if (!alive) return;
          setForm({
            name: table.name || '',
            capacity: table.capacity ?? 4,
            min_capacity: table.min_capacity ?? 1,
            max_capacity: table.max_capacity ?? '',
            shape: table.shape || 'rectangle',
            pos_x: table.pos_x ?? 500,
            pos_y: table.pos_y ?? 400,
            width: table.width ?? 80,
            height: table.height ?? 80,
            rotation: table.rotation ?? 0,
            is_bookable: table.is_bookable ?? true,
            is_active: table.is_active ?? true,
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
  }, [businessId, zoneId, tableId, isEdit]);

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
    if (form.capacity < 1) {
      setError('La capacidad debe ser al menos 1');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        capacity: parseInt(form.capacity, 10),
        min_capacity: parseInt(form.min_capacity, 10),
        max_capacity: form.max_capacity === '' ? null : parseInt(form.max_capacity, 10),
        pos_x: parseInt(form.pos_x, 10),
        pos_y: parseInt(form.pos_y, 10),
        width: parseInt(form.width, 10),
        height: parseInt(form.height, 10),
        rotation: parseInt(form.rotation, 10),
      };
      await tablesService.save(payload, isEdit ? tableId : null, zoneId);
toast.success(isEdit ? 'Mesa actualizada' : 'Mesa creada');
navigate(`/super-admin/negocios/${businessId}/zonas/${zoneId}/mesas`, { replace: true });
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
        headerTitle={isEdit ? 'Editar mesa' : 'Nueva mesa'}
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
      headerTitle={isEdit ? `Editar mesa: ${form.name}` : 'Nueva mesa'}
      headerSubtitle={`${business?.name || ''} · ${zone?.name || ''}`}
    >
      <Breadcrumb>
        <Link to="/super-admin/negocios">Negocios</Link>
        <span>/</span>
        <Link to={`/super-admin/negocios/${businessId}/zonas`}>{business?.name}</Link>
        <span>/</span>
        <Link to={`/super-admin/negocios/${businessId}/zonas/${zoneId}/mesas`}>{zone?.name}</Link>
        <span>/</span>
        <span>{isEdit ? 'Editar mesa' : 'Nueva mesa'}</span>
      </Breadcrumb>

      <FormCard onSubmit={handleSubmit}>
        {error && <ErrorBox>⚠️ {error}</ErrorBox>}

        <FieldGroup>
          <label htmlFor="name">Nombre de la mesa *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ej: M1, J2, P3"
            required
            maxLength={40}
          />
        </FieldGroup>

        <Row $cols={3}>
          <FieldGroup>
            <label htmlFor="capacity">Capacidad estándar *</label>
            <input
              id="capacity"
              type="number"
              min={1}
              max={50}
              value={form.capacity}
              onChange={(e) => updateField('capacity', e.target.value)}
              required
            />
            <span className="hint">Personas que caben normalmente</span>
          </FieldGroup>

          <FieldGroup>
            <label htmlFor="min_capacity">Mínimo</label>
            <input
              id="min_capacity"
              type="number"
              min={1}
              max={50}
              value={form.min_capacity}
              onChange={(e) => updateField('min_capacity', e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <label htmlFor="max_capacity">Máximo (opcional)</label>
            <input
              id="max_capacity"
              type="number"
              min={1}
              max={50}
              value={form.max_capacity}
              onChange={(e) => updateField('max_capacity', e.target.value)}
              placeholder="Auto"
            />
          </FieldGroup>
        </Row>

        <Row>
          <FieldGroup>
            <label htmlFor="shape">Forma</label>
            <select
              id="shape"
              value={form.shape}
              onChange={(e) => updateField('shape', e.target.value)}
            >
              {tablesService.SHAPES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup>
            <label htmlFor="rotation">Rotación (grados)</label>
            <input
              id="rotation"
              type="number"
              min={0}
              max={359}
              value={form.rotation}
              onChange={(e) => updateField('rotation', e.target.value)}
            />
          </FieldGroup>
        </Row>

        <Row $cols={4}>
          <FieldGroup>
            <label htmlFor="pos_x">Posición X</label>
            <input
              id="pos_x"
              type="number"
              value={form.pos_x}
              onChange={(e) => updateField('pos_x', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <label htmlFor="pos_y">Posición Y</label>
            <input
              id="pos_y"
              type="number"
              value={form.pos_y}
              onChange={(e) => updateField('pos_y', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <label htmlFor="width">Ancho (px)</label>
            <input
              id="width"
              type="number"
              min={20}
              max={400}
              value={form.width}
              onChange={(e) => updateField('width', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <label htmlFor="height">Alto (px)</label>
            <input
              id="height"
              type="number"
              min={20}
              max={400}
              value={form.height}
              onChange={(e) => updateField('height', e.target.value)}
            />
          </FieldGroup>
        </Row>

        <ToggleRow>
          <span><Armchair size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} /> Los clientes pueden reservar esta mesa</span>
          <input
            type="checkbox"
            checked={form.is_bookable}
            onChange={(e) => updateField('is_bookable', e.target.checked)}
          />
        </ToggleRow>

        <ToggleRow>
          <span>Mesa activa</span>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => updateField('is_active', e.target.checked)}
          />
        </ToggleRow>

        <ActionsRow>
          <GhostButton
            type="button"
            onClick={() => navigate(`/super-admin/negocios/${businessId}/zonas/${zoneId}/mesas`)}
            disabled={saving}
          >
            <ArrowLeft size={14} /> Cancelar
          </GhostButton>
          <PrimaryButton type="submit" disabled={saving}>
            <Save size={14} />
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear mesa'}
          </PrimaryButton>
        </ActionsRow>
      </FormCard>
    </DashboardLayout>
  );
};