import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Home } from '../features/client-booking/pages/Home';
import { Login } from '../features/client-booking/pages/Login';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Login />} />

      {/* Rutas Protegidas por Rol */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'business-admin', 'super-admin']} />}>
        <Route path="/dashboard" element={<div style={{ padding: '100px 2rem' }}><h2>Mi Panel AlPunto</h2></div>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['business-admin', 'super-admin']} />}>
        <Route path="/admin/catalog" element={<div style={{ padding: '100px 2rem' }}><h2>Gestión de Catálogo</h2></div>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['super-admin']} />}>
        <Route path="/super-admin" element={<div style={{ padding: '100px 2rem' }}><h2>Panel Super Admin</h2></div>} />
      </Route>
    </Routes>
  );
};