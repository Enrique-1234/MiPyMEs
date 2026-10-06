// src/features/super-admin/pages/BusinessForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Save, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessesService } from '../services/businessesService';
import {
  WizardHeader, StepIndicator, FormCard, StepTitle, StepSubtitle,
  FieldGroup, Row, ToggleRow, HoursGrid, DayRow, ActionsRow,
  GhostButton, PrimaryButton, ErrorBox, LoadingState,
} from './BusinessForm.styles';
import { toast } from '../../../utils/alerts';

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const STEPS = [
  { num: 1, title: 'Datos básicos' },
  { num: 2, title: 'Contacto' },
  { num: 3, title: 'Reservas' },
  { num: 4, title: 'Horarios' },
];

// Estado inicial del formulario
const EMPTY_FORM = {
  name: '',
  slug: '',
  type_id: 'restaurante',
  description: '',
  address: '',
  city: 'Nicolás Romero',
  state: 'Estado de México',
  phone: '',
  email: '',
  whatsapp: '',
  min_party_size: 1,
  max_party_size: 20,
  reservation_duration_minutes: 120,
  advance_booking_days: 30,
  cancellation_hours: 4,
  is_active: true,
  is_verified: false,
  timezone: 'America/Mexico_City',
};

// Horarios por defecto (todos cerrados)
const DEFAULT_HOURS = DAY_NAMES.map((_, i) => ({
  day_of_week: i,
  opens_at: '11:30',
  closes_at: '21:00',
  is_closed: true,
}));

export const BusinessForm = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // undefined si es creación

  const isEdit = !!id;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Cargar tipos + (si es edición) el negocio
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const typesData = await businessesService.listTypes();
        if (alive) setTypes(typesData);

        if (isEdit) {
          const biz = await businessesService.getById(id);
          if (!alive) return;
          // Rellenar form con los datos del negocio
          setForm({
            name: biz.name || '',
            slug: biz.slug || '',
            type_id: biz.type_id || 'restaurante',
            description: biz.description || '',
            address: biz.address || '',
            city: biz.city || 'Nicolás Romero',
            state: biz.state || 'Estado de México',
            phone: biz.phone || '',
            email: biz.email || '',
            whatsapp: biz.whatsapp || '',
            min_party_size: biz.min_party_size ?? 1,
            max_party_size: biz.max_party_size ?? 20,
            reservation_duration_minutes: biz.reservation_duration_minutes ?? 120,
            advance_booking_days: biz.advance_booking_days ?? 30,
            cancellation_hours: biz.cancellation_hours ?? 4,
            is_active: biz.is_active ?? true,
            is_verified: biz.is_verified ?? false,
            timezone: biz.timezone || 'America/Mexico_City',
          });

          // Rellenar horarios
          const hoursData = await businessesService.getHours(id);
          if (alive && hoursData.length > 0) {
            const merged = DAY_NAMES.map((_, i) => {
              const found = hoursData.find((h) => h.day_of_week === i);
              return found
                ? {
                    day_of_week: i,
                    opens_at: found.opens_at?.slice(0, 5) || '11:30',
                    closes_at: found.closes_at?.slice(0, 5) || '21:00',
                    is_closed: found.is_closed,
                  }
                : { day_of_week: i, opens_at: '11:30', closes_at: '21:00', is_closed: true };
            });
            setHours(merged);
          }
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [id, isEdit]);

  // Auto-generar slug cuando cambia el nombre (solo en creación)
  useEffect(() => {
    if (!isEdit && form.name && !form.slug) {
      setForm((prev) => ({ ...prev, slug: businessesService.generateSlug(prev.name) }));
    }
  }, [form.name, isEdit]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateHour = (dayOfWeek, field, value) => {
    setHours((prev) =>
      prev.map((h) => (h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h))
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.name.trim()) return 'El nombre es obligatorio';
      if (!form.slug.trim()) return 'El slug es obligatorio';
      if (!/^[a-z0-9-]+$/.test(form.slug)) return 'El slug solo permite letras minúsculas, números y guiones';
      if (!form.type_id) return 'Selecciona un tipo de negocio';
    }
    if (s === 3) {
      if (form.min_party_size < 1) return 'El mínimo de personas debe ser al menos 1';
      if (form.max_party_size < form.min_party_size) return 'El máximo debe ser mayor o igual al mínimo';
      if (form.reservation_duration_minutes < 15) return 'La duración mínima es 15 minutos';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, 4));
  };

  const handlePrev = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar todos los pasos
  for (let s = 1; s <= 4; s++) {
    const err = validateStep(s);
    if (err) {
      setError(err);
      setStep(s);
      return;
    }
  }

  setSaving(true);
  setError('');

  try {
    const payload = { ...form, hours };
    await businessesService.save(payload, isEdit ? id : null);
    
    toast.success(isEdit ? 'Negocio actualizado' : 'Negocio creado');
    navigate('/super-admin/negocios', { replace: true });
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
        headerTitle={isEdit ? 'Editar negocio' : 'Nuevo negocio'}
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
      headerTitle={isEdit ? `Editar: ${form.name}` : 'Nuevo negocio'}
      headerSubtitle={isEdit ? 'Modifica los datos del negocio' : 'Completa los datos para registrar un negocio'}
    >
      <WizardHeader>
        {STEPS.map((s) => (
          <StepIndicator
            key={s.num}
            type="button"
            $active={step === s.num}
            $done={step > s.num}
            onClick={() => setStep(s.num)}
          >
            <span className="step-num">Paso {s.num}</span>
            <span className="step-title">
              {step > s.num ? <CheckCircle2 size={14} style={{ verticalAlign: '-2px', marginRight: '0.25rem' }} /> : null}
              {s.title}
            </span>
          </StepIndicator>
        ))}
      </WizardHeader>

      <FormCard onSubmit={handleSubmit}>
        {error && <ErrorBox>⚠️ {error}</ErrorBox>}

        {/* ============ PASO 1: Datos básicos ============ */}
        {step === 1 && (
          <>
            <div>
              <StepTitle>Datos básicos</StepTitle>
              <StepSubtitle>Información principal del negocio</StepSubtitle>
            </div>

            <FieldGroup>
              <label htmlFor="name">Nombre del negocio *</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ej: El Jardín de Frida"
                required
                maxLength={100}
              />
            </FieldGroup>

            <FieldGroup>
              <label htmlFor="slug">Slug (URL amigable) *</label>
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value.toLowerCase())}
                placeholder="el-jardin-de-frida"
                required
                pattern="[a-z0-9-]+"
                maxLength={80}
              />
              <span className="hint">Se usa en la URL: alpunto.com/negocio/{form.slug || 'slug'}</span>
            </FieldGroup>

            <FieldGroup>
              <label htmlFor="type_id">Tipo de negocio *</label>
              <select
                id="type_id"
                value={form.type_id}
                onChange={(e) => updateField('type_id', e.target.value)}
                required
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </FieldGroup>

            <FieldGroup>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe el negocio en 1-2 líneas"
                maxLength={500}
              />
            </FieldGroup>
          </>
        )}

        {/* ============ PASO 2: Contacto ============ */}
        {step === 2 && (
          <>
            <div>
              <StepTitle>Contacto y ubicación</StepTitle>
              <StepSubtitle>Cómo los clientes se comunican con el negocio</StepSubtitle>
            </div>

            <FieldGroup>
              <label htmlFor="address">Dirección</label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Calle, número, colonia"
                maxLength={200}
              />
            </FieldGroup>

            <Row>
              <FieldGroup>
                <label htmlFor="city">Ciudad</label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  maxLength={80}
                />
              </FieldGroup>
              <FieldGroup>
                <label htmlFor="state">Estado</label>
                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  maxLength={80}
                />
              </FieldGroup>
            </Row>

            <Row>
              <FieldGroup>
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="55 1234 5678"
                  maxLength={20}
                />
              </FieldGroup>
              <FieldGroup>
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  id="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  placeholder="55 1234 5678"
                  maxLength={20}
                />
              </FieldGroup>
            </Row>

            <FieldGroup>
              <label htmlFor="email">Email de contacto</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contacto@negocio.com"
                maxLength={120}
              />
            </FieldGroup>

            <FieldGroup>
              <label htmlFor="timezone">Zona horaria</label>
              <select
                id="timezone"
                value={form.timezone}
                onChange={(e) => updateField('timezone', e.target.value)}
              >
                <option value="America/Mexico_City">Centro (CDMX, EdoMex)</option>
                <option value="America/Cancun">Cancún (UTC-5)</option>
                <option value="America/Monterrey">Monterrey</option>
                <option value="America/Chihuahua">Chihuahua</option>
                <option value="America/Mazatlan">Mazatlán</option>
                <option value="America/Tijuana">Tijuana (UTC-8)</option>
              </select>
            </FieldGroup>
          </>
        )}

        {/* ============ PASO 3: Configuración de reservas ============ */}
        {step === 3 && (
          <>
            <div>
              <StepTitle>Configuración de reservas</StepTitle>
              <StepSubtitle>Reglas para las reservas de los clientes</StepSubtitle>
            </div>

            <ToggleRow>
              <span>Permitir reservas en línea</span>
              <input
                type="checkbox"
                checked={form.allows_reservations !== false}
                onChange={(e) => updateField('allows_reservations', e.target.checked)}
              />
            </ToggleRow>

            <Row>
              <FieldGroup>
                <label htmlFor="min_party_size">Mínimo de personas por reserva</label>
                <input
                  id="min_party_size"
                  type="number"
                  min={1}
                  max={50}
                  value={form.min_party_size}
                  onChange={(e) => updateField('min_party_size', parseInt(e.target.value, 10) || 1)}
                />
              </FieldGroup>
              <FieldGroup>
                <label htmlFor="max_party_size">Máximo de personas por reserva</label>
                <input
                  id="max_party_size"
                  type="number"
                  min={1}
                  max={200}
                  value={form.max_party_size}
                  onChange={(e) => updateField('max_party_size', parseInt(e.target.value, 10) || 20)}
                />
              </FieldGroup>
            </Row>

            <Row>
              <FieldGroup>
                <label htmlFor="reservation_duration_minutes">Duración de cada reserva (minutos)</label>
                <input
                  id="reservation_duration_minutes"
                  type="number"
                  min={15}
                  max={480}
                  step={15}
                  value={form.reservation_duration_minutes}
                  onChange={(e) => updateField('reservation_duration_minutes', parseInt(e.target.value, 10) || 120)}
                />
                <span className="hint">Ej: 120 = 2 horas por reserva</span>
              </FieldGroup>
              <FieldGroup>
                <label htmlFor="advance_booking_days">Días de anticipación máximos</label>
                <input
                  id="advance_booking_days"
                  type="number"
                  min={1}
                  max={365}
                  value={form.advance_booking_days}
                  onChange={(e) => updateField('advance_booking_days', parseInt(e.target.value, 10) || 30)}
                />
                <span className="hint">Cuántos días en el futuro se puede reservar</span>
              </FieldGroup>
            </Row>

            <FieldGroup>
              <label htmlFor="cancellation_hours">Horas mínimas para cancelar sin penalización</label>
              <input
                id="cancellation_hours"
                type="number"
                min={0}
                max={72}
                value={form.cancellation_hours}
                onChange={(e) => updateField('cancellation_hours', parseInt(e.target.value, 10) || 0)}
              />
            </FieldGroup>

            <ToggleRow>
              <span>Negocio activo (visible para clientes)</span>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField('is_active', e.target.checked)}
              />
            </ToggleRow>

            <ToggleRow>
              <span>Verificado por AlPunto</span>
              <input
                type="checkbox"
                checked={form.is_verified}
                onChange={(e) => updateField('is_verified', e.target.checked)}
              />
            </ToggleRow>
          </>
        )}

        {/* ============ PASO 4: Horarios ============ */}
        {step === 4 && (
          <>
            <div>
              <StepTitle>Horarios de atención</StepTitle>
              <StepSubtitle>Marca los días que el negocio está abierto</StepSubtitle>
            </div>

            <HoursGrid>
              {hours.map((h) => (
                <DayRow key={h.day_of_week}>
                  <span className="day-name">{DAY_NAMES[h.day_of_week]}</span>
                  <input
                    type="time"
                    value={h.opens_at}
                    onChange={(e) => updateHour(h.day_of_week, 'opens_at', e.target.value)}
                    disabled={h.is_closed}
                  />
                  <input
                    type="time"
                    value={h.closes_at}
                    onChange={(e) => updateHour(h.day_of_week, 'closes_at', e.target.value)}
                    disabled={h.is_closed}
                  />
                  <label className="closed-label">
                    <input
                      type="checkbox"
                      checked={h.is_closed}
                      onChange={(e) => updateHour(h.day_of_week, 'is_closed', e.target.checked)}
                    />
                    Cerrado
                  </label>
                </DayRow>
              ))}
            </HoursGrid>
          </>
        )}

        {/* ============ Acciones ============ */}
        <ActionsRow>
          <GhostButton
            type="button"
            onClick={step === 1 ? () => navigate('/super-admin/negocios') : handlePrev}
            disabled={saving}
          >
            <ArrowLeft size={14} style={{ verticalAlign: '-2px', marginRight: '0.35rem' }} />
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </GhostButton>

          {step < 4 ? (
            <PrimaryButton type="button" onClick={handleNext}>
              Siguiente →
            </PrimaryButton>
          ) : (
            <PrimaryButton type="submit" disabled={saving}>
              <Save size={14} style={{ verticalAlign: '-2px', marginRight: '0.35rem' }} />
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear negocio'}
            </PrimaryButton>
          )}
        </ActionsRow>
      </FormCard>
    </DashboardLayout>
  );
};