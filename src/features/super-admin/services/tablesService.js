// src/features/super-admin/services/tablesService.js
import { supabase } from '../../../services/supabaseClient';

const SHAPES = [
  { value: 'rectangle', label: 'Rectangular' },
  { value: 'circle',    label: 'Circular' },
  { value: 'square',    label: 'Cuadrada' },
  { value: 'oval',      label: 'Ovalada' },
];

export const tablesService = {
  SHAPES,

  /**
   * Lista todas las mesas de una zona.
   */
  async listByFloor(floorId) {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('floor_id', floorId)
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Obtiene una mesa por ID.
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Crea una mesa.
   */
  async create(payload) {
    const { data, error } = await supabase
      .from('tables')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Actualiza una mesa.
   */
  async update(id, payload) {
    const { data, error } = await supabase
      .from('tables')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Elimina una mesa.
   */
  async remove(id) {
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Guarda (crea o actualiza) una mesa.
   */
  async save(payload, id = null, floorId = null) {
    if (id) return this.update(id, payload);
    if (!floorId) throw new Error('floorId es requerido al crear una mesa');
    return this.create({ ...payload, floor_id: floorId });
  },
};