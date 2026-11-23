// src/services/authService.js
import { supabase } from './supabaseClient';

// Mapa de redirección por rol
export const ROLE_HOME = {
  'super-admin': '/super-admin/dashboard',
  'business-admin': '/dashboard',
  'client': '/user/dashboard',
};

export const authService = {
  /**
   * Inicia sesión con email y contraseña usando Supabase Auth.
   * @returns {Promise<object>} El perfil completo del usuario (con rol).
   * @throws {Error} Si las credenciales son inválidas.
   */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      // Traducir mensajes de Supabase al español
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login')) {
        throw new Error('Correo o contraseña incorrectos');
      }
      if (msg.includes('email not confirmed')) {
        throw new Error('Debes confirmar tu correo antes de iniciar sesión');
      }
      if (msg.includes('too many requests')) {
        throw new Error('Demasiados intentos. Espera unos minutos.');
      }
      throw new Error(error.message);
    }

    // Cargar el perfil desde la tabla profiles (para obtener el rol)
    const profile = await this.getProfile(data.user.id);
    return profile;
  },

  /**
   * Obtiene el perfil del usuario desde la tabla profiles.
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error cargando perfil:', error);
      throw new Error('No se pudo cargar el perfil del usuario');
    }

    return data;
  },

  /**
   * Cierra la sesión actual.
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    }
    return true;
  },

  /**
   * Obtiene la sesión actual (si existe).
   * @returns {Promise<object|null>} El perfil o null.
   */
  async getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    try {
      return await this.getProfile(session.user.id);
    } catch {
      return null;
    }
  },

  /**
   * Escucha cambios en el estado de autenticación.
   * @param {Function} callback - Se ejecuta cuando cambia la sesión.
   * @returns {Function} Función para desuscribirse.
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          callback(null);
          return;
        }

        try {
          const profile = await this.getProfile(session.user.id);
          callback(profile);
        } catch {
          callback(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  },
};