// src/features/client-booking/services/favoritesService.js
import { supabase } from '../../../services/supabaseClient';

export const favoritesService = {
  /**
   * Obtiene la lista de negocios favoritos del usuario actual.
   */
  async listMyFavorites() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        created_at,
        business:businesses (
          id, name, slug, description, city, phone, logo_url, cover_url,
          business_types (label)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    
    // Mapeamos para que sea más fácil de usar en el componente
    return (data || []).map(f => ({
      ...f.business,
      category: f.business.business_types?.label || 'General'
    }));
  },

  /**
   * Verifica si un negocio específico ya está en favoritos.
   */
  async isFavorite(businessId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('favorites')
      .select('business_id')
      .eq('user_id', user.id)
      .eq('business_id', businessId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  /**
   * Agrega o elimina un negocio de favoritos (Toggle).
   * Retorna true si se agregó, false si se eliminó.
   */
  async toggleFavorite(businessId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Debes iniciar sesión para guardar favoritos');

    const isFav = await this.isFavorite(businessId);

    if (isFav) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('business_id', businessId);
      if (error) throw new Error(error.message);
      return false; // Se eliminó
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, business_id: businessId });
      if (error) throw new Error(error.message);
      return true; // Se agregó
    }
  }
};