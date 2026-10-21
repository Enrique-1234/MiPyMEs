// src/features/super-admin/pages/GlobalSettings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Save, Globe, Mail, Phone, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { supabase } from '../../../services/supabaseClient';
import { toast } from '../../../utils/alerts';

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

export const GlobalSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', maintenance: false
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('platform_settings').select('*').eq('key', 'site').single();
      if (data && data.value) {
        setForm(data.value);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('platform_settings')
      .update({ value: form, updated_at: new Date() })
      .eq('key', 'site');

    if (error) {
      toast.error('Error al guardar configuración');
    } else {
      toast.success('Configuración global guardada');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Cargando...</div>;

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map(l => ({ ...l, active: l.to === '/super-admin/configuracion' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Configuración Global"
      headerSubtitle="Administra los ajustes generales de la plataforma"
    >
      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Nombre de la plataforma</label>
          <div style={{ position: 'relative' }}>
            <Globe size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Correo de soporte</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Teléfono de contacto</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="tel" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} 
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FACC15' }}><AlertTriangle size={16}/> Modo Mantenimiento</strong>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.25rem' }}>Desactiva temporalmente el acceso público a la plataforma.</p>
          </div>
          <input 
            type="checkbox" 
            checked={form.maintenance} 
            onChange={e => setForm({...form, maintenance: e.target.checked})} 
            style={{ width: '20px', height: '20px', accentColor: '#FF6B00', cursor: 'pointer' }}
          />
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} style={{ padding: '0.85rem 1.5rem', borderRadius: '10px', background: '#FF6B00', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};