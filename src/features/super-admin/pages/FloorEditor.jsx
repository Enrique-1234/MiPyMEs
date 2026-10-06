// src/features/super-admin/pages/FloorEditor.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, ShieldCheck, Settings,
  Save, ArrowLeft, Lock, MousePointer2,
} from 'lucide-react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessesService } from '../services/businessesService';
import { zonesService } from '../services/zonesService';
import { tablesService } from '../services/tablesService';
import { toast, confirmDialog } from '../../../utils/alerts';
import { supabase } from '../../../services/supabaseClient';
import {
  Breadcrumb, Toolbar, ZoneSelect, Button, DirtyBadge, CanvasOuter,
  Canvas, EmptyCanvasMessage, TableShape, CoordinatesBadge,
  LoadingState, EmptyState, ErrorBox,
} from './FloorEditor.styles';

// Registrar plugin una sola vez
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

const NAV_LINKS = [
  { to: '/super-admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Vista Global' },
  { to: '/super-admin/negocios', icon: <Building2 size={18} />, label: 'Negocios Registrados' },
  { to: '/super-admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
  { to: '/super-admin/suscripciones', icon: <CreditCard size={18} />, label: 'Suscripciones' },
  { to: '/super-admin/seguridad', icon: <ShieldCheck size={18} />, label: 'Seguridad' },
  { to: '/super-admin/configuracion', icon: <Settings size={18} />, label: 'Configuración Global' },
];

/* =====================================================================
   Componente de mesa individual con GSAP Draggable
   ===================================================================== */
const DraggableTable = ({ table, position, canvasRef, onPositionChange, onDragMove }) => {
  const elRef = useRef(null);

  // Crear/actualizar el Draggable cuando cambia la mesa o su zona
  useEffect(() => {
    const el = elRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    // Si la mesa NO es movible, solo posicionamos estáticamente
    if (!table.is_movable) {
      gsap.set(el, { left: position.x, top: position.y });
      return;
    }

    const [draggable] = Draggable.create(el, {
      type: 'left,top',
      bounds: canvas,
      dragResistance: 0,          // sin resistencia
      edgeResistance: 0.75,        // un poco de resistencia en bordes
      cursor: 'grabbing',
      onPress() {
        el.classList.add('dragging');
      },
      onDrag() {
        // Reportar posición en vivo al padre (para el badge de coordenadas)
        onDragMove?.({
          x: Math.round(this.x),
          y: Math.round(this.y),
        });
      },
      onRelease() {
        el.classList.remove('dragging');
        onDragMove?.(null);
      },
      onDragEnd() {
        const x = Math.round(parseFloat(el.style.left) || 0);
        const y = Math.round(parseFloat(el.style.top) || 0);
        onPositionChange(table.id, x, y);
      },
    });

    // Posición inicial (después de crear el Draggable para no chocar)
    gsap.set(el, { left: position.x, top: position.y });

    return () => draggable.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.id, table.is_movable, position.x, position.y]);

  return (
    <TableShape
      ref={elRef}
      $shape={table.shape}
      $bookable={table.is_bookable}
      $movable={table.is_movable}
      style={{
        left: position.x,
        top: position.y,
        width: `${table.width || 80}px`,
        height: `${table.height || 80}px`,
      }}
      title={`${table.name} · ${table.capacity} personas${table.is_movable ? '' : ' (fija)'}`}
    >
      <span className="table-name">{table.name}</span>
      <span className="table-cap">{table.capacity} p.</span>
      {!table.is_movable && (
        <span className="lock-icon">
          <Lock size={10} />
        </span>
      )}
    </TableShape>
  );
};

/* =====================================================================
   Editor Principal
   ===================================================================== */
export const FloorEditor = () => {
  const { id: businessId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canvasRef = useRef(null);

  const [business, setBusiness] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [tables, setTables] = useState([]);
  const [positions, setPositions] = useState({});
  const [dirty, setDirty] = useState(false);
  const [draggingCoords, setDraggingCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedFloor = useMemo(
    () => floors.find((f) => f.id === selectedFloorId),
    [floors, selectedFloorId]
  );

  // ===== Cargar business + zones =====
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [biz, zones] = await Promise.all([
          businessesService.getById(businessId),
          zonesService.listByBusiness(businessId),
        ]);
        if (!alive) return;
        setBusiness(biz);
        setFloors(zones);

        // Seleccionar la primera zona automáticamente
        if (zones.length > 0) {
          setSelectedFloorId(zones[0].id);
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [businessId]);

  // ===== Cargar mesas al cambiar de zona =====
  useEffect(() => {
    if (!selectedFloorId) return;
    let alive = true;
    const load = async () => {
      try {
        const data = await tablesService.listByFloor(selectedFloorId);
        if (!alive) return;
        setTables(data);

        // Inicializar posiciones
        const pos = {};
        data.forEach((t, idx) => {
          pos[t.id] = {
            x: t.pos_x ?? 100 + (idx % 5) * 100,
            y: t.pos_y ?? 100 + Math.floor(idx / 5) * 100,
          };
        });
        setPositions(pos);
        setDirty(false);
      } catch (err) {
        if (alive) setError(err.message);
      }
    };
    load();
    return () => { alive = false; };
  }, [selectedFloorId]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ===== Handlers =====
  const handlePositionChange = (tableId, x, y) => {
    setPositions((prev) => {
      const old = prev[tableId];
      if (old && old.x === x && old.y === y) return prev;
      return { ...prev, [tableId]: { x, y } };
    });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!dirty || !tables.length) return;
    setSaving(true);
    setError('');
    try {
      // Actualizar cada mesa con su nueva posición
      const updates = tables.map((t) => {
        const pos = positions[t.id];
        return supabase
          .from('tables')
          .update({ pos_x: pos.x, pos_y: pos.y })
          .eq('id', t.id);
      });
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed) throw new Error(failed.error.message);

      setDirty(false);
      toast.success('Distribución guardada');
    } catch (err) {
      setError(err.message);
      toast.error('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!dirty) {
      // Si no hay cambios, solo recargamos desde el estado original
      const pos = {};
      tables.forEach((t) => {
        pos[t.id] = { x: t.pos_x ?? 100, y: t.pos_y ?? 100 };
      });
      setPositions(pos);
      return;
    }

    const confirmed = await confirmDialog({
      title: '¿Descartar cambios?',
      text: 'Se perderán todas las posiciones que modificaste sin guardar.',
      confirmText: 'Sí, descartar',
      danger: true,
    });
    if (!confirmed) return;

    const pos = {};
    tables.forEach((t) => {
      pos[t.id] = { x: t.pos_x ?? 100, y: t.pos_y ?? 100 };
    });
    setPositions(pos);
    setDirty(false);
  };

  const handleBack = async () => {
    if (dirty) {
      const confirmed = await confirmDialog({
        title: '¿Salir sin guardar?',
        text: 'Tienes cambios sin guardar. Si sales ahora, se perderán.',
        confirmText: 'Sí, salir',
        danger: true,
      });
      if (!confirmed) return;
    }
    navigate(`/super-admin/negocios/${businessId}/zonas`);
  };

  // ===== Renders =====
  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Editor Visual"
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando editor...</LoadingState>
      </DashboardLayout>
    );
  }

  if (error && !business) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Error"
        headerSubtitle=""
      >
        <ErrorBox>⚠️ {error}</ErrorBox>
      </DashboardLayout>
    );
  }

  const canvasW = selectedFloor?.canvas_width || 1200;
  const canvasH = selectedFloor?.canvas_height || 800;

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">SA</span><div><span>AlPunto</span><span className="business-tag">Super Admin</span></div></>}
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/super-admin/negocios' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle={`Editor: ${business?.name || ''}`}
      headerSubtitle="Arrastra las mesas para armar la distribución"
    >
      <Breadcrumb>
        <Link to="/super-admin/negocios">Negocios</Link>
        <span>/</span>
        <Link to={`/super-admin/negocios/${businessId}/zonas`}>{business?.name}</Link>
        <span>/</span>
        <span>Editor visual</span>
      </Breadcrumb>

      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      {floors.length === 0 ? (
        <EmptyState>
          <p>Este negocio no tiene zonas todavía. Crea una zona primero.</p>
        </EmptyState>
      ) : (
        <>
          {/* ===== Toolbar ===== */}
          <Toolbar>
            <Button onClick={handleBack}>
              <ArrowLeft size={14} /> Volver
            </Button>

            <ZoneSelect
              value={selectedFloorId || ''}
              onChange={(e) => setSelectedFloorId(e.target.value)}
            >
              {floors.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </ZoneSelect>

            <div className="spacer" />

            {dirty && (
              <DirtyBadge>
                <MousePointer2 size={12} /> Cambios sin guardar
              </DirtyBadge>
            )}

            <Button onClick={handleReset} disabled={saving}>
              Restablecer
            </Button>
            <Button $variant="primary" onClick={handleSave} disabled={!dirty || saving}>
              <Save size={14} />
              {saving ? 'Guardando...' : 'Guardar distribución'}
            </Button>
          </Toolbar>

          {/* ===== Info de la zona ===== */}
          {selectedFloor && (
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>
              <strong style={{ color: '#F5F5F5' }}>{selectedFloor.name}</strong>
              {' · '}
              {selectedFloor.is_movable ? 'Mesas movibles' : 'Zona fija'}
              {' · '}
              {canvasW} × {canvasH} px
              {!selectedFloor.is_bookable && ' · No reservable'}
            </div>
          )}

          {/* ===== Canvas ===== */}
          <CanvasOuter>
            <Canvas ref={canvasRef} $w={canvasW} $h={canvasH}>
              {tables.length === 0 ? (
                <EmptyCanvasMessage>
                  Esta zona no tiene mesas todavía.
                  <br />
                  <Link
                    to={`/super-admin/negocios/${businessId}/zonas/${selectedFloorId}/mesas/nueva`}
                    style={{ color: '#FF6B00', fontWeight: 700, marginTop: '0.5rem', display: 'inline-block' }}
                  >
                    Crear la primera mesa →
                  </Link>
                </EmptyCanvasMessage>
              ) : (
                tables.map((t) => (
                  <DraggableTable
                    key={t.id}
                    table={{ ...t, is_movable: selectedFloor?.is_movable !== false }}
                    position={positions[t.id] || { x: 100, y: 100 }}
                    canvasRef={canvasRef}
                    onPositionChange={handlePositionChange}
                    onDragMove={setDraggingCoords}
                  />
                ))
              )}
            </Canvas>
          </CanvasOuter>

          {/* ===== Coordenadas en vivo ===== */}
          {draggingCoords && (
            <CoordinatesBadge>
              X: <span>{draggingCoords.x}</span> · Y: <span>{draggingCoords.y}</span>
            </CoordinatesBadge>
          )}
        </>
      )}
    </DashboardLayout>
  );
};