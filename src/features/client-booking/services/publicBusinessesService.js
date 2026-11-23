// src/features/client-booking/services/publicBusinessesService.js
import { supabase } from '../../../services/supabaseClient';

/**
 * Servicio público para consultar negocios desde el Home.
 * Solo accede a negocios con is_active=true AND is_verified=true.
 * RLS permite esta consulta a `anon`, así que funciona sin login.
 */
export const publicBusinessesService = {
  /**
   * Lista todos los negocios públicos.
   * @returns {Promise<Array>} Lista de negocios mapeados al formato del Home.
   */
  async list() {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        id, name, slug, description, city, phone, logo_url, cover_url,
        type_id,
        business_types (id, label, icon)
      `)
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando negocios públicos:', error);
      throw new Error('No se pudieron cargar los negocios');
    }

    // Mapear al formato que espera el Home
    return (data || []).map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      description: b.description || 'Descubre este negocio en ReservaPro.',
      category: b.business_types?.label || 'General',
      categoryId: b.type_id,
      city: b.city || '',
      phone: b.phone || '',
      logo_url: b.logo_url,
      cover_url: b.cover_url,
    }));
  },

  /**
   * Obtiene un negocio por slug (para la página de detalle).
   */
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        business_types (id, label, icon),
        floors (
          id, name, zone_type, is_movable, is_bookable, max_capacity, sort_order
        ),
        business_hours (day_of_week, opens_at, closes_at, is_closed)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_verified', true)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Consulta disponibilidad de un negocio para una fecha y tamaño de grupo.
   */
  async getAvailability(businessId, date, partySize) {
    // 1. Verificamos qué tipo de negocio es para saber si usar mesas o no
    const { data: business } = await supabase
      .from('businesses')
      .select('type_id')
      .eq('id', businessId)
      .single();

    const isTableBased = business?.type_id === 'restaurante' || business?.type_id === 'eventos';

    if (isTableBased) {
      // Si es restaurante, usamos la lógica de mesas original
      const { data, error } = await supabase.rpc('get_availability', {
        p_business_id: businessId,
        p_date: date,
        p_party_size: partySize,
      });
      if (error) throw new Error('No se pudo consultar la disponibilidad');
      return data || [];
    } else {
      // ==========================================
      // LÓGICA PARA CITAS (Barbería, Veterinaria)
      // ==========================================
      
      // 🎯 FIX TIMEZONE: Parsear la fecha manualmente para evitar saltos de día
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const dayOfWeek = localDate.getDay();

      const { data: hours } = await supabase
        .from('business_hours')
        .select('opens_at, closes_at, is_closed')
        .eq('business_id', businessId)
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();

      if (!hours || hours.is_closed) return [];

      // Parsear la hora de apertura y cierre
      const [openH, openM] = hours.opens_at.split(':').map(Number);
      const [closeH, closeM] = hours.closes_at.split(':').map(Number);

      // Crear fechas locales reales (evita que UTC mueva el día)
      let current = new Date(year, month - 1, day, openH, openM, 0);
      const end = new Date(year, month - 1, day, closeH, closeM, 0);

      const slots = [];
      // 👇 Duración de cada cita en minutos (60 = 1 hora)
      const DURATION_MINUTES = 60; 

      while (current < end) {
        const next = new Date(current.getTime() + DURATION_MINUTES * 60000); 
        
        // Solo agregar si el bloque cabe antes de cerrar
        if (next <= end) {
          slots.push({
            slot_start: current.toISOString(),
            slot_end: next.toISOString(),
            available_table_ids: [], // No hay mesas
            available_merge_ids: [],
          });
        }
        current = next;
      }
      
      return slots;
    }
  },

  /**
   * Estadísticas públicas: total de negocios activos y categorías.
   */
  async getPublicStats() {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, type_id')
      .eq('is_active', true)
      .eq('is_verified', true);

    if (error) {
      console.warn('No se pudieron cargar stats:', error);
      return { totalBusinesses: 0, totalCategories: 0 };
    }

    const businesses = data || [];
    const uniqueCategories = new Set(businesses.map((b) => b.type_id).filter(Boolean));

    return {
      totalBusinesses: businesses.length,
      totalCategories: uniqueCategories.size,
    };
  },
};