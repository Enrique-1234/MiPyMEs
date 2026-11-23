// src/features/client-booking/pages/FavoritesList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, Search, Heart, User as UserIcon,
  MapPin, Phone, Store, Trash2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { favoritesService } from '../services/favoritesService';
import { toast, confirmDialog } from '../../../utils/alerts';
import styled from 'styled-components';

// Reutilizamos estilos de explorar (puedes importarlos si los tienes exportados)
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

const FavCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s;
  cursor: pointer;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const CardImage = styled.div`
  height: 120px;
  background: ${({ $url }) => $url ? `url(${$url}) center/cover` : 'linear-gradient(135deg, #FF6B00, #FF2E93)'};
  position: relative;
  display: grid;
  place-items: center;

  .initial { font-size: 2.5rem; font-weight: 800; color: #fff; opacity: 0.8; }
`;

const CardBody = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 { font-size: 1.05rem; font-weight: 800; color: ${({ theme }) => theme.colors.text}; }
  .category { font-size: 0.7rem; font-weight: 700; color: ${({ theme }) => theme.colors.primary}; text-transform: uppercase; }
  .meta { display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.75rem; color: ${({ theme }) => theme.colors.textSoft}; margin-top: auto; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
  svg { opacity: 0.3; margin-bottom: 1rem; }
  p { font-size: 1rem; margin-bottom: 1rem; }
  a { color: ${({ theme }) => theme.colors.primary}; font-weight: 700; }
`;

const NAV_LINKS = [
  { to: '/user/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/user/reservas', icon: <Calendar size={18} />, label: 'Mis Reservas' },
  { to: '/user/explorar', icon: <Search size={18} />, label: 'Explorar Negocios' },
  { to: '/user/favoritos', icon: <Heart size={18} />, label: 'Favoritos' },
  { to: '/user/perfil', icon: <UserIcon size={18} />, label: 'Mi Perfil' },
];

export const FavoritesList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoritesService.listMyFavorites();
      setFavorites(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleRemove = async (e, business) => {
    e.stopPropagation(); // Evita que navegue al detalle del negocio
    const confirmed = await confirmDialog({
      title: '¿Quitar de favoritos?',
      text: `Se eliminará "${business.name}" de tu lista de guardados.`,
      confirmText: 'Sí, quitar',
      danger: true,
    });
    if (!confirmed) return;

    try {
      await favoritesService.toggleFavorite(business.id);
      setFavorites(prev => prev.filter(f => f.id !== business.id));
      toast.success('Eliminado de favoritos');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout
      sidebarLogo={<><span className="badge-icon">U</span><div><span>ReservaPro</span><span className="business-tag">Mi Cuenta</span></div></>}
      navLinks={NAV_LINKS.map(l => ({ ...l, active: l.to === '/user/favoritos' }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Mis Favoritos"
      headerSubtitle={`${favorites.length} negocios guardados`}
    >
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Cargando favoritos...</div>
      ) : favorites.length === 0 ? (
        <EmptyState>
          <Heart size={48} />
          <p>Aún no tienes negocios guardados.</p>
          <p style={{ fontSize: '0.9rem' }}>Explora los negocios y dale al corazón para guardarlos aquí.</p>
          <button onClick={() => navigate('/user/explorar')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '10px', background: '#FF6B00', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Explorar Negocios
          </button>
        </EmptyState>
      ) : (
        <CardsGrid>
          {favorites.map(biz => (
            <FavCard key={biz.id} onClick={() => navigate(`/negocio/${biz.slug}`)}>
              <CardImage $url={biz.cover_url}>
                {!biz.cover_url && <span className="initial">{biz.name[0]}</span>}
              </CardImage>
              <CardBody>
                <span className="category">{biz.category}</span>
                <h3>{biz.name}</h3>
                <div className="meta">
                  {biz.city && <span><MapPin size={12}/> {biz.city}</span>}
                  {biz.phone && <span><Phone size={12}/> {biz.phone}</span>}
                </div>
                <button
                  onClick={(e) => handleRemove(e, biz)}
                  style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  <Trash2 size={14} /> Quitar de favoritos
                </button>
              </CardBody>
            </FavCard>
          ))}
        </CardsGrid>
      )}
    </DashboardLayout>
  );
};