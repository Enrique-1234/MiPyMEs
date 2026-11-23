import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Search, Heart, User as UserIcon, MapPin, Phone, Store, } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { publicBusinessesService } from '../services/publicBusinessesService';
import { favoritesService } from '../services/favoritesService';
import { toast } from '../../../utils/alerts';
import { supabase } from '../../../services/supabaseClient';

import {
  Toolbar,
  SearchInput,
  SearchWrapper,
  FilterSelect,
  CardsGrid,
  BusinessCard,
  CardImage,
  CardBody,
  EmptyState,
  LoadingState,
  ErrorBox,
} from './ExploreBusinesses.styles';

const NAV_LINKS = [
  { to: '/user/dashboard', icon: <Clock size={18} />, label: 'Inicio' },
  { to: '/user/reservas', icon: <Calendar size={18} />, label: 'Mis Reservas' },
  { to: '/user/explorar', icon: <Search size={18} />, label: 'Explorar Negocios' },
  { to: '/user/favoritos', icon: <Heart size={18} />, label: 'Favoritos' },
  { to: '/user/perfil', icon: <UserIcon size={18} />, label: 'Mi Perfil' },
];

export const ExploreBusinesses = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Cargar negocios disponibles.
  useEffect(() => {
    let alive = true;

    const loadBusinesses = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await publicBusinessesService.list();

        if (alive) {
          setBusinesses(data);
        }
      } catch (err) {
        if (alive) {
          setError(err.message || 'No se pudieron cargar los negocios.');
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadBusinesses();

    return () => {
      alive = false;
    };
  }, []);

  // Cargar los favoritos guardados del usuario autenticado.
  useEffect(() => {
    let alive = true;

    const loadFavorites = async () => {
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!authUser) return;

        const { data, error: favoritesError } = await supabase
          .from('favorites')
          .select('business_id')
          .eq('user_id', authUser.id);

        if (favoritesError) throw favoritesError;

        if (alive && data) {
          setFavoriteIds(
            new Set(data.map((favorite) => favorite.business_id))
          );
        }
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
      }
    };

    loadFavorites();

    return () => {
      alive = false;
    };
  }, []);

  // Agregar o quitar un negocio de favoritos.
  const handleToggleFavorite = async (e, businessId) => {
    e.stopPropagation();

    try {
      const isFavorite = await favoritesService.toggleFavorite(businessId);

      setFavoriteIds((prev) => {
        const next = new Set(prev);

        if (isFavorite) {
          next.add(businessId);
        } else {
          next.delete(businessId);
        }

        return next;
      });

      toast.success(
        isFavorite
          ? 'Guardado en favoritos'
          : 'Eliminado de favoritos'
      );
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar el favorito');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Lista única de categorías.
  const categories = useMemo(() => {
    const categorySet = new Set(
      businesses.map((business) => business.category).filter(Boolean)
    );

    return Array.from(categorySet).sort();
  }, [businesses]);

  // Filtrar negocios por nombre, descripción y categoría.
  const filtered = useMemo(() => {
    return businesses.filter((business) => {
      const searchTerm = search.trim().toLowerCase();

      const matchSearch =
        !searchTerm ||
        business.name?.toLowerCase().includes(searchTerm) ||
        business.description?.toLowerCase().includes(searchTerm);

      const matchCategory =
        !categoryFilter || business.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [businesses, search, categoryFilter]);

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">U</span>
          <div>
            <span>ReservaPro</span>
            <span className="business-tag">Mi Cuenta</span>
          </div>
        </>
      }
      navLinks={NAV_LINKS.map((link) => ({
        ...link,
        active: link.to === '/user/explorar',
      }))}
      user={user}
      onLogout={handleLogout}
      headerTitle="Explorar Negocios"
      headerSubtitle={`Descubre ${businesses.length} lugares cerca de ti`}
    >
      {loading && <LoadingState>Cargando negocios...</LoadingState>}

      {error && !loading && <ErrorBox>⚠️ {error}</ErrorBox>}

      {!loading && !error && (
        <>
          <Toolbar>
            <SearchWrapper>
              <Search size={16} />

              <SearchInput
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrapper>

            <FilterSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </FilterSelect>
          </Toolbar>

          {filtered.length === 0 && (
            <EmptyState>
              <Store size={48} />
              <p>
                {businesses.length === 0
                  ? 'Aún no hay negocios disponibles.'
                  : 'No encontramos negocios con esos filtros.'}
              </p>
            </EmptyState>
          )}

          {filtered.length > 0 && (
            <CardsGrid>
              {filtered.map((business) => {
                const isFavorite = favoriteIds.has(business.id);

                return (
                  <BusinessCard
                    key={business.id}
                    onClick={() =>
                      navigate(`/negocio/${business.slug}`)
                    }
                  >
                    <CardImage $url={business.cover_url}>
                      {!business.cover_url && (
                        <span className="initial">
                          {business.name?.[0]?.toUpperCase() || 'A'}
                        </span>
                      )}

                      <button
                        type="button"
                        aria-label={
                          isFavorite
                            ? `Quitar ${business.name} de favoritos`
                            : `Agregar ${business.name} a favoritos`
                        }
                        aria-pressed={isFavorite}
                        onClick={(e) =>
                          handleToggleFavorite(e, business.id)
                        }
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          zIndex: 2,
                          background: 'rgba(0, 0, 0, 0.5)',
                          backdropFilter: 'blur(4px)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                          color: isFavorite ? '#EF4444' : '#fff',
                        }}
                      >
                        <Heart
                          size={18}
                          fill={isFavorite ? '#EF4444' : 'none'}
                        />
                      </button>

                      <div
                        className="logo-overlay"
                        style={
                          business.logo_url
                            ? {
                                backgroundImage: `url(${business.logo_url})`,
                              }
                            : {}
                        }
                      >
                        {!business.logo_url &&
                          (business.name?.[0]?.toUpperCase() || 'A')}
                      </div>
                    </CardImage>

                    <CardBody>
                      <h3>{business.name}</h3>

                      {business.category && (
                        <span className="category">
                          📂 {business.category}
                        </span>
                      )}

                      <p className="description">
                        {business.description}
                      </p>

                      <div className="meta">
                        {business.city && (
                          <span>
                            <MapPin size={12} /> {business.city}
                          </span>
                        )}

                        {business.phone && (
                          <span>
                            <Phone size={12} /> {business.phone}
                          </span>
                        )}
                      </div>
                    </CardBody>
                  </BusinessCard>
                );
              })}
            </CardsGrid>
          )}
        </>
      )}
    </DashboardLayout>
  );
};
