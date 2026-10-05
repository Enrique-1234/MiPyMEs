import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  OverlayRoot,
  OverlaySVG,
  MenuContent,
  MenuItemWrap,
  MenuLink,
  CloseButton,
  MenuFooter
} from './MorphOverlay.styles';

const NUM_POINTS = 10;
const NUM_PATHS = 3;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.2;

export const MorphOverlay = ({ isOpen, onClose, links = [] }) => {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const closeRef = useRef(null);
  const tlRef = useRef(null);
  const speedRef = useRef(1);
  const navigate = useNavigate();

  /* Construye UNA vez la timeline (pausada). Abrir = play, cerrar = reverse. */
  useEffect(() => {
    const paths = svgRef.current.querySelectorAll('.shape-overlays__path');
    const points = Array.from(paths, () => Array(NUM_POINTS).fill(100)); // 100 = oculto, 0 = cubre todo
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    speedRef.current = reduce ? 6 : 1;

    const render = () => {
      paths.forEach((path, i) => {
        const p = points[i];
        let d = `M 0 100 V ${p[0]} C`;
        for (let j = 0; j < NUM_POINTS - 1; j++) {
          const x = ((j + 1) / (NUM_POINTS - 1)) * 100;
          const cp = x - 50 / (NUM_POINTS - 1);
          d += ` ${cp} ${p[j]} ${cp} ${p[j + 1]} ${x} ${p[j + 1]}`;
        }
        path.setAttribute('d', `${d} V 100 H 0 Z`);
      });
    };
    render();

    const tl = gsap.timeline({
      paused: true,
      onUpdate: render,
      defaults: { ease: 'power2.inOut', duration: 0.8 }
    });

    const delays = Array.from({ length: NUM_POINTS }, () => Math.random() * DELAY_POINTS_MAX);
    for (let i = 0; i < NUM_PATHS; i++) {
      for (let j = 0; j < NUM_POINTS; j++) {
        tl.to(points[i], { [j]: 0 }, delays[j] + DELAY_PER_PATH * i);
      }
    }

    const root = rootRef.current;
    tl.fromTo(
      root.querySelectorAll('.menu-item'),
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
      '-=0.55'
    ).fromTo(root.querySelectorAll('.menu-extra'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

    tl.eventCallback('onReverseComplete', () => gsap.set(root, { visibility: 'hidden' }));
    tlRef.current = tl;

    return () => { tl.kill(); document.body.style.overflow = ''; };
  }, []);

  /* Abrir / cerrar */
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (isOpen) {
      gsap.set(rootRef.current, { visibility: 'visible' });
      tl.timeScale(speedRef.current).play();
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus({ preventScroll: true });
    } else if (tl.progress() > 0) {
      tl.timeScale(speedRef.current * 1.5).reverse();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  /* Cerrar con ESC */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Cierra primero y navega cuando el telón ya bajó */
  const handleLink = (e, to) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      if (to.includes('#')) window.location.assign(to);
      else navigate(to);
    }, 650);
  };

  return (
    <OverlayRoot ref={rootRef} role="dialog" aria-modal="true" aria-label="Menú principal">
      <OverlaySVG ref={svgRef} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="menuGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="menuGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path className="shape-overlays__path" fill="url(#menuGrad1)" />
        <path className="shape-overlays__path" fill="url(#menuGrad2)" />
        <path className="shape-overlays__path" fill="#0c1a4a" />
      </OverlaySVG>

      <CloseButton ref={closeRef} onClick={onClose} aria-label="Cerrar menú">
        <span /><span />
      </CloseButton>

      <MenuContent>
        {links.map((l) => (
          <MenuItemWrap key={l.to + l.label}>
            <MenuLink className="menu-item" href={l.to} onClick={(e) => handleLink(e, l.to)}>
              {l.label}
            </MenuLink>
          </MenuItemWrap>
        ))}
      </MenuContent>

      <MenuFooter className="menu-extra">
        <strong>AlPunto</strong>
        <span>Directorio de comercios de Nicolás Romero</span>
      </MenuFooter>
    </OverlayRoot>
  );
};
