// src/features/super-admin/services/zonesService.js
import { supabase } from '../../../services/supabaseClient';

const ZONE_TYPES = [
  { value: 'dining',     label: 'Comedor' },
  { value: 'garden',     label: 'Jardín' },
  { value: 'covered',    label: 'Techado' },
  { value: 'playground', label: 'Área de juegos' },
  { value: 'bar',        label: 'Barra' },
  { value: 'vip',        label: 'VIP' },
  { value: 'terrace',    label: 'Terraza' },
  { value: 'entrance',   label: 'Entrada' },
  { value: 'service',    label: 'Servicio' },
  { value: 'other',      label: 'Otro' },
];

export const zonesService = {
  ZONE_TYPES,

  /**
   * Lista todas las zonas de un negocio, con conteo de mesas.
   */
  async listByBusiness(businessId) {
    const { data, error } = await supabase
      .from('floors')
      .select(`
        id, name, description, zone_type, is_movable, is_bookable,
        max_capacity, sort_order, is_active, canvas_width, canvas_height,
        tables (id, is_active)
      `)
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Obtiene una zona por ID.
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('floors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Crea una zona.
   */
  async create(payload) {
    const { data, error } = await supabase
      .from('floors')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Actualiza una zona.
   */
  async update(id, payload) {
    const { data, error } = await supabase
      .from('floors')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Elimina una zona (cascade borra sus mesas).
   */
  async remove(id) {
    const { error } = await supabase
      .from('floors')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Guarda (crea o actualiza) una zona.
   * @param {Object} payload
   * @param {string|null} id - null para crear
   * @param {string} businessId - requerido al crear
   */
  async save(payload, id = null, businessId = null) {
    if (id) {
      return this.update(id, payload);
    }
    if (!businessId) throw new Error('businessId es requerido al crear una zona');
    return this.create({ ...payload, business_id: businessId });
  },
};