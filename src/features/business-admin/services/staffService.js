// src/features/business-admin/services/staffService.js
import { supabase } from '../../../services/supabaseClient';

const ROLES = [
  { value: 'owner',   label: 'Propietario', description: 'Acceso total al negocio' },
  { value: 'manager', label: 'Gerente',     description: 'Puede gestionar reservas y equipo' },
  { value: 'staff',   label: 'Staff',       description: 'Solo lectura y gestión de reservas' },
];

export const staffService = {
  ROLES,

  async listByBusiness(businessId) {
    const { data, error } = await supabase
      .from('business_staff')
      .select(`
        id, role, is_active, created_at, position, salary, phone, invited_email,
        profile:profiles (id, email, name, avatar_url, phone)
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateMember(staffId, payload) {
    const { data, error } = await supabase
      .from('business_staff')
      .update(payload)
      .eq('id', staffId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async remove(staffId) {
    const { error } = await supabase
      .from('business_staff')
      .delete()
      .eq('id', staffId);

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Agrega o invita a un empleado.
   */
  async addMember(businessId, payload) {
    const email = payload.email.trim().toLowerCase();

    // 1. Buscar si el usuario ya existe en los perfiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('email', email)
      .maybeSingle();

    const isRegistered = !!existingProfile;

    // 2. Insertar en business_staff
    const { data, error } = await supabase
      .from('business_staff')
      .insert({
        business_id: businessId,
        user_id: existingProfile?.id || null,
        invited_email: isRegistered ? null : email,
        role: payload.role || 'staff',
        position: payload.position || null,
        salary: payload.salary ? parseFloat(payload.salary) : null,
        phone: payload.phone || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // unique violation
        throw new Error('Este usuario ya forma parte del equipo.');
      }
      throw new Error(error.message);
    }

    return { ...data, isRegistered };
  }
};