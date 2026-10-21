// src/features/super-admin/pages/UsersList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Search, ShieldAlert, UserCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { supabase } from '../../../services/supabaseClient';
import { toast, confirmDialog } from '../../../utils/alerts';

// NavLinks estáticos para Super Admin
const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

export const UsersList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error cargando usuarios');
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.id === user.id) {
      toast.warning('No puedes cambiar tu propio rol');
      return;
    }

    const confirmed = await confirmDialog({
      title: 'Cambiar rol de usuario',
      text: `¿Estás seguro de cambiar a ${targetUser.name || targetUser.email} al rol de ${newRole}?`,
      confirmText: 'Sí, cambiar',
    });

    if (!confirmed) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUser.id);

    if (error) {
      toast.error('Error al actualizar rol: ' + error.message);
    } else {
      toast.success('Rol actualizado correctamente');
      loadUsers();
    }
  };

  const filtered = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map(l => ({ ...l, active: l.to === '/super-admin/usuarios' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Gestión de Usuarios"
      headerSubtitle={`${users.length} usuarios registrados en la plataforma`}
    >
      <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            borderRadius: '10px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Cargando usuarios...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(148, 163, 184, 0.05)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>USUARIO</th>
                <th style={{ padding: '1rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>CORREO</th>
                <th style={{ padding: '1rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>ROL</th>
                <th style={{ padding: '1rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>FECHA DE REGISTRO</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name || 'Sin nombre'} {u.id === user.id && '(Tú)'}</td>
                  <td style={{ padding: '1rem', color: '#94A3B8' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                      background: u.role === 'super-admin' ? 'rgba(239, 68, 68, 0.15)' : u.role === 'business-admin' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      color: u.role === 'super-admin' ? '#EF4444' : u.role === 'business-admin' ? '#FF6B00' : '#38BDF8'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                    {new Date(u.created_at).toLocaleDateString('es-MX')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <select
                      disabled={u.id === user.id}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      style={{
                        padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', cursor: u.id === user.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <option value="client">Cliente</option>
                      <option value="business-admin">Business Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};