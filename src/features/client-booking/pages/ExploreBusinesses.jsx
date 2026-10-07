// src/features/client-booking/pages/ExploreBusinesses.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Calendar, Search, Heart, User as UserIcon,
  MapPin, Phone, Store,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from '../../../components/common/DashboardLayout/DashboardLayout';
import { publicBusinessesService } from '../services/publicBusinessesService';
import {
  Toolbar, SearchInput, SearchWrapper, FilterSelect, CardsGrid,
  BusinessCard, CardImage, CardBody, EmptyState, LoadingState, ErrorBox,
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

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await publicBusinessesService.list();
        if (alive) setBusinesses(data);
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

  // Lista única de categorías
  const categories = useMemo(() => {
    const set = new Set(businesses.map((b) => b.category).filter(Boolean));
    return Array.from(set).sort();
  }, [businesses]);

  // Filtrar
  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const matchSearch =
        !search.trim() ||
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.description?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        !categoryFilter || b.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [businesses, search, categoryFilter]);

  return (
    <DashboardLayout
      sidebarLogo={
        <>
          <span className="badge-icon">U</span>
          <div>
            <span>AlPunto</span>
            <span className="business-tag">Mi Cuenta</span>
          </div>
        </>
      }
      navLinks={NAV_LINKS.map((l) => ({ ...l, active: l.to === '/user/explorar' }))}
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
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
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
              {filtered.map((b) => (
                <BusinessCard
                  key={b.id}
                  onClick={() => navigate(`/negocio/${b.slug}`)}
                >
                  <CardImage $url={b.cover_url}>
                    {!b.cover_url && (
                      <span className="initial">
                        {b.name?.[0]?.toUpperCase() || 'A'}
                      </span>
                    )}
                    <div
                      className="logo-overlay"
                      style={b.logo_url ? { backgroundImage: `url(${b.logo_url})` } : {}}
                    >
                      {!b.logo_url && (b.name?.[0]?.toUpperCase() || 'A')}
                    </div>
                  </CardImage>

                  <CardBody>
                    <h3>{b.name}</h3>
                    {b.category && (
                      <span className="category">
                        📂 {b.category}
                      </span>
                    )}
                    <p className="description">{b.description}</p>

                    <div className="meta">
                      {b.city && (
                        <span>
                          <MapPin size={12} /> {b.city}
                        </span>
                      )}
                      {b.phone && (
                        <span>
                          <Phone size={12} /> {b.phone}
                        </span>
                      )}
                    </div>
                  </CardBody>
                </BusinessCard>
              ))}
            </CardsGrid>
          )}
        </>
      )}
    </DashboardLayout>
  );
};