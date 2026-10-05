// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Home } from '../features/client-booking/pages/Home';
import { Login } from '../features/auth/pages/Login';
import { SuperAdminDashboard } from '../features/super-admin/pages/SuperAdminDashboard';
import { Dashboard as BusinessDashboard } from '../features/business-admin/pages/Dashboard';
import { UserDashboard } from '../features/client-booking/pages/UserDashboard';
import { Placeholder } from '../components/common/Placeholder/Placeholder';

import { ProtectedRoute } from './ProtectedRoute';

// 🔀 Catch-all
const RootRedirect = () => {
  const { isAuthenticated, getHomeRoute } = useAuth();
  return <Navigate to={isAuthenticated ? getHomeRoute() : '/'} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌐 Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* 🛡️ Super Admin */}
      <Route
        path="/super-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['super-admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/negocios"
        element={
          <ProtectedRoute allowedRoles={['super-admin']}>
            <Placeholder title="Negocios Registrados" subtitle="Gestiona todos los negocios de la plataforma" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/usuarios"
        element={
          <ProtectedRoute allowedRoles={['super-admin']}>
            <Placeholder title="Usuarios" subtitle="Administra las cuentas de la plataforma" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/suscripciones"
        element={
          <ProtectedRoute allowedRoles={['super-admin']}>
            <Placeholder title="Suscripciones" subtitle="Controla los planes y pagos" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/seguridad"
        element={
          <ProtectedRoute allowedRoles={['super-admin']}>
            <Placeholder title="Seguridad" subtitle="Logs, auditoría y accesos" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/configuracion"
        element={
          <ProtectedRoute allowedRoles={['super-admin']}>
            <Placeholder title="Configuración Global" subtitle="Ajustes generales de AlPunto" />
          </ProtectedRoute>
        }
      />

      {/* 🏪 Business Admin */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['business-admin']}>
            <BusinessDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reservas"
        element={
          <ProtectedRoute allowedRoles={['business-admin']}>
            <Placeholder title="Citas y Reservas" subtitle="Gestiona las reservas de tus clientes" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/calendario"
        element={
          <ProtectedRoute allowedRoles={['business-admin']}>
            <Placeholder title="Agenda / Horarios" subtitle="Configura tus horarios de atención" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/mesas"
        element={
          <ProtectedRoute allowedRoles={['business-admin']}>
            <Placeholder title="Mapa de Mesas" subtitle="Diseña la distribución de tu local" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/catalogo"
        element={
          <ProtectedRoute allowedRoles={['business-admin']}>
            <Placeholder title="Catálogo / Menú" subtitle="Administra tus productos y servicios" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/equipo"
        element={
          <ProtectedRoute allowedRoles={['business-admin']}>
            <Placeholder title="Personal / Atención" subtitle="Gestiona a tu equipo de trabajo" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/configuracion"
        element={
          <ProtectedRoute allowedRoles={['business-admin']}>
            <Placeholder title="Ajustes del Negocio" subtitle="Configura los datos de tu negocio" />
          </ProtectedRoute>
        }
      />

      {/* 👤 Cliente */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/reservas"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <Placeholder title="Mis Reservas" subtitle="Consulta y gestiona tus reservas" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/explorar"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <Placeholder title="Explorar Negocios" subtitle="Descubre nuevos lugares cerca de ti" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/favoritos"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <Placeholder title="Favoritos" subtitle="Tus negocios guardados" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/perfil"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <Placeholder title="Mi Perfil" subtitle="Administra tu cuenta" />
          </ProtectedRoute>
        }
      />

      {/* 🔀 Catch-all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};