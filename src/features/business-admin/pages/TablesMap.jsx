// src/features/business-admin/pages/TablesMap.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock, Calendar, Users, ShoppingBag, Grid, Settings,
  Lock, Eye, Store,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { zonesService } from '../../../features/super-admin/services/zonesService';
import { tablesService } from '../../../features/super-admin/services/tablesService';
import {
  Toolbar, ZoneSelect, Legend, CanvasOuter, Canvas,
  EmptyCanvasMessage, TableShape, StatsRow,
  LoadingState, EmptyState, ErrorBox,
  ModalOverlay, ModalCard, DetailRow,
} from './TablesMap.styles';

const NAV_LINKS = [
  { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/dashboard/reservas', icon: <Calendar size={18} />, label: 'Citas y Reservas' },
  { to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' },
  { to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' },
  { to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: 'Catálogo / Menú' },
  { to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' },
  { to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' },
];

export const TablesMap = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const [business, setBusiness] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canvasScale, setCanvasScale] = useState(1);

  const selectedFloor = useMemo(
    () => floors.find((f) => f.id === selectedFloorId),
    [floors, selectedFloorId]
  );

  // Cargar negocio + zonas
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const biz = await businessAdminService.getMyBusiness();
        if (!alive) return;
        setBusiness(biz);

        if (biz) {
          const zones = await zonesService.listByBusiness(biz.id);
          if (!alive) return;
          setFloors(zones);
          if (zones.length > 0) setSelectedFloorId(zones[0].id);
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  // Cargar mesas al cambiar de zona
  useEffect(() => {
    if (!selectedFloorId) return;
    let alive = true;
    const load = async () => {
      try {
        const data = await tablesService.listByFloor(selectedFloorId);
        if (alive) setTables(data);
      } catch (err) {
        if (alive) setError(err.message);
      }
    };
    load();
    return () => { alive = false; };
  }, [selectedFloorId]);

  // Auto-zoom en pantallas pequeñas
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const canvasW = selectedFloor?.canvas_width || 1200;
      const available = w <= 900 ? w - 40 : Math.min(w - 340, 1200);
      const scale = Math.min(1, available / canvasW);
      setCanvasScale(Math.max(0.4, scale));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [selectedFloor]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Stats de la zona actual
  const zoneStats = useMemo(() => {
    const active = tables.filter((t) => t.is_active);
    const bookable = active.filter((t) => t.is_bookable);
    const totalCapacity = bookable.reduce((s, t) => s + (t.capacity || 0), 0);
    return {
      total: tables.length,
      active: active.length,
      bookable: bookable.length,
      totalCapacity,
    };
  }, [tables]);

  // ===== Render =====
  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Mapa de Mesas"
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando mapa...</LoadingState>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/mesas' }))}
        user={user}
        onLogout={handleLogout}
        headerTitle="Mapa de Mesas"
        headerSubtitle="Sin negocio asignado"
      >
        <EmptyState>
          <Store size={48} />
          <p>No tienes un negocio asignado. Contacta al administrador.</p>
        </EmptyState>
      </DashboardLayout>
    );
  }

  const canvasW = selectedFloor?.canvas_width || 1200;
  const canvasH = selectedFloor?.canvas_height || 800;

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">{business.name}</span></div></>}
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/mesas' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Mapa de Mesas"
      headerSubtitle="Vista previa de tu distribución (solo lectura)"
    >
      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      {floors.length === 0 ? (
        <EmptyState>
          <Grid size={48} />
          <p>Tu negocio aún no tiene zonas configuradas.</p>
          <p style={{ fontSize: '0.85rem' }}>
            Contacta al administrador de AlPunto para configurar tus zonas y mesas.
          </p>
        </EmptyState>
      ) : (
        <>
          <Toolbar>
            <Eye size={16} style={{ color: '#94A3B8' }} />
            <ZoneSelect
              value={selectedFloorId || ''}
              onChange={(e) => setSelectedFloorId(e.target.value)}
            >
              {floors.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </ZoneSelect>

            <div className="spacer" />

            <Legend>
              <span><i className="dot bookable" /> Reservable</span>
              <span><i className="dot not-bookable" /> No reservable</span>
              <span><i className="dot locked" /> Zona fija</span>
            </Legend>
          </Toolbar>

          {selectedFloor && (
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>
              <strong style={{ color: '#F5F5F5' }}>{selectedFloor.name}</strong>
              {selectedFloor.description ? ` · ${selectedFloor.description}` : ''}
              {!selectedFloor.is_bookable && ' · No reservable'}
            </div>
          )}

          <CanvasOuter>
            <div
              style={{
                width: `${canvasW * canvasScale}px`,
                height: `${canvasH * canvasScale}px`,
                position: 'relative',
              }}
            >
              <Canvas
                ref={canvasRef}
                $w={canvasW}
                $h={canvasH}
                $scale={canvasScale}
              >
                {tables.length === 0 ? (
                  <EmptyCanvasMessage>
                    Esta zona no tiene mesas todavía.
                  </EmptyCanvasMessage>
                ) : (
                  tables.map((t) => (
                    <TableShape
                      key={t.id}
                      $shape={t.shape}
                      $bookable={t.is_bookable && t.is_active}
                      style={{
                        left: `${t.pos_x ?? 100}px`,
                        top: `${t.pos_y ?? 100}px`,
                        width: `${t.width || 80}px`,
                        height: `${t.height || 80}px`,
                        transform: 'translate(-50%, -50%)',
                        opacity: t.is_active ? 1 : 0.4,
                      }}
                      onClick={() => setSelectedTable(t)}
                      title={`${t.name} · ${t.capacity} personas`}
                    >
                      <span className="table-name">{t.name}</span>
                      <span className="table-cap">{t.capacity} p.</span>
                      {!t.is_movable && (
                        <span className="lock-icon">
                          <Lock size={10} />
                        </span>
                      )}
                    </TableShape>
                  ))
                )}
              </Canvas>
            </div>
          </CanvasOuter>

          <StatsRow>
            <div className="stat-box">
              <div className="label">Total mesas</div>
              <div className="value">{zoneStats.total}</div>
            </div>
            <div className="stat-box">
              <div className="label">Activas</div>
              <div className="value">{zoneStats.active}</div>
            </div>
            <div className="stat-box">
              <div className="label">Reservables</div>
              <div className="value">{zoneStats.bookable}</div>
            </div>
            <div className="stat-box">
              <div className="label">Cap. total</div>
              <div className="value">{zoneStats.totalCapacity}</div>
            </div>
          </StatsRow>
        </>
      )}

      {/* ===== Modal de detalle de mesa ===== */}
      {selectedTable && (
        <ModalOverlay onClick={() => setSelectedTable(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <h2>
              {selectedTable.name}{' '}
              {!selectedTable.is_movable && (
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                  (fija)
                </span>
              )}
            </h2>

            <DetailRow>
              <span className="label">👥 Capacidad</span>
              <span className="value">
                {selectedTable.capacity} personas
                {selectedTable.min_capacity > 1 && ` (mín ${selectedTable.min_capacity})`}
              </span>
            </DetailRow>

            <DetailRow>
              <span className="label">📐 Forma</span>
              <span className="value">{selectedTable.shape}</span>
            </DetailRow>

            <DetailRow>
              <span className="label">📏 Tamaño</span>
              <span className="value">
                {selectedTable.width || 80} × {selectedTable.height || 80} px
              </span>
            </DetailRow>

            <DetailRow>
              <span className="label">📍 Posición</span>
              <span className="value">
                X: {selectedTable.pos_x ?? 0} · Y: {selectedTable.pos_y ?? 0}
              </span>
            </DetailRow>

            <DetailRow>
              <span className="label">📊 Estado</span>
              <span className="value">
                {selectedTable.is_active ? 'Activa' : 'Inactiva'}
                {selectedTable.is_bookable ? ' · Reservable' : ' · No reservable'}
              </span>
            </DetailRow>

            <button
              type="button"
              onClick={() => setSelectedTable(null)}
              style={{
                width: '100%',
                marginTop: '1.25rem',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: '#FF6B00',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Cerrar
            </button>
          </ModalCard>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};