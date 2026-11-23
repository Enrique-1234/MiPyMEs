// src/features/business-admin/services/menuService.js
import { supabase } from '../../../services/supabaseClient';

export const menuService = {
  /**
   * Lista las categorías del menú con sus items.
   */
  async listByBusiness(businessId) {
    const { data, error } = await supabase
      .from('menu_categories')
      .select(`
        id, name, description, sort_order, is_active,
        menu_items (
          id, name, description, price, image_url,
          is_available, is_featured, allergens, sort_order
        )
      `)
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createCategory(businessId, payload) {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({ ...payload, business_id: businessId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateCategory(id, payload) {
    const { data, error } = await supabase
      .from('menu_categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  async createItem(categoryId, payload) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({ ...payload, category_id: categoryId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateItem(id, payload) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteItem(id) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  async toggleItemAvailability(id, isAvailable) {
    return this.updateItem(id, { is_available: isAvailable });
  },
};