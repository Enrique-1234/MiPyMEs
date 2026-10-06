// src/features/client-booking/services/reservationsService.js
import { supabase } from '../../../services/supabaseClient';

export const reservationsService = {
  /**
   * Crea una reserva + asigna la mesa. Rollback manual si falla el segundo paso.
   * @param {Object} params
   * @returns {Promise<Object>} La reserva creada (con confirmation_code)
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
    if (!tableIds.length) {
      throw new Error('No hay mesas disponibles para este horario');
    }

    const during = `[${slotStart},${slotEnd})`;

    // 1. Insertar la reserva
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

    // 2. Asignar la mesa (o mesas) a la reserva
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
      // Rollback manual: borrar la reserva huérfana
      await supabase.from('reservations').delete().eq('id', reservation.id);
      throw new Error(this._translateError(rtError));
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
};