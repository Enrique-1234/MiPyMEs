// src/components/common/Navbar/Navbar.jsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../context/AuthContext';
import { MorphOverlay } from './MorphOverlay/MorphOverlay';
import {
  NavHeader,
  NavProgress,
  LogoBrand,
  NavLinksGroup,
  NavActionsGroup,
  NavButton,
  LogoutButton,
  MenuButton
} from './Navbar.styles';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Navbar = () => {
  const { user, logout, getHomeRoute } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const barRef = useRef(null);

  // Animaciones de GSAP seguras con useGSAP
  useGSAP(() => {
    const header = headerRef.current;
    const bar = barRef.current;
    if (!header || !bar) return;

    const reduce = prefersReduced();

    // Animación de entrada inicial usando fromTo para asegurar que siempre quede visible (yPercent: 0)
    if (!reduce) {
      gsap.fromTo(
        header,
        { yPercent: -100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    } else {
      gsap.set(header, { yPercent: 0, opacity: 1 });
    }

    const setProgress = gsap.quickSetter(bar, 'scaleX');
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
      setScrolled(y > 20);

      if (!reduce) {
        const hide = y > last && y > 200;
        gsap.to(header, {
          yPercent: hide ? -100 : 0,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
      last = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, { scope: headerRef });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardRoute = getHomeRoute ? getHomeRoute() : '/dashboard';

  const menuLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Negocios', to: '/#negocios' },
    { label: 'Cómo funciona', to: '/#como-funciona' },
    { label: 'Mi reserva', to: '/mi-reserva' }, 
    user
      ? { label: 'Mi panel', to: dashboardRoute }
      : { label: 'Iniciar sesión', to: '/login' },
    ...(user ? [] : [{ label: 'Registrarse', to: '/registro' }])
  ];

  return (
    <>
      <NavHeader ref={headerRef} $scrolled={scrolled}>
        <LogoBrand to="/">
          <span className="logo-mark">A</span>
          <span>AlPunto</span>
        </LogoBrand>

        <NavLinksGroup>
          <a href="/#negocios">Negocios</a>
          <a href="/#como-funciona">Cómo funciona</a>
          <a href="/mi-reserva">Mi reserva</a>
          <a href="/#unete">Para tu negocio</a>
        </NavLinksGroup>

        <NavActionsGroup>
          {user ? (
            <>
              <NavButton to={dashboardRoute} $primary={true}>
                Mi Panel ({user.name || user.email})
              </NavButton>
              <LogoutButton onClick={handleLogout}>Cerrar sesión</LogoutButton>
            </>
          ) : (
            <>
              <NavButton to="/login">Iniciar sesión</NavButton>
              <NavButton to="/registro" $primary={true}>Registrarse</NavButton>
            </>
          )}
          <MenuButton
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </MenuButton>
        </NavActionsGroup>

        <NavProgress ref={barRef} aria-hidden="true" />
      </NavHeader>

      <MorphOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} links={menuLinks} />
    </>
  );
};