// src/features/client-booking/services/reservationsService.js
import { supabase } from '../../../services/supabaseClient';

export const reservationsService = {
  /**
   * Crea una reserva. Si se pasan tableIds, las asigna (restaurantes).
   * Si no, solo crea la reserva (barberías, veterinarias, citas).
   */
  async create({
    businessId,
    userId = null,
    floorId = null,
    tableIds = [],
    slotStart,
    slotEnd,
    partySize,
    guestName,
    guestPhone = null,
    guestEmail = null,
    specialRequests = null,
  }) {
    // 1. Ya no bloqueamos si no hay mesas (citas no necesitan mesa)
    const during = `[${slotStart},${slotEnd})`;

    // 2. Insertar la reserva
    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .insert({
        business_id: businessId,
        user_id: userId,
        floor_id: floorId,
        during,
        party_size: partySize,
        guest_name: guestName.trim(),
        guest_phone: guestPhone?.trim() || null,
        guest_email: guestEmail?.trim() || null,
        special_requests: specialRequests?.trim() || null,
        status: 'pending',
      })
      .select()
      .single();

    if (resError) {
      throw new Error(this._translateError(resError));
    }

    // 3. Si hay mesas involucradas (restaurantes), las asignamos
    if (tableIds && tableIds.length > 0) {
      const reservationsTablesRows = tableIds.map((tableId) => ({
        reservation_id: reservation.id,
        table_id: tableId,
        during,
        active: true,
      }));

      const { error: rtError } = await supabase
        .from('reservation_tables')
        .insert(reservationsTablesRows);

      if (rtError) {
        // Rollback: borrar la reserva si falla la asignación de mesas
        await supabase.from('reservations').delete().eq('id', reservation.id);
        throw new Error(this._translateError(rtError));
      }
    }

    return reservation;
  },

  /**
   * Obtiene una reserva por su código de confirmación (para la página de éxito).
   */
  async getByConfirmationCode(code) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id, during, party_size, guest_name, guest_phone, guest_email,
        special_requests, status, confirmation_code, created_at,
        business:businesses (id, name, slug, phone, address, city, timezone, logo_url),
        floor:floors (id, name)
      `)
      .eq('confirmation_code', code)
      .single();

    if (error) throw new Error('Reserva no encontrada');
    return data;
  },

  /**
   * Traduce errores comunes de Postgres/Supabase a mensajes en español.
   */
  _translateError(err) {
    const msg = err.message || '';
    if (msg.includes('reservation_tables_no_overlap')) {
      return 'Esta mesa acaba de ser reservada por otra persona. Elige otro horario o mesa.';
    }
    if (msg.includes('duplicate key')) {
      return 'Ya existe una reserva con estos datos. Intenta de nuevo.';
    }
    if (msg.includes('permission denied')) {
      return 'No tienes permiso para crear esta reserva.';
    }
    if (msg.includes('check constraint')) {
      return 'Los datos de la reserva no son válidos. Revisa el formulario.';
    }
    return msg || 'Error al crear la reserva. Intenta de nuevo.';
  },

  /**
   * Lista las reservas del usuario logueado.
   */
  async listMyReservations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id, confirmation_code, guest_name, guest_phone, guest_email,
        party_size, during, status, special_requests, created_at,
        business:businesses (id, name, slug, phone, address, city, timezone, logo_url),
        floor:floors (id, name),
        reservation_tables (
          table_id, active,
          table:tables (id, name, capacity)
        )
      `)
      .eq('user_id', user.id)
      .order('during', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Cancela una reserva propia.
   * 1. Marca la reserva como cancelled
   * 2. Desactiva las mesas asignadas (para liberar la constraint)
   */
  async cancelMyReservation(reservationId) {
    const { error: resErr } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId);

    if (resErr) throw new Error(resErr.message);

    const { error: rtErr } = await supabase
      .from('reservation_tables')
      .update({ active: false })
      .eq('reservation_id', reservationId);

    if (rtErr) {
      console.warn('No se pudieron liberar las mesas:', rtErr);
    }

    return true;
  },

  /**
   * Parsea un tstzrange string a { start, end } como Date.
   * Ej: '[2026-10-10 17:30:00+00,2026-10-10 19:30:00+00)' → { start, end }
   */
  parseRange(range) {
    const m = String(range).match(/[[(]([^,]+),([^)\]]+)[)\]]/);
    if (!m) return { start: null, end: null };
    return { start: new Date(m[1]), end: new Date(m[2]) };
  },
};