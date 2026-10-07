// src/features/business-admin/pages/StaffList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, Users, ShoppingBag, Grid, Settings,
  Plus, UserPlus, Info,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { staffService } from '../services/staffService';
import { toast, confirmDialog } from '../../../utils/alerts';
import {
  Toolbar, PrimaryButton, List, StaffCard, Avatar, InfoBlock,
  RoleSelect, ActionsCell, SmallButton, Badge,
  EmptyState, LoadingState, ErrorBox, InfoBox,
} from './StaffList.styles';

const NAV_LINKS = [
  { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/dashboard/reservas', icon: <Calendar size={18} />, label: 'Citas y Reservas' },
  { to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' },
  { to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' },
  { to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: 'Catálogo / Menú' },
  { to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' },
  { to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' },
];

const ROLE_LABEL = {
  owner: 'Propietario',
  manager: 'Gerente',
  staff: 'Staff',
};

export const StaffList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState({}); // { [staffId]: true }

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const biz = await businessAdminService.getMyBusiness();
        if (!alive) return;
        setBusiness(biz);

        if (biz) {
          const data = await staffService.listByBusiness(biz.id);
          if (alive) setStaff(data);
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleRoleChange = async (member, newRole) => {
    if (member.role === newRole) return;

    setBusy((prev) => ({ ...prev, [member.id]: true }));
    try {
      await staffService.updateRole(member.id, newRole);
      setStaff((prev) =>
        prev.map((s) => (s.id === member.id ? { ...s, role: newRole } : s))
      );
      toast.success(`Rol actualizado a ${ROLE_LABEL[newRole]}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy((prev) => {
        const next = { ...prev };
        delete next[member.id];
        return next;
      });
    }
  };

  const handleToggleActive = async (member) => {
    const newState = !member.is_active;
    const confirmed = await confirmDialog({
      title: newState ? '¿Reactivar empleado?' : '¿Desactivar empleado?',
      text: newState
        ? `${member.profile?.name || 'Este empleado'} recuperará el acceso al negocio.`
        : `${member.profile?.name || 'Este empleado'} perderá el acceso al negocio hasta que lo reactives.`,
      confirmText: newState ? 'Sí, reactivar' : 'Sí, desactivar',
      danger: !newState,
    });
    if (!confirmed) return;

    setBusy((prev) => ({ ...prev, [member.id]: true }));
    try {
      await staffService.toggleActive(member.id, newState);
      setStaff((prev) =>
        prev.map((s) => (s.id === member.id ? { ...s, is_active: newState } : s))
      );
      toast.success(newState ? 'Empleado reactivado' : 'Empleado desactivado');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy((prev) => {
        const next = { ...prev };
        delete next[member.id];
        return next;
      });
    }
  };

  const handleRemove = async (member) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar del equipo?',
      text: `${member.profile?.name || 'Este empleado'} ya no aparecerá en el equipo. Su cuenta seguirá existiendo.`,
      confirmText: 'Sí, eliminar',
      danger: true,
    });
    if (!confirmed) return;

    setBusy((prev) => ({ ...prev, [member.id]: true }));
    try {
      await staffService.remove(member.id);
      setStaff((prev) => prev.filter((s) => s.id !== member.id));
      toast.success('Miembro eliminado del equipo');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy((prev) => {
        const next = { ...prev };
        delete next[member.id];
        return next;
      });
    }
  };

  // Solo el owner puede gestionar roles / eliminar
  const myStaff = staff.find((s) => s.profile?.id === user?.id);
  const isOwner = myStaff?.role === 'owner';

  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Personal / Atención"
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando equipo...</LoadingState>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/equipo' }))}
        user={user}
        onLogout={handleLogout}
        headerTitle="Personal / Atención"
        headerSubtitle="Sin negocio asignado"
      >
        <EmptyState>
          <Users size={48} />
          <p>No tienes un negocio asignado. Contacta al administrador.</p>
        </EmptyState>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">{business.name}</span></div></>}
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/equipo' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Personal / Atención"
      headerSubtitle={`${staff.length} miembro${staff.length !== 1 ? 's' : ''} en el equipo`}
    >
      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      <InfoBox>
        <Info size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} />
        Para agregar nuevos empleados, contacta al administrador de AlPunto.
        Próximamente podrás enviar invitaciones desde aquí.
      </InfoBox>

      <Toolbar>
        <div className="spacer" />
        <PrimaryButton
          disabled
          title="Próximamente"
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          <UserPlus size={16} />
          Invitar empleado
        </PrimaryButton>
      </Toolbar>

      {staff.length === 0 ? (
        <EmptyState>
          <Users size={48} />
          <p>No hay miembros en el equipo todavía.</p>
        </EmptyState>
      ) : (
        <List>
          {staff.map((member) => {
            const profile = member.profile || {};
            const initials = (profile.name || profile.email || 'U')
              .substring(0, 2)
              .toUpperCase();
            const isMe = profile.id === user?.id;
            const isBusy = !!busy[member.id];

            return (
              <StaffCard key={member.id}>
                <Avatar
                  style={profile.avatar_url ? { backgroundImage: `url(${profile.avatar_url})`, color: 'transparent' } : {}}
                >
                  {!profile.avatar_url && initials}
                </Avatar>

                <InfoBlock>
                  <div className="name">
                    {profile.name || 'Sin nombre'}{' '}
                    {isMe && (
                      <Badge $variant="success" style={{ marginLeft: '0.4rem' }}>
                        Tú
                      </Badge>
                    )}
                    {!member.is_active && (
                      <Badge $variant="danger" style={{ marginLeft: '0.4rem' }}>
                        Inactivo
                      </Badge>
                    )}
                  </div>
                  <div className="email">{profile.email || '—'}</div>
                  <div className="date">
                    Se unió el{' '}
                    {new Date(member.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </InfoBlock>

                <RoleSelect
                  value={member.role}
                  onChange={(e) => handleRoleChange(member, e.target.value)}
                  disabled={isBusy || !isOwner || isMe}
                  title={
                    !isOwner
                      ? 'Solo el propietario puede cambiar roles'
                      : isMe
                        ? 'No puedes cambiar tu propio rol'
                        : ''
                  }
                >
                  {staffService.ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </RoleSelect>

                <ActionsCell>
                  <SmallButton
                    onClick={() => handleToggleActive(member)}
                    disabled={isBusy || !isOwner || isMe}
                    title={isMe ? 'No puedes desactivar tu propia cuenta' : ''}
                  >
                    {member.is_active ? 'Desactivar' : 'Reactivar'}
                  </SmallButton>

                  {!isMe && (
                    <SmallButton
                      $danger
                      onClick={() => handleRemove(member)}
                      disabled={isBusy || !isOwner}
                    >
                      Eliminar
                    </SmallButton>
                  )}
                </ActionsCell>
              </StaffCard>
            );
          })}
        </List>
      )}
    </DashboardLayout>
  );
};