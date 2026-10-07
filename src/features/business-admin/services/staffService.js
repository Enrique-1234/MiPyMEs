// src/features/business-admin/services/staffService.js
import { supabase } from '../../../services/supabaseClient';

const ROLES = [
  { value: 'owner',   label: 'Propietario', description: 'Acceso total al negocio' },
  { value: 'manager', label: 'Gerente',     description: 'Puede gestionar reservas y equipo' },
  { value: 'staff',   label: 'Staff',       description: 'Solo lectura y gestión de reservas' },
];

export const staffService = {
  ROLES,

  /**
   * Lista el staff del negocio con sus perfiles.
   */
  async listByBusiness(businessId) {
    const { data, error } = await supabase
      .from('business_staff')
      .select(`
        id, role, is_active, created_at,
        profile:profiles (id, email, name, avatar_url, phone)
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Cambia el rol de un empleado.
   */
  async updateRole(staffId, role) {
    const VALID = ['owner', 'manager', 'staff'];
    if (!VALID.includes(role)) {
      throw new Error('Rol no válido');
    }

    const { data, error } = await supabase
      .from('business_staff')
      .update({ role })
      .eq('id', staffId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Activa/desactiva un empleado.
   */
  async toggleActive(staffId, isActive) {
    const { data, error } = await supabase
      .from('business_staff')
      .update({ is_active: isActive })
      .eq('id', staffId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Elimina a un empleado del negocio (no borra su cuenta).
   */
  async remove(staffId) {
    const { error } = await supabase
      .from('business_staff')
      .delete()
      .eq('id', staffId);

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Busca un usuario por email en la tabla profiles.
   * Se usa para invitarlo al equipo.
   */
  async findUserByEmail(email) {
    const clean = String(email).trim().toLowerCase();
    if (!clean) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, avatar_url')
      .eq('email', clean)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Agrega un usuario existente al equipo del negocio.
   */
  async addMember(businessId, userId, role = 'staff') {
    const { data, error } = await supabase
      .from('business_staff')
      .insert({
        business_id: businessId,
        user_id: userId,
        role,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.message.includes('duplicate key')) {
        throw new Error('Este usuario ya forma parte del equipo');
      }
      throw new Error(error.message);
    }
    return data;
  },
};