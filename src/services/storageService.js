// src/services/storageService.js
import { supabase } from './supabaseClient';

const BUCKET = 'business-assets';

export const storageService = {
  /**
   * Sube una imagen (logo o portada) para un negocio.
   * @param {string} businessId - ID del negocio
   * @param {File} file - Archivo de imagen
   * @param {'logo'|'cover'} kind - Tipo de imagen
   */
  async uploadBusinessImage(businessId, file, kind = 'logo') {
    if (!file) throw new Error('No hay archivo seleccionado');

    // Validaciones básicas
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) throw new Error('La imagen no debe pesar más de 5MB');
    
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) throw new Error('Formato no válido. Usa PNG, JPG o WEBP');

    // Generar nombre único para evitar caché
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${kind}-${Date.now()}.${ext}`;
    const filePath = `${businessId}/${fileName}`;

    // Subir a Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) throw new Error(error.message);

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  /**
   * Elimina una imagen antigua del storage.
   */
  async deleteImage(publicUrl) {
    if (!publicUrl) return;
    try {
      const url = new URL(publicUrl);
      const match = url.pathname.match(/business-assets\/(.+)$/);
      if (match) {
        await supabase.storage.from(BUCKET).remove([match[1]]);
      }
    } catch (err) {
      console.warn('Error al borrar imagen antigua:', err);
    }
  },
};