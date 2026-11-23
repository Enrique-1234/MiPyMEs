// src/features/business-admin/pages/ServicesList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Plus, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { supabase } from '../../../services/supabaseClient';
import { toast } from '../../../utils/alerts';
import { getBusinessNavLinks } from '../utils/navLinks';
import {
  Toolbar, PrimaryButton, EmptyState, LoadingState, ErrorBox,
  ModalOverlay, ModalCard, FieldGroup, ModalActions, GhostButton,
} from './MenuList.styles';

export const ServicesList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const biz = await businessAdminService.getMyBusiness();
      setBusiness(biz);
      if (biz) {
        const { data, error: err } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', biz.id)
          .order('name');
        if (err) throw err;
        setServices(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!modal.name.trim()) return toast.error('El nombre es obligatorio');
    if (!modal.price || isNaN(modal.price)) return toast.error('Precio inválido');
    
    setSaving(true);
    try {
      const payload = {
        business_id: business.id,
        name: modal.name.trim(),
        description: modal.description?.trim() || null,
        price: parseFloat(modal.price),
        duration_minutes: parseInt(modal.duration_minutes) || 30,
      };

      if (modal.id) {
        const { error: err } = await supabase.from('services').update(payload).eq('id', modal.id);
        if (err) throw err;
        toast.success('Servicio actualizado');
      } else {
        const { error: err } = await supabase.from('services').insert(payload);
        if (err) throw err;
        toast.success('Servicio creado');
      }
      await loadData();
      setModal(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      const { error: err } = await supabase.from('services').delete().eq('id', id);
      if (err) throw err;
      toast.success('Servicio eliminado');
      await loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingState>Cargando servicios...</LoadingState>;

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">A</span><div><span>ReservaPro</span><span className="business-tag">{business?.name}</span></div></>}
      navLinks={getBusinessNavLinks(business, '/dashboard/servicios')}
      user={user}
      onLogout={handleLogout}
      headerTitle="Servicios y Precios"
      headerSubtitle="Define los servicios que ofreces a tus clientes"
    >
      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      <Toolbar>
        <div className="spacer" />
        <PrimaryButton onClick={() => setModal({ name: '', description: '', price: '', duration_minutes: 30 })}>
          <Plus size={16} /> Nuevo servicio
        </PrimaryButton>
      </Toolbar>

      {services.length === 0 ? (
        <EmptyState>
          <Scissors size={48} />
          <p>No hay servicios registrados.</p>
        </EmptyState>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {services.map(s => (
            <div key={s.id} style={{ background: '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#A1A1AA', marginBottom: '1rem' }}>{s.description || 'Sin descripción'}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#FF6B00' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><DollarSign size={14} /> ${s.price}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38BDF8' }}><Clock size={14} /> {s.duration_minutes} min</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ModalOverlay onClick={() => !saving && setModal(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h2>{modal.id ? 'Editar servicio' : 'Nuevo servicio'}</h2>
            
            <FieldGroup>
              <label>Nombre *</label>
              <input type="text" value={modal.name} onChange={(e) => setModal({...modal, name: e.target.value})} required />
            </FieldGroup>
            
            <FieldGroup>
              <label>Descripción</label>
              <textarea value={modal.description} onChange={(e) => setModal({...modal, description: e.target.value})} />
            </FieldGroup>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FieldGroup>
                <label>Precio (MXN) *</label>
                <input type="number" step="0.01" value={modal.price} onChange={(e) => setModal({...modal, price: e.target.value})} required />
              </FieldGroup>
              <FieldGroup>
                <label>Duración (min) *</label>
                <input type="number" value={modal.duration_minutes} onChange={(e) => setModal({...modal, duration_minutes: e.target.value})} required />
              </FieldGroup>
            </div>

            <ModalActions>
              <GhostButton type="button" onClick={() => setModal(null)} disabled={saving}>Cancelar</GhostButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};