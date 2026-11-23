// src/features/business-admin/pages/StaffList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Info, Mail, Phone, Briefcase, DollarSign, X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { staffService } from '../services/staffService';
import { toast, confirmDialog } from '../../../utils/alerts';
import { getBusinessNavLinks } from '../utils/navLinks';
import {
  Toolbar, PrimaryButton, List, StaffCard, Avatar, InfoBlock,
  DetailsBlock, RoleSelect, ActionsCell, SmallButton, Badge,
  EmptyState, LoadingState, ErrorBox, InfoBox,
  ModalOverlay, ModalCard, FieldGroup, ModalActions, GhostButton
} from './StaffList.styles';

const ROLE_LABEL = {
  owner: 'Propietario',
  manager: 'Gerente',
  staff: 'Staff',
};

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  position: '',
  salary: '',
  role: 'staff'
};

export const StaffList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState({});
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const biz = await businessAdminService.getMyBusiness();
      setBusiness(biz);
      if (biz) {
        const data = await staffService.listByBusiness(biz.id);
        setStaff(data);
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

  const handleRoleChange = async (member, newRole) => {
    if (member.role === newRole) return;
    setBusy((prev) => ({ ...prev, [member.id]: true }));
    try {
      await staffService.updateMember(member.id, { role: newRole });
      setStaff((prev) => prev.map((s) => (s.id === member.id ? { ...s, role: newRole } : s)));
      toast.success(`Rol actualizado a ${ROLE_LABEL[newRole]}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy((prev) => { const n = { ...prev }; delete n[member.id]; return n; });
    }
  };

  const handleToggleActive = async (member) => {
    const newState = !member.is_active;
    const confirmed = await confirmDialog({
      title: newState ? '¿Reactivar empleado?' : '¿Desactivar empleado?',
      text: 'El empleado perderá o recuperará el acceso al panel.',
      confirmText: newState ? 'Sí, reactivar' : 'Sí, desactivar',
      danger: !newState,
    });
    if (!confirmed) return;

    setBusy((prev) => ({ ...prev, [member.id]: true }));
    try {
      await staffService.updateMember(member.id, { is_active: newState });
      setStaff((prev) => prev.map((s) => (s.id === member.id ? { ...s, is_active: newState } : s)));
      toast.success(newState ? 'Empleado reactivado' : 'Empleado desactivado');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy((prev) => { const n = { ...prev }; delete n[member.id]; return n; });
    }
  };

  const handleRemove = async (member) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar del equipo?',
      text: 'El empleado ya no aparecerá en la lista.',
      confirmText: 'Sí, eliminar',
      danger: true,
    });
    if (!confirmed) return;

    setBusy((prev) => ({ ...prev, [member.id]: true }));
    try {
      await staffService.remove(member.id);
      setStaff((prev) => prev.filter((s) => s.id !== member.id));
      toast.success('Miembro eliminado');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy((prev) => { const n = { ...prev }; delete n[member.id]; return n; });
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nombre y correo son obligatorios');
      return;
    }
    setSaving(true);
    try {
      const res = await staffService.addMember(business.id, form);
      await loadData(); // Recargar lista
      setModalOpen(false);
      setForm(EMPTY_FORM);
      
      if (res.isRegistered) {
        toast.success('Empleado agregado al equipo exitosamente');
      } else {
        toast.info('Invitación guardada. El empleado debe registrarse con ese correo para acceder.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Cálculos
  const myStaff = staff.find((s) => s.profile?.id === user?.id);
  const isOwner = myStaff?.role === 'owner';
  const totalPayroll = staff.reduce((sum, s) => sum + (Number(s.salary) || 0), 0);

  if (loading) return <LoadingState>Cargando equipo...</LoadingState>;

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">A</span><div><span>ReservaPro</span><span className="business-tag">{business?.name || 'Mi Negocio'}</span></div></>}
      navLinks={getBusinessNavLinks(business, '/dashboard/equipo')}
      user={user}
      onLogout={handleLogout}
      headerTitle="Personal / Atención"
      headerSubtitle={`${staff.length} empleados en el equipo`}
    >
      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      {business && (
        <>
          <InfoBox>
            <Info size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} />
            Para que un empleado acceda al sistema, debe crear una cuenta con el correo que registres aquí.
          </InfoBox>

          <Toolbar>
            <div className="spacer" />
            <PrimaryButton onClick={() => setModalOpen(true)}>
              <UserPlus size={16} />
              Agregar empleado
            </PrimaryButton>
          </Toolbar>

          <List>
            {staff.map((member) => {
              const profile = member.profile || {};
              const isMe = profile.id === user?.id;
              const isBusy = !!busy[member.id];
              const displayName = profile.name || 'Invitación Pendiente';
              const displayEmail = profile.email || member.invited_email;
              const initials = displayName.substring(0, 2).toUpperCase();

              return (
                <StaffCard key={member.id}>
                  <Avatar style={profile.avatar_url ? { backgroundImage: `url(${profile.avatar_url})`, color: 'transparent' } : {}}>
                    {!profile.avatar_url && initials}
                  </Avatar>

                  <InfoBlock>
                    <div className="name-row">
                      <span className="name">{displayName}</span>
                      {isMe && <Badge $variant="success">Tú</Badge>}
                      {!member.is_active && <Badge $variant="danger">Inactivo</Badge>}
                      {!profile.id && <Badge $variant="warning">Sin registrar</Badge>}
                    </div>
                    {member.position && <div className="position">{member.position}</div>}
                    <div className="contact">
                      {displayEmail && <span><Mail size={12} /> {displayEmail}</span>}
                      {member.phone && <span><Phone size={12} /> {member.phone}</span>}
                    </div>
                  </InfoBlock>

                  <DetailsBlock>
                    {member.salary && (
                      <div className="detail-item">
                        <DollarSign size={14} /> Salario: <strong>${Number(member.salary).toLocaleString()}</strong>
                      </div>
                    )}
                    <div className="detail-item">
                      <Briefcase size={14} /> Se unió: {new Date(member.created_at).toLocaleDateString('es-MX')}
                    </div>
                  </DetailsBlock>

                  <ActionsCell>
                    <RoleSelect
                      value={member.role}
                      onChange={(e) => handleRoleChange(member, e.target.value)}
                      disabled={isBusy || !isOwner || isMe}
                    >
                      {staffService.ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </RoleSelect>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <SmallButton
                        onClick={() => handleToggleActive(member)}
                        disabled={isBusy || !isOwner || isMe}
                      >
                        {member.is_active ? 'Desactivar' : 'Reactivar'}
                      </SmallButton>
                      {!isMe && (
                        <SmallButton $danger onClick={() => handleRemove(member)} disabled={isBusy || !isOwner}>
                          Eliminar
                        </SmallButton>
                      )}
                    </div>
                  </ActionsCell>
                </StaffCard>
              );
            })}
          </List>

          {/* Modal para agregar empleado */}
          {modalOpen && (
            <ModalOverlay onClick={() => !saving && setModalOpen(false)}>
              <ModalCard onClick={(e) => e.stopPropagation()} onSubmit={handleAddMember}>
                <h2>Agregar Empleado</h2>
                
                <FieldGroup>
                  <label>Nombre completo *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                </FieldGroup>

                <FieldGroup>
                  <label>Correo electrónico *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                </FieldGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FieldGroup>
                    <label>Teléfono</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                  </FieldGroup>
                  <FieldGroup>
                    <label>Puesto (Ej. Mesero)</label>
                    <input type="text" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} />
                  </FieldGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FieldGroup>
                    <label>Salario mensual (MXN)</label>
                    <input type="number" value={form.salary} onChange={(e) => setForm({...form, salary: e.target.value})} placeholder="0.00" />
                  </FieldGroup>
                  <FieldGroup>
                    <label>Rol de acceso</label>
                    <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                      <option value="staff">Staff</option>
                      <option value="manager">Gerente</option>
                    </select>
                  </FieldGroup>
                </div>

                <ModalActions>
                  <GhostButton type="button" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</GhostButton>
                  <PrimaryButton type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Empleado'}</PrimaryButton>
                </ModalActions>
              </ModalCard>
            </ModalOverlay>
          )}
        </>
      )}
    </DashboardLayout>
  );
};