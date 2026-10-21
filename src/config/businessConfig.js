// src/config/businessConfig.js

export const BUSINESS_FEATURES = {
  restaurante: {
    label: 'Restaurante',
    features: ['dashboard', 'reservations', 'calendar', 'tables', 'menu', 'staff', 'settings'],
  },
  barberia: {
    label: 'Barbería / Salón',
    features: ['dashboard', 'appointments', 'calendar', 'services', 'staff', 'settings'],
  },
  eventos: {
    label: 'Salón de Eventos',
    features: ['dashboard', 'reservations', 'calendar', 'tables', 'menu', 'staff', 'settings'],
  },
  veterinaria: {
    label: 'Veterinaria',
    features: ['dashboard', 'appointments', 'calendar', 'services', 'staff', 'settings'],
  },
  general: {
    label: 'General',
    features: ['dashboard', 'calendar', 'settings'],
  },
};

/**
 * Devuelve las features habilitadas para un negocio.
 * Si el type_id no existe, devuelve las de 'general'.
 */
export const getFeaturesForBusiness = (typeId) => {
  return BUSINESS_FEATURES[typeId]?.features || BUSINESS_FEATURES.general.features;
};