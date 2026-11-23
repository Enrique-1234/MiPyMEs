// src/features/auth/pages/RegisterBusinessInfo.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../services/supabaseClient';
import { businessesService } from '../../super-admin/services/businessesService';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import {
  FormCard, FieldGroup, Row, ActionsRow,
  PrimaryButton, ErrorBox, LoadingState,
} from '../../super-admin/pages/BusinessForm.styles';
import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 100px 1rem 4rem;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
`;

const EMPTY = {
  name: '',
  slug: '',
  type_id: 'restaurante',
  description: '',
  address: '',
  city: 'Nicolás Romero',
  state: 'Estado de México',
  phone: '',
  email: '',
};

export const RegisterBusinessInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        // Cargar tipos
        const typesData = await businessesService.listTypes();
        if (!alive) return;
        setTypes(typesData);

        // Verificar si ya tiene negocio
        const { data: existing } = await supabase
          .from('businesses')
          .select('id, name, is_verified')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (existing) {
          if (existing.is_verified) {
            navigate('/dashboard', { replace: true });
          } else {
            setSuccess(true);
          }
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    if (user) load();
    return () => { alive = false; };
  }, [user, navigate]);

  // Auto-slug
  useEffect(() => {
    if (form.name && !form.slug) {
      setForm((prev) => ({ ...prev, slug: businessesService.generateSlug(form.name) }));
    }
  }, [form.name]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!form.name.trim()) return setError('El nombre del negocio es obligatorio');
    if (!form.slug.trim()) return setError('El slug es obligatorio');
    if (!/^[a-z0-9-]+$/.test(form.slug)) return setError('El slug solo permite minúsculas, números y guiones');

    setSaving(true);
    setError('');

    try {
      // Crear negocio con is_verified=false
      const { data: biz, error: bErr } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          name: form.name.trim(),
          slug: form.slug.trim(),
          type_id: form.type_id,
          description: form.description.trim() || null,
          address: form.address.trim() || null,
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          is_active: true,
          is_verified: false,
        })
        .select()
        .single();

      if (bErr) throw new Error(bErr.message);

      // Agregar como owner en business_staff
      const { error: sErr } = await supabase
        .from('business_staff')
        .insert({
          business_id: biz.id,
          user_id: user.id,
          role: 'owner',
          is_active: true,
        });

      if (sErr) {
        // Rollback: eliminar negocio
        await supabase.from('businesses').delete().eq('id', biz.id);
        throw new Error(sErr.message);
      }

      setSuccess(true);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('duplicate') && msg.includes('slug')) {
        setError('Ese slug ya está en uso. Prueba con otro.');
      } else {
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <PageWrapper><LoadingState>Cargando...</LoadingState></PageWrapper>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <div style={{ maxWidth: '520px', textAlign: 'center', marginTop: '2rem' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem',
              color: '#fff', boxShadow: '0 12px 30px rgba(34,197,94,0.4)',
            }}>
              <CheckCircle2 size={40} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              ¡Solicitud enviada!
            </h1>
            <p style={{ color: '#94A3B8', lineHeight: 1.6, marginBottom: '2rem' }}>
              Tu negocio está en revisión. El equipo de ReservaPro lo verificará en las próximas 24-48 hrs y te avisaremos por correo.
            </p>
           <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
  <button
    type="button"
    onClick={async () => {
      await supabase.auth.signOut();
      navigate('/', { replace: true });
    }}
    style={{
      padding: '0.85rem 1.5rem',
      borderRadius: '10px',
      border: '1.5px solid #2A2A2A',
      background: 'transparent',
      color: 'inherit',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: '0.9rem',
    }}
  >
    Cerrar sesión
  </button>
</div>
          </div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Cuéntanos de tu negocio
          </h1>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Completa la información básica. Podrás editarla después.
          </p>

          <FormCard onSubmit={handleSubmit}>
            {error && <ErrorBox>⚠️ {error}</ErrorBox>}

            <FieldGroup>
              <label>Nombre del negocio *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ej: El Jardín de Frida"
                maxLength={100}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <label>Slug (URL) *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update('slug', e.target.value.toLowerCase())}
                placeholder="el-jardin-de-frida"
                pattern="[a-z0-9\-]+"
                maxLength={80}
                required
              />
              <span className="hint">alpunto.com/negocio/{form.slug || 'slug'}</span>
            </FieldGroup>

            <FieldGroup>
              <label>Tipo de negocio *</label>
              <select value={form.type_id} onChange={(e) => update('type_id', e.target.value)} required>
                {types.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </FieldGroup>

            <FieldGroup>
              <label>Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="¿Qué hace único a tu negocio?"
                maxLength={500}
              />
            </FieldGroup>

            <Row>
              <FieldGroup>
                <label>Teléfono</label>
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} maxLength={20} />
              </FieldGroup>
              <FieldGroup>
                <label>Email de contacto</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} maxLength={120} />
              </FieldGroup>
            </Row>

            <FieldGroup>
              <label>Dirección</label>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} maxLength={200} />
            </FieldGroup>

            <Row>
              <FieldGroup>
                <label>Ciudad</label>
                <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} maxLength={80} />
              </FieldGroup>
              <FieldGroup>
                <label>Estado</label>
                <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} maxLength={80} />
              </FieldGroup>
            </Row>

            <ActionsRow>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Enviando...' : 'Enviar solicitud'}
              </PrimaryButton>
            </ActionsRow>
          </FormCard>
        </div>
      </PageWrapper>
    </>
  );
};