// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Home } from '../features/client-booking/pages/Home';
import { Login } from '../features/auth/pages/Login';
import { SuperAdminDashboard } from '../features/super-admin/pages/SuperAdminDashboard';
import { BusinessDashboard } from '../features/business-admin/pages/BusinessDashboard';import { UserDashboard } from '../features/client-booking/pages/UserDashboard';
import { Placeholder } from '../components/common/Placeholder/Placeholder';
import { BusinessesList } from '../features/super-admin/pages/BusinessesList';
import { BusinessForm } from '../features/super-admin/pages/BusinessForm';
import { ProtectedRoute } from './ProtectedRoute';
import { ZonesList } from '../features/super-admin/pages/ZonesList';
import { ZoneForm } from '../features/super-admin/pages/ZoneForm';
import { TablesList } from '../features/super-admin/pages/TablesList';
import { TableForm } from '../features/super-admin/pages/TableForm';
import { BusinessDetail } from '../features/client-booking/pages/BusinessDetail';
import { ReservationConfirmation } from '../features/client-booking/pages/ReservationConfirmation';
import { ReservationsList } from '../features/business-admin/pages/ReservationsList';
import { BusinessSettings } from '../features/business-admin/pages/BusinessSettings';
import { ReservationsCalendar } from '../features/business-admin/pages/ReservationsCalendar';
import { FloorEditor } from '../features/super-admin/pages/FloorEditor';

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
      <Route path="/negocio/:slug" element={<BusinessDetail />} />
      <Route path="/reserva/:code" element={<ReservationConfirmation />} />

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
      <BusinessesList />
    </ProtectedRoute>
  }
/>
      <Route
  path="/super-admin/negocios/nuevo"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <BusinessForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <BusinessForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id/zonas"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <ZonesList />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id/zonas/nueva"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <ZoneForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id/zonas/:zoneId"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <ZoneForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id/zonas/:zoneId/mesas"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <TablesList />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id/zonas/:zoneId/mesas/nueva"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <TableForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id/zonas/:zoneId/mesas/:tableId"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <TableForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/negocios/:id/editor"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <FloorEditor />
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
      <ReservationsList />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/calendario"
  element={
    <ProtectedRoute allowedRoles={['business-admin']}>
      <ReservationsCalendar />
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
      <BusinessSettings />
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