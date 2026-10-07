// src/features/business-admin/pages/MenuList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, Users, ShoppingBag, Grid, Settings,
  Plus, Pencil, Trash2, UtensilsCrossed, X, Check,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { businessAdminService } from '../services/businessAdminService';
import { menuService } from '../services/menuService';
import { toast, confirmDialog } from '../../../utils/alerts';
import {
  Toolbar, PrimaryButton, SmallButton, CategoryBlock, CategoryHeader,
  ItemsList, ItemRow, EmptyCategory, EmptyState, LoadingState, ErrorBox,
  Badge, ModalOverlay, ModalCard, FieldGroup, ModalActions, GhostButton,
} from './MenuList.styles';

const NAV_LINKS = [
  { to: '/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/dashboard/reservas', icon: <Calendar size={18} />, label: 'Citas y Reservas' },
  { to: '/dashboard/calendario', icon: <Clock size={18} />, label: 'Agenda / Horarios' },
  { to: '/dashboard/mesas', icon: <Grid size={18} />, label: 'Mapa de Mesas' },
  { to: '/dashboard/catalogo', icon: <ShoppingBag size={18} />, label: 'Catálogo / Menú' },
  { to: '/dashboard/equipo', icon: <Users size={18} />, label: 'Personal / Atención' },
  { to: '/dashboard/configuracion', icon: <Settings size={18} />, label: 'Ajustes del Negocio' },
];

const formatPrice = (price) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(Number(price) || 0);

export const MenuList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal de categoría
  const [catModal, setCatModal] = useState(null); // null | { id?, name, description }
  // Modal de item
  const [itemModal, setItemModal] = useState(null); // null | { categoryId, id?, name, description, price }
  const [saving, setSaving] = useState(false);

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
          const data = await menuService.listByBusiness(biz.id);
          if (alive) setCategories(data);
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const reloadMenu = async () => {
    if (!business) return;
    const data = await menuService.listByBusiness(business.id);
    setCategories(data);
  };

  // ==== Categorías ====
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!catModal.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: catModal.name.trim(),
        description: catModal.description.trim() || null,
      };
      if (catModal.id) {
        await menuService.updateCategory(catModal.id, payload);
        toast.success('Categoría actualizada');
      } else {
        await menuService.createCategory(business.id, payload);
        toast.success('Categoría creada');
      }
      await reloadMenu();
      setCatModal(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar categoría?',
      text: `Se eliminará "${cat.name}" y todos sus platillos.`,
      confirmText: 'Sí, eliminar',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await menuService.deleteCategory(cat.id);
      await reloadMenu();
      toast.success('Categoría eliminada');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ==== Items ====
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!itemModal.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    const price = parseFloat(itemModal.price);
    if (isNaN(price) || price < 0) {
      toast.error('El precio debe ser un número válido');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: itemModal.name.trim(),
        description: itemModal.description.trim() || null,
        price,
      };
      if (itemModal.id) {
        await menuService.updateItem(itemModal.id, payload);
        toast.success('Platillo actualizado');
      } else {
        await menuService.createItem(itemModal.categoryId, payload);
        toast.success('Platillo creado');
      }
      await reloadMenu();
      setItemModal(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (item) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar platillo?',
      text: `Se eliminará "${item.name}" del menú.`,
      confirmText: 'Sí, eliminar',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await menuService.deleteItem(item.id);
      await reloadMenu();
      toast.success('Platillo eliminado');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await menuService.toggleItemAvailability(item.id, !item.is_available);
      await reloadMenu();
      toast.success(item.is_available ? 'Platillo deshabilitado' : 'Platillo disponible');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ==== Render ====
  if (loading) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
        headerTitle="Catálogo / Menú"
        headerSubtitle="Cargando..."
      >
        <LoadingState>Cargando menú...</LoadingState>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout
        sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">Mi Negocio</span></div></>}
        navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/catalogo' }))}
        user={user}
        onLogout={handleLogout}
        headerTitle="Catálogo / Menú"
        headerSubtitle="Sin negocio asignado"
      >
        <EmptyState>
          <ShoppingBag size={48} />
          <p>No tienes un negocio asignado. Contacta al administrador.</p>
        </EmptyState>
      </DashboardLayout>
    );
  }

  const totalItems = categories.reduce(
    (s, c) => s + (c.menu_items?.length || 0),
    0
  );

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">A</span><div><span>AlPunto</span><span className="business-tag">{business.name}</span></div></>}
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/dashboard/catalogo' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Catálogo / Menú"
      headerSubtitle={`${categories.length} categoría${categories.length !== 1 ? 's' : ''} · ${totalItems} platillo${totalItems !== 1 ? 's' : ''}`}
    >
      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      <Toolbar>
        <div className="spacer" />
        <PrimaryButton onClick={() => setCatModal({ name: '', description: '' })}>
          <Plus size={16} /> Nueva categoría
        </PrimaryButton>
      </Toolbar>

      {categories.length === 0 && (
        <EmptyState>
          <UtensilsCrossed size={48} />
          <p>Tu menú está vacío. Empieza creando una categoría.</p>
          <PrimaryButton onClick={() => setCatModal({ name: '', description: '' })}>
            <Plus size={16} /> Crear primera categoría
          </PrimaryButton>
        </EmptyState>
      )}

      {categories.map((cat) => {
        const items = cat.menu_items || [];
        return (
          <CategoryBlock key={cat.id}>
            <CategoryHeader>
              <div className="title-block">
                <h3>
                  {cat.name}{' '}
                  {!cat.is_active && (
                    <Badge $variant="danger">Inactiva</Badge>
                  )}
                </h3>
                {cat.description && <p>{cat.description}</p>}
              </div>
              <div className="actions">
                <SmallButton
                  onClick={() =>
                    setItemModal({ categoryId: cat.id, name: '', description: '', price: '' })
                  }
                >
                  <Plus size={12} /> Platillo
                </SmallButton>
                <SmallButton
                  onClick={() =>
                    setCatModal({
                      id: cat.id,
                      name: cat.name,
                      description: cat.description || '',
                    })
                  }
                >
                  <Pencil size={12} /> Editar
                </SmallButton>
                <SmallButton $danger onClick={() => handleDeleteCategory(cat)}>
                  <Trash2 size={12} /> Eliminar
                </SmallButton>
              </div>
            </CategoryHeader>

            {items.length === 0 ? (
              <EmptyCategory>Sin platillos en esta categoría todavía.</EmptyCategory>
            ) : (
              <ItemsList>
                {items.map((item) => (
                  <ItemRow key={item.id}>
                    <div className="info">
                      <div className="name">
                        {item.name}{' '}
                        {!item.is_available && (
                          <Badge $variant="danger">No disponible</Badge>
                        )}
                      </div>
                      {item.description && <div className="desc">{item.description}</div>}
                    </div>

                    <div className="price">{formatPrice(item.price)}</div>

                    <div className="actions">
                      <SmallButton onClick={() => handleToggleAvailable(item)}>
                        {item.is_available ? <X size={12} /> : <Check size={12} />}
                        {item.is_available ? 'Ocultar' : 'Mostrar'}
                      </SmallButton>
                      <SmallButton
                        onClick={() =>
                          setItemModal({
                            categoryId: cat.id,
                            id: item.id,
                            name: item.name,
                            description: item.description || '',
                            price: String(item.price),
                          })
                        }
                      >
                        <Pencil size={12} />
                      </SmallButton>
                      <SmallButton $danger onClick={() => handleDeleteItem(item)}>
                        <Trash2 size={12} />
                      </SmallButton>
                    </div>
                  </ItemRow>
                ))}
              </ItemsList>
            )}
          </CategoryBlock>
        );
      })}

      {/* ===== Modal de categoría ===== */}
      {catModal && (
        <ModalOverlay onClick={() => !saving && setCatModal(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()} onSubmit={handleSaveCategory}>
            <h2>{catModal.id ? 'Editar categoría' : 'Nueva categoría'}</h2>

            <FieldGroup>
              <label>Nombre *</label>
              <input
                type="text"
                value={catModal.name}
                onChange={(e) => setCatModal({ ...catModal, name: e.target.value })}
                placeholder="Ej: Entradas, Bebidas, Postres"
                maxLength={80}
                autoFocus
                required
              />
            </FieldGroup>

            <FieldGroup>
              <label>Descripción</label>
              <textarea
                value={catModal.description}
                onChange={(e) => setCatModal({ ...catModal, description: e.target.value })}
                placeholder="Opcional"
                maxLength={300}
              />
            </FieldGroup>

            <ModalActions>
              <GhostButton type="button" onClick={() => setCatModal(null)} disabled={saving}>
                Cancelar
              </GhostButton>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Guardando...' : catModal.id ? 'Guardar cambios' : 'Crear categoría'}
              </PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* ===== Modal de item ===== */}
      {itemModal && (
        <ModalOverlay onClick={() => !saving && setItemModal(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()} onSubmit={handleSaveItem}>
            <h2>{itemModal.id ? 'Editar platillo' : 'Nuevo platillo'}</h2>

            <FieldGroup>
              <label>Nombre *</label>
              <input
                type="text"
                value={itemModal.name}
                onChange={(e) => setItemModal({ ...itemModal, name: e.target.value })}
                placeholder="Ej: Tacos al pastor"
                maxLength={120}
                autoFocus
                required
              />
            </FieldGroup>

            <FieldGroup>
              <label>Descripción</label>
              <textarea
                value={itemModal.description}
                onChange={(e) => setItemModal({ ...itemModal, description: e.target.value })}
                placeholder="Ingredientes, porción, etc."
                maxLength={400}
              />
            </FieldGroup>

            <FieldGroup>
              <label>Precio (MXN) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={itemModal.price}
                onChange={(e) => setItemModal({ ...itemModal, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </FieldGroup>

            <ModalActions>
              <GhostButton type="button" onClick={() => setItemModal(null)} disabled={saving}>
                Cancelar
              </GhostButton>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Guardando...' : itemModal.id ? 'Guardar cambios' : 'Crear platillo'}
              </PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};