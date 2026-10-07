// src/features/client-booking/pages/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, Search, Heart, User as UserIcon, Save, Mail, Phone, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { supabase } from '../../../services/supabaseClient';
import { toast } from '../../../utils/alerts';
import {
  FormCard, AvatarSection, FieldGroup, Row, Actions, SubmitBtn, LoadingState,
} from './UserProfile.styles';

const NAV_LINKS = [
  { to: '/user/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/user/reservas', icon: <Calendar size={18} />, label: 'Mis Reservas' },
  { to: '/user/explorar', icon: <Search size={18} />, label: 'Explorar Negocios' },
  { to: '/user/favoritos', icon: <Heart size={18} />, label: 'Favoritos' },
  { to: '/user/perfil', icon: <UserIcon size={18} />, label: 'Mi Perfil' },
];

const PHONE_REGEX = /^[\d\s()+-]{8,20}$/;

const sanitizeText = (value, maxLen = 100) =>
  String(value).replace(/[<>]/g, '').slice(0, maxLen);

const sanitizePhone = (value) =>
  String(value).replace(/[^\d+\s()-]/g, '').slice(0, 20);

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '' });
  const [originalEmail, setOriginalEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!alive || !authUser) return;

        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('name, email, phone')
          .eq('id', authUser.id)
          .single();

        if (pErr) throw new Error(pErr.message);

        setForm({
          name: profile.name || '',
          phone: profile.phone || '',
        });
        setOriginalEmail(profile.email || authUser.email);
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
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    else if (form.name.trim().length < 2) errs.name = 'Muy corto';

    if (form.phone && !PHONE_REGEX.test(form.phone)) {
      errs.phone = 'Formato de teléfono inválido';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;

    setSaving(true);
    setError('');

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('No autenticado');

      const { error: upErr } = await supabase
        .from('profiles')
        .update({
          name: sanitizeText(form.name.trim(), 100),
          phone: form.phone ? sanitizePhone(form.phone) : null,
        })
        .eq('id', authUser.id);

      if (upErr) throw new Error(upErr.message);

      toast.success('Perfil actualizado');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.name || user?.email || 'U')
    .substring(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">U</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">Mi Cuenta</span>
          </div>
        </>
      }
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/user/perfil' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Mi Perfil"
      headerSubtitle="Administra tu información personal"
    >
      {loading ? (
        <LoadingState>Cargando perfil...</LoadingState>
      ) : (
        <FormCard onSubmit={handleSubmit}>
          <AvatarSection>
            <div className="avatar-big">{initials}</div>
            <div className="info">
              <h2>{form.name || 'Usuario'}</h2>
              <span className="role">
                <ShieldCheck size={12} /> Cliente
              </span>
            </div>
          </AvatarSection>

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#EF4444',
                fontSize: '0.85rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <FieldGroup>
            <label htmlFor="name">Nombre completo *</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              maxLength={100}
              autoComplete="name"
              required
            />
            {fieldErrors.name && <span className="error">{fieldErrors.name}</span>}
          </FieldGroup>

          <Row>
            <FieldGroup>
              <label htmlFor="email">
                <Mail size={12} style={{ verticalAlign: '-1px', marginRight: '0.3rem' }} />
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={originalEmail}
                disabled
                title="El correo no se puede cambiar desde aquí"
              />
              <span className="hint">El correo no se puede cambiar</span>
            </FieldGroup>

            <FieldGroup>
              <label htmlFor="phone">
                <Phone size={12} style={{ verticalAlign: '-1px', marginRight: '0.3rem' }} />
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', sanitizePhone(e.target.value))}
                placeholder="55 1234 5678"
                maxLength={20}
                autoComplete="tel"
              />
              {fieldErrors.phone && <span className="error">{fieldErrors.phone}</span>}
            </FieldGroup>
          </Row>

          <Actions>
            <SubmitBtn type="submit" disabled={saving}>
              <Save size={14} />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </SubmitBtn>
          </Actions>
        </FormCard>
      )}
    </DashboardLayout>
  );
};