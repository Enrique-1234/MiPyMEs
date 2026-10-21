// src/features/business-admin/pages/TablesMap.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock, Calendar, Users, ShoppingBag, Grid, Settings,
  Lock, Eye, Store, Plus, Trash2, Edit2, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { zonesService } from '../../../features/super-admin/services/zonesService';
import { tablesService } from '../../../features/super-admin/services/tablesService';
import { toast, confirmDialog } from '../../../utils/alerts';
import { getBusinessNavLinks } from '../utils/navLinks';
import {
  Toolbar, ZoneSelect, Legend, CanvasOuter, Canvas,
  EmptyCanvasMessage, TableShape, StatsRow,
  LoadingState, EmptyState, ErrorBox,
  ModalOverlay, ModalCard, DetailRow,
} from './TablesMap.styles';
// Importamos estilos de formularios para el modal
import {
  PrimaryButton, GhostButton, FieldGroup, ModalActions
} from './MenuList.styles';

const DEFAULT_TABLE = { name: '', capacity: 4, shape: 'square', is_bookable: true };

export const TablesMap = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const [business, setBusiness] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [tables, setTables] = useState([]);
  
  // Modales
  const [selectedTable, setSelectedTable] = useState(null); // Para ver detalles
  const [editTable, setEditTable] = useState(null); // Para crear/editar
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canvasScale, setCanvasScale] = useState(1);

  const selectedFloor = useMemo(
    () => floors.find((f) => f.id === selectedFloorId),
    [floors, selectedFloorId]
  );

  const loadData = async () => {
    try {
      const biz = await businessAdminService.getMyBusiness();
      setBusiness(biz);
      if (biz) {
        const zones = await zonesService.listByBusiness(biz.id);
        setFloors(zones);
        if (zones.length > 0 && !selectedFloorId) setSelectedFloorId(zones[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!selectedFloorId) return;
    tablesService.listByFloor(selectedFloorId).then(setTables).catch(err => setError(err.message));
  }, [selectedFloorId]);

  // Auto-zoom
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const canvasW = selectedFloor?.canvas_width || 1200;
      const available = w <= 900 ? w - 40 : Math.min(w - 340, 1200);
      setCanvasScale(Math.max(0.4, Math.min(1, available / canvasW)));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [selectedFloor]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // --- CRUD de Mesas ---
  const handleSaveTable = async (e) => {
    e.preventDefault();
    if (!editTable.name.trim()) return toast.error('El nombre es obligatorio');
    setSaving(true);
    try {
      if (editTable.id) {
        await tablesService.update(editTable.id, editTable);
        toast.success('Mesa actualizada');
      } else {
        await tablesService.create({ ...editTable, floor_id: selectedFloorId });
        toast.success('Mesa creada');
      }
      // Recargar mesas
      const data = await tablesService.listByFloor(selectedFloorId);
      setTables(data);
      setEditTable(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTable = async (table) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar mesa?',
      text: `Se eliminará "${table.name}" y sus reservas activas.`,
      confirmText: 'Sí, eliminar',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await tablesService.remove(table.id);
      setTables(prev => prev.filter(t => t.id !== table.id));
      setSelectedTable(null);
      toast.success('Mesa eliminada');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingState>Cargando mapa...</LoadingState>;

  const canvasW = selectedFloor?.canvas_width || 1200;
  const canvasH = selectedFloor?.canvas_height || 800;

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">{business?.name || 'Mi Negocio'}</span></div></>}
      navLinks={getBusinessNavLinks(business, '/dashboard/mesas')}
      user={user}
      onLogout={handleLogout}
      headerTitle="Mapa de Mesas"
      headerSubtitle="Gestiona la distribución de tu local"
    >
      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      {floors.length === 0 ? (
        <EmptyState>
          <Grid size={48} />
          <p>Tu negocio aún no tiene zonas configuradas.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Contacta al administrador para crear tu primera zona.</p>
        </EmptyState>
      ) : (
        <>
          <Toolbar style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ZoneSelect value={selectedFloorId || ''} onChange={(e) => setSelectedFloorId(e.target.value)}>
              {floors.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </ZoneSelect>
            
            <div style={{ flex: 1 }} />

            <PrimaryButton onClick={() => setEditTable(DEFAULT_TABLE)}>
              <Plus size={16} /> Nueva Mesa
            </PrimaryButton>
            
            {/* Botón para ir al editor visual completo */}
            <Link to={`/super-admin/negocios/${business.id}/editor`} target="_blank" style={{ textDecoration: 'none' }}>
              <GhostButton type="button" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LayoutDashboard size={16} /> Modo Edición (Arrastrar)
              </GhostButton>
            </Link>
          </Toolbar>

          <CanvasOuter>
            <div style={{ width: `${canvasW * canvasScale}px`, height: `${canvasH * canvasScale}px`, position: 'relative' }}>
              <Canvas ref={canvasRef} $w={canvasW} $h={canvasH} $scale={canvasScale}>
                {tables.length === 0 ? (
                  <EmptyCanvasMessage>Esta zona no tiene mesas. Crea una nueva.</EmptyCanvasMessage>
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
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedTable(t)}
                    >
                      <span className="table-name">{t.name}</span>
                      <span className="table-cap">{t.capacity} p.</span>
                    </TableShape>
                  ))
                )}
              </Canvas>
            </div>
          </CanvasOuter>
        </>
      )}

      {/* MODAL: Ver Detalle / Editar / Eliminar */}
      {selectedTable && (
        <ModalOverlay onClick={() => setSelectedTable(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <h2>Mesa: {selectedTable.name}</h2>
            <DetailRow><span className="label">Capacidad:</span> <span className="value">{selectedTable.capacity} personas</span></DetailRow>
            <DetailRow><span className="label">Forma:</span> <span className="value">{selectedTable.shape}</span></DetailRow>
            <DetailRow><span className="label">Posición:</span> <span className="value">X: {selectedTable.pos_x} · Y: {selectedTable.pos_y}</span></DetailRow>
            
            <ModalActions style={{ marginTop: '1.5rem' }}>
              <GhostButton $danger onClick={() => handleDeleteTable(selectedTable)}>
                <Trash2 size={14} /> Eliminar
              </GhostButton>
              <PrimaryButton onClick={() => { setEditTable(selectedTable); setSelectedTable(null); }}>
                <Edit2 size={14} /> Editar Mesa
              </PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* MODAL: Crear / Editar Mesa */}
      {editTable && (
        <ModalOverlay onClick={() => !saving && setEditTable(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()} onSubmit={handleSaveTable}>
            <h2>{editTable.id ? 'Editar Mesa' : 'Nueva Mesa'}</h2>
            
            <FieldGroup>
              <label>Nombre (Ej. M1, J2)</label>
              <input type="text" value={editTable.name} onChange={e => setEditTable({...editTable, name: e.target.value})} required />
            </FieldGroup>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FieldGroup>
                <label>Capacidad (Personas)</label>
                <input type="number" min="1" value={editTable.capacity} onChange={e => setEditTable({...editTable, capacity: parseInt(e.target.value)})} required />
              </FieldGroup>
              <FieldGroup>
                <label>Forma</label>
                <select value={editTable.shape} onChange={e => setEditTable({...editTable, shape: e.target.value})}>
                  <option value="square">Cuadrada</option>
                  <option value="rectangle">Rectangular</option>
                  <option value="circle">Circular</option>
                  <option value="oval">Ovalada</option>
                </select>
              </FieldGroup>
            </div>

            <ModalActions>
              <GhostButton type="button" onClick={() => setEditTable(null)} disabled={saving}>Cancelar</GhostButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Mesa'}</PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};