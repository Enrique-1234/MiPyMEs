// src/features/business-admin/utils/navLinks.jsx
import React from 'react';
import { Clock, Calendar, Users, ShoppingBag, Grid, Settings, Scissors } from 'lucide-react';
import { getFeaturesForBusiness } from '../../../config/businessConfig';

const FEATURE_MAP = {
  dashboard:    { to: '/dashboard',              icon: <Clock size={18} />,        label: 'Inicio' },
  reservations: { to: '/dashboard/reservas',     icon: <Calendar size={18} />,     label: 'Citas y Reservas' },
  appointments: { to: '/dashboard/reservas',     icon: <Calendar size={18} />,     label: 'Agenda de Citas' },
  calendar:     { to: '/dashboard/calendario',   icon: <Clock size={18} />,        label: 'Calendario' },
  tables:       { to: '/dashboard/mesas',        icon: <Grid size={18} />,         label: 'Mapa de Mesas' },
  menu:         { to: '/dashboard/catalogo',     icon: <ShoppingBag size={18} />,  label: 'Catálogo / Menú' },
  services:     { to: '/dashboard/servicios',    icon: <Scissors size={18} />,     label: 'Servicios y Precios' },
  staff:        { to: '/dashboard/equipo',       icon: <Users size={18} />,        label: 'Personal / Atención' },
  settings:     { to: '/dashboard/configuracion',icon: <Settings size={18} />,     label: 'Ajustes del Negocio' },
};

/**
 * Genera los links del sidebar basados en el tipo de negocio y la ruta actual.
 */
export const getBusinessNavLinks = (business, currentPath) => {
  if (!business) return [];
  
  const features = getFeaturesForBusiness(business.type_id);
  
  return features.map((featureKey) => {
    const item = FEATURE_MAP[featureKey];
    if (!item) return null;
    
    return {
      ...item,
      active: currentPath === item.to,
    };
  }).filter(Boolean);
};