// src/features/super-admin/services/businessesService.js
import { supabase } from '../../../services/supabaseClient';

export const businessesService = {
  /**
   * Lista todos los negocios (solo super-admin puede ver todos gracias a RLS).
   * @param {Object} options - Filtros opcionales
   * @returns {Promise<Array>} Lista de negocios
   */
  async list({ search = '', typeId = null, onlyVerified = null } = {}) {
    let query = supabase
      .from('businesses')
      .select(`
        id, name, slug, type_id, city, phone, email, logo_url,
        is_active, is_verified, created_at, owner_id,
        business_types (id, label, icon)
      `)
      .order('created_at', { ascending: false });

    if (search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }
    if (typeId) {
      query = query.eq('type_id', typeId);
    }
    if (onlyVerified === true) {
      query = query.eq('is_verified', true);
    } else if (onlyVerified === false) {
      query = query.eq('is_verified', false);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Obtiene un negocio por ID con zonas y mesas.
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        business_types (id, label, icon),
        floors (
          id, name, zone_type, is_movable, is_bookable, max_capacity, sort_order,
          tables (id, name, capacity, min_capacity, max_capacity, shape, pos_x, pos_y, width, height)
        ),
        business_hours (id, day_of_week, opens_at, closes_at, is_closed, shift_name)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Crea un negocio. Solo super-admin.
   */
  async create(payload) {
    const { data, error } = await supabase
      .from('businesses')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Actualiza un negocio.
   */
  async update(id, payload) {
    const { data, error } = await supabase
      .from('businesses')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Guarda un negocio (crea o actualiza) + sus horarios.
   * @param {Object} payload - Datos del formulario
   * @param {string|null} id - ID del negocio si es edición, null si es creación
   */
  async save(payload, id = null) {
    const {
      hours = [],
      ...businessData
    } = payload;

    let business;
    if (id) {
      // UPDATE
      const { data, error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      business = data;
    } else {
      // INSERT
      const { data, error } = await supabase
        .from('businesses')
        .insert(businessData)
        .select()
        .single();
      if (error) throw new Error(error.message);
      business = data;
    }

    // Guardar horarios (si vienen)
    if (hours.length > 0) {
      // Borrar los existentes y re-insertar
      await supabase
        .from('business_hours')
        .delete()
        .eq('business_id', business.id);

      const hoursToInsert = hours.map((h) => ({
        business_id: business.id,
        day_of_week: h.day_of_week,
        opens_at: h.is_closed ? null : h.opens_at,
        closes_at: h.is_closed ? null : h.closes_at,
        is_closed: h.is_closed,
        shift_name: h.shift_name || null,
      }));

      const { error: hoursError } = await supabase
        .from('business_hours')
        .insert(hoursToInsert);

      if (hoursError) throw new Error(hoursError.message);
    }

    return business;
  },

  /**
   * Obtiene los horarios de un negocio.
   */
  async getHours(businessId) {
    const { data, error } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', businessId)
      .order('day_of_week');

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Activa/desactiva o verifica/desverifica un negocio.
   */
  async toggleField(id, field, value) {
    if (!['is_active', 'is_verified'].includes(field)) {
      throw new Error(`Campo no permitido: ${field}`);
    }
    return this.update(id, { [field]: value });
  },

  /**
   * Elimina un negocio (cascade borra zonas, mesas, reservas).
   */
  async remove(id) {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Lista de tipos de negocio (para filtros y formulario).
   */
  async listTypes() {
    const { data, error } = await supabase
      .from('business_types')
      .select('id, label, icon')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Genera un slug válido a partir de un nombre.
   */
  generateSlug(name) {
    return name
      .toLowerCase()
      .normalize('NFD')                     // Descompone acentos: "Frida" → "Fri" + combining
      .replace(/[\u0300-\u036f]/g, '')       // Quita acentos
      .replace(/[^a-z0-9\s-]/g, '')          // Quita caracteres especiales
      .trim()
      .replace(/\s+/g, '-')                  // Espacios → guiones
      .replace(/-+/g, '-');                  // Múltiples guiones → uno
  },
};