// src/features/business-admin/pages/BusinessSettings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Clock, ShoppingBag, Grid, Users, Settings,
  Save, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { supabase } from '../../../services/supabaseClient';
import {
  FormCard, FieldGroup, Row, ToggleRow, ActionsRow,
  PrimaryButton, ErrorBox, LoadingState,
} from '../../super-admin/pages/BusinessForm.styles';
import { SectionPanel, EmptyState } from './BusinessDashboard.styles';
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

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const BusinessSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState(null);
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const biz = await businessAdminService.getMyBusiness();
        if (!alive) return;
        if (!biz) {
          setLoading(false);
          return;
        }

        setBusiness(biz);
        setForm({
          name: biz.name || '',
          description: biz.description || '',
          address: biz.address || '',
          city: biz.city || '',
          state: biz.state || '',
          phone: biz.phone || '',
          email: biz.email || '',
          whatsapp: biz.whatsapp || '',
          min_party_size: biz.min_party_size ?? 1,
          max_party_size: biz.max_party_size ?? 20,
          reservation_duration_minutes: biz.reservation_duration_minutes ?? 120,
          advance_booking_days: biz.advance_booking_days ?? 30,
          cancellation_hours: biz.cancellation_hours ?? 4,
          allows_reservations: biz.allows_reservations ?? true,
          timezone: biz.timezone || 'America/Mexico_City',
        });

        // Cargar horarios
        const { data: hoursData, error: hoursErr } = await supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', biz.id);

        if (hoursErr) throw new Error(hoursErr.message);

        const merged = DAY_NAMES.map((_, i) => {
          const found = (hoursData || []).find((h) => h.day_of_week === i);
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

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (success) setSuccess(false);
  };

  const updateHour = (dayOfWeek, field, value) => {
    setHours((prev) =>
      prev.map((h) => (h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setSaving(true);
    setError('');
    toast.success('Cambios guardados');

    try {
      // 1. Actualizar datos del negocio
      const { error: bizErr } = await supabase
        .from('businesses')
        .update({
          name: form.name,
          description: form.description,
          address: form.address,
          city: form.city,
          state: form.state,
          phone: form.phone,
          email: form.email,
          whatsapp: form.whatsapp,
          min_party_size: parseInt(form.min_party_size, 10) || 1,
          max_party_size: parseInt(form.max_party_size, 10) || 20,
          reservation_duration_minutes: parseInt(form.reservation_duration_minutes, 10) || 120,
          advance_booking_days: parseInt(form.advance_booking_days, 10) || 30,
          cancellation_hours: parseInt(form.cancellation_hours, 10) || 0,
          allows_reservations: form.allows_reservations,
          timezone: form.timezone,
        })
        .eq('id', business.id);

      if (bizErr) throw new Error(bizErr.message);

      // 2. Borrar horarios viejos e insertar nuevos
      const { error: delErr } = await supabase
        .from('business_hours')
        .delete()
        .eq('business_id', business.id);
      if (delErr) throw new Error(delErr.message);

      const hoursToInsert = hours.map((h) => ({
        business_id: business.id,
        day_of_week: h.day_of_week,
        opens_at: h.is_closed ? null : h.opens_at,
        closes_at: h.is_closed ? null : h.closes_at,
        is_closed: h.is_closed,
        shift_name: null,
      }));

      const { error: insErr } = await supabase
        .from('business_hours')
        .insert(hoursToInsert);
      if (insErr) throw new Error(insErr.message);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Ajustes del Negocio"
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando...</LoadingState>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/configuracion' }))}
        user={user}
        onLogout={handleLogout}
        headerTitle="Ajustes del Negocio"
        headerSubtitle="Configura los datos de tu negocio"
      >
        <EmptyState>
          <AlertCircle size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No tienes un negocio asignado. Contacta al administrador de AlPunto.</p>
        </EmptyState>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">A</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">{business.name}</span>
          </div>
        </>
      }
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/configuracion' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Ajustes del Negocio"
      headerSubtitle="Configura los datos y horarios de tu negocio"
    >
      <FormCard onSubmit={handleSubmit}>
        {error && <ErrorBox>⚠️ {error}</ErrorBox>}

    
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Información del negocio
        </h3>

        <FieldGroup>
          <label htmlFor="name">Nombre del negocio *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
            maxLength={100}
          />
        </FieldGroup>

        <FieldGroup>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe tu negocio en 1-2 líneas"
            maxLength={500}
          />
        </FieldGroup>

        <Row>
          <FieldGroup>
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
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
            maxLength={120}
          />
        </FieldGroup>

        <FieldGroup>
          <label htmlFor="address">Dirección</label>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
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

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem' }}>
          Configuración de reservas
        </h3>

        <ToggleRow>
          <span>Permitir reservas en línea</span>
          <input
            type="checkbox"
            checked={form.allows_reservations}
            onChange={(e) => updateField('allows_reservations', e.target.checked)}
          />
        </ToggleRow>

        <Row>
          <FieldGroup>
            <label htmlFor="min_party_size">Mínimo de personas</label>
            <input
              id="min_party_size"
              type="number"
              min={1}
              max={50}
              value={form.min_party_size}
              onChange={(e) => updateField('min_party_size', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <label htmlFor="max_party_size">Máximo de personas</label>
            <input
              id="max_party_size"
              type="number"
              min={1}
              max={200}
              value={form.max_party_size}
              onChange={(e) => updateField('max_party_size', e.target.value)}
            />
          </FieldGroup>
        </Row>

        <Row>
          <FieldGroup>
            <label htmlFor="reservation_duration_minutes">Duración (min)</label>
            <input
              id="reservation_duration_minutes"
              type="number"
              min={15}
              max={480}
              step={15}
              value={form.reservation_duration_minutes}
              onChange={(e) => updateField('reservation_duration_minutes', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <label htmlFor="advance_booking_days">Días de anticipación</label>
            <input
              id="advance_booking_days"
              type="number"
              min={1}
              max={365}
              value={form.advance_booking_days}
              onChange={(e) => updateField('advance_booking_days', e.target.value)}
            />
          </FieldGroup>
        </Row>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem' }}>
          Horarios de atención
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {hours.map((h) => (
            <div
              key={h.day_of_week}
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 1fr 120px',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {DAY_NAMES[h.day_of_week]}
              </span>
              <input
                type="time"
                value={h.opens_at}
                onChange={(e) => updateHour(h.day_of_week, 'opens_at', e.target.value)}
                disabled={h.is_closed}
                style={{
                  padding: '0.5rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'inherit',
                }}
              />
              <input
                type="time"
                value={h.closes_at}
                onChange={(e) => updateHour(h.day_of_week, 'closes_at', e.target.value)}
                disabled={h.is_closed}
                style={{
                  padding: '0.5rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'inherit',
                }}
              />
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={h.is_closed}
                  onChange={(e) => updateHour(h.day_of_week, 'is_closed', e.target.checked)}
                />
                Cerrado
              </label>
            </div>
          ))}
        </div>

        <ActionsRow>
          <PrimaryButton type="submit" disabled={saving}>
            <Save size={14} style={{ verticalAlign: '-2px', marginRight: '0.35rem' }} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </PrimaryButton>
        </ActionsRow>
      </FormCard>
    </DashboardLayout>
  );
};