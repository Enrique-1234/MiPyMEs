// src/features/business-admin/services/businessAdminService.js
import { supabase } from '../../../services/supabaseClient';

export const businessAdminService = {
  /**
   * Obtiene el negocio del business-admin actual.
   * Primero busca como owner_id, luego como staff activo.
   */
  async getMyBusiness() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // 1. Buscar como owner
    const { data: owned } = await supabase
      .from('businesses')
      .select(`*, business_types (id, label, icon)`)
      .eq('owner_id', user.id)
      .maybeSingle();

    if (owned) return owned;

    // 2. Buscar como staff
    const { data: staff } = await supabase
      .from('business_staff')
      .select(`role, business:businesses (*, business_types (id, label, icon))`)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    return staff?.business || null;
  },

  /**
   * Lista las reservas del negocio con mesas asignadas.
   */
  async listReservations(businessId, { limit = 200 } = {}) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id, confirmation_code, guest_name, guest_phone, guest_email,
        party_size, during, status, special_requests, created_at, user_id,
        floor:floors (id, name),
        reservation_tables (
          table_id, active,
          table:tables (id, name, capacity)
        )
      `)
      .eq('business_id', businessId)
      .order('during', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Calcula estadísticas rápidas del negocio.
   */
  async getStats(businessId) {
    const { data, error } = await supabase
      .from('reservations')
      .select('id, status, party_size, during')
      .eq('business_id', businessId);

    if (error) throw new Error(error.message);

    const all = data || [];
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart); todayEnd.setDate(todayEnd.getDate() + 1);
    const weekEnd = new Date(todayStart); weekEnd.setDate(weekEnd.getDate() + 7);

    const parseStart = (range) => {
      const m = String(range).match(/[[(]([^,]+),/);
      return m ? new Date(m[1]) : null;
    };

    const today = all.filter((r) => {
      const s = parseStart(r.during);
      return s && s >= todayStart && s < todayEnd;
    });

    const week = all.filter((r) => {
      const s = parseStart(r.during);
      return s && s >= todayStart && s < weekEnd;
    });

    const pending = all.filter((r) => {
      const s = parseStart(r.during);
      return r.status === 'pending' && s && s >= todayStart;
    });

    return {
      todayTotal: today.length,
      todayGuests: today.reduce((sum, r) => sum + (r.party_size || 0), 0),
      weekTotal: week.length,
      weekGuests: week.reduce((sum, r) => sum + (r.party_size || 0), 0),
      pendingCount: pending.length,
    };
  },

  /**
   * Cambia el estado de una reserva.
   * Estados válidos: pending, confirmed, seated, completed, cancelled, no_show
   */
  async updateReservationStatus(reservationId, newStatus) {
    const VALID = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'];
    if (!VALID.includes(newStatus)) {
      throw new Error(`Estado no válido: ${newStatus}`);
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', reservationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Utilidad: parsea un tstzrange string a { start, end } como Date.
   */
  parseRange(range) {
    const m = String(range).match(/[[(]([^,]+),([^)\]]+)[)\]]/);
    if (!m) return { start: null, end: null };
    return { start: new Date(m[1]), end: new Date(m[2]) };
  },
};