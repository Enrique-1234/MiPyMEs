// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rutas según autenticación y roles.
 * @param {React.ReactNode} children - El componente a renderizar
 * @param {string[]} allowedRoles - Roles permitidos. Si no se pasa, cualquier autenticado entra.
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, getHomeRoute } = useAuth();
  const location = useLocation();

  // 1. No autenticado → al login (guardando la ruta que intentó visitar)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Autenticado pero sin permiso para esta ruta → a su propio dashboard
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomeRoute()} replace />;
  }

  // 3. Todo OK
  return children;
};