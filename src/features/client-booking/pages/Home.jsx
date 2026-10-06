import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import { publicBusinessesService } from '../services/publicBusinessesService';
import {
  HomeContainer, HeroSection, Blob, HeroInner, PinStage, MainTitle, Word, HeroLead,
  CTARow, CTAButton, FloatingChip, StatsRow, MarqueeWrap, MarqueeTrack, Section,
  StepsGrid, StepsLine, FilterBar, FilterChip, BusinessGrid, BusinessCard,
  Skeleton, EmptyState, FinalCTA
} from './Home.styles';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MARQUEE_ITEMS = ['Restaurantes', 'Belleza', 'Tiendas', 'Servicios', 'Salud', 'Educación', 'Mascotas', 'Hogar'];
const HERO_WORDS = 'Descubre los mejores comercios en'.split(' ');
const PIN_PATH = 'M50 8C30 8 16 23 16 42c0 24 34 50 34 50s34-26 34-50C84 23 70 8 50 8Z';

/* Hook para efecto magnético */
const useMagnetic = (strength = 0.35) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [strength]);
  return ref;
};

/* Tarjeta 3D con efecto de inclinación */
const TiltCard = ({ biz }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    if (prefersReduced()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--gx', `${x * 100}%`);
    el.style.setProperty('--gy', `${y * 100}%`);
    gsap.to(el, { rotateY: (x - 0.5) * 12, rotateX: (0.5 - y) * 12, scale: 1.03, transformPerspective: 900, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
  };

  return (
    <BusinessCard ref={ref} className="biz-card" onMouseMove={onMove} onMouseLeave={onLeave}>
      <span className="category-tag">{biz.category}</span>
      <h3>{biz.name}</h3>
      <p>{biz.description}</p>
      <a className="cta" href={`/negocio/${biz.slug}`} onClick={(e) => e.stopPropagation()}>
          Ver negocio
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </a>
    </BusinessCard>
  );
};

export const Home = () => {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');

  const primaryBtn = useMagnetic();
  const ghostBtn = useMagnetic();
  const finalBtn = useMagnetic(0.25);

  /* Carga de negocios reales desde Supabase */
useEffect(() => {
  let alive = true;
  const load = async () => {
    try {
      const data = await publicBusinessesService.list();
      if (alive) setBusinesses(data);
    } catch (err) {
      console.error('Error:', err);
      if (alive) setBusinesses([]);
    } finally {
      if (alive) setLoading(false);
    }
  };
  load();
  return () => { alive = false; };
}, []);

  /* Scroll suave */
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  /* Animación principal acotada estrictamente a heroRef */
  useGSAP(() => {
    if (prefersReduced()) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.pin-body', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .fromTo('.pin-fill', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo('.pin-dot', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, '-=0.3')
      .from('.hero-word > span', { yPercent: 115, rotate: 4, duration: 0.9, stagger: 0.07 }, 0.25)
      .from('.hero-lead, .hero-cta-item', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
      .from('.hero-chip', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.12 }, '-=0.5')
      .from('.stat', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');

    gsap.to('.pin-group', { y: -8, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
    gsap.fromTo('.ripple', { scale: 0.3, opacity: 0.8, transformOrigin: '50% 50%' },
      { scale: 1.7, opacity: 0, duration: 2.2, ease: 'power1.out', repeat: -1, stagger: 0.7, delay: 1.4 });

    gsap.utils.toArray('.stat-num').forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, { v: Number(el.dataset.value), duration: 2, ease: 'power2.out', delay: 1.2, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });

    gsap.fromTo('.steps-line-fill', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps-grid', start: 'top 70%', end: 'bottom 55%', scrub: true }
    });
    gsap.from('.step-item', {
      y: 50, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.steps-grid', start: 'top 80%' }
    });

    gsap.from('.final-cta', {
      scale: 0.92, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.final-cta', start: 'top 88%' }
    });
  }, { scope: heroRef });

  const categories = useMemo(() => ['Todos', ...new Set(businesses.map((b) => b.category))], [businesses]);
  const visible = useMemo(
    () => (filter === 'Todos' ? businesses : businesses.filter((b) => b.category === filter)),
    [businesses, filter]
  );

  /* Revelado animado de tarjetas (se ejecuta solo cuando hay elementos renderizados) */
  useGSAP(() => {
    if (prefersReduced() || !visible.length) return;
    gsap.set('.biz-card', { opacity: 0, y: 60 });
    ScrollTrigger.batch('.biz-card', {
      start: 'top 90%',
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
    });
  }, { scope: gridRef, dependencies: [visible] });

  const onHeroMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const marquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <>
      {/* Navbar fuera del scope de animación de GSAP */}
      <Navbar />

      <HomeContainer ref={heroRef}>
        <HeroSection onMouseMove={onHeroMove}>
          <Blob $color="#2563eb" $top="-10%" $left="-8%" $size={460} />
          <Blob $color="#06b6d4" $top="40%" $right="-10%" $size={380} $dur={18} />
          <Blob $color="#c9a227" $top="65%" $left="25%" $size={300} $dur={16} />

          <FloatingChip className="hero-chip" $top="26%" $left="9%" $delay={0}><i />Restaurantes</FloatingChip>
          <FloatingChip className="hero-chip" $top="55%" $left="6%" $dur={6} $delay={0.8} $color="#c9a227"><i />Belleza</FloatingChip>
          <FloatingChip className="hero-chip" $top="30%" $right="8%" $dur={5.5} $delay={0.4} $color="#06b6d4"><i />Servicios</FloatingChip>
          <FloatingChip className="hero-chip" $top="60%" $right="10%" $dur={6.5} $delay={1.2}><i />Tiendas</FloatingChip>

          <HeroInner>
            <PinStage aria-hidden="true">
              <svg viewBox="0 0 100 110">
                <defs>
                  <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" className="g1" />
                    <stop offset="100%" className="g2" />
                  </linearGradient>
                </defs>
                <ellipse className="ripple" cx="50" cy="100" rx="22" ry="6" />
                <ellipse className="ripple" cx="50" cy="100" rx="22" ry="6" />
                <g className="pin-group">
                  <path className="pin-fill" d={PIN_PATH} />
                  <path className="pin-body" d={PIN_PATH} pathLength="1" />
                  <circle className="pin-dot" cx="50" cy="42" r="12" />
                </g>
              </svg>
            </PinStage>

            <MainTitle aria-label="Descubre los mejores comercios en AlPunto">
              {HERO_WORDS.map((w, i) => (
                <React.Fragment key={i}>
                  <Word className="hero-word" aria-hidden="true"><span>{w}</span></Word>{' '}
                </React.Fragment>
              ))}
              <Word className="hero-word" $brand aria-hidden="true"><span>AlPunto</span></Word>
            </MainTitle>

            <HeroLead className="hero-lead">
              Encuentra, compara y contacta negocios locales de Nicolás Romero en un solo lugar. ¿Tienes uno? Hazlo visible hoy.
            </HeroLead>

            <CTARow className="hero-cta">
              <CTAButton className="hero-cta-item" ref={primaryBtn} href="#negocios">Explorar negocios</CTAButton>
              <CTAButton className="hero-cta-item" ref={ghostBtn} href="/registro" $variant="ghost">Registrar mi negocio</CTAButton>
            </CTARow>

            <StatsRow>
              <div className="stat"><strong><span className="stat-num" data-value="30">30</span>+</strong><span>negocios locales</span></div>
              <div className="stat"><strong><span className="stat-num" data-value="12">12</span></strong><span>categorías</span></div>
              <div className="stat"><strong><span className="stat-num" data-value="24">24</span>/7</strong><span>visibles en línea</span></div>
            </StatsRow>
          </HeroInner>
        </HeroSection>

        <MarqueeWrap aria-hidden="true">
          <MarqueeTrack>
            {marquee.map((m, i) => <span key={i}>{m}</span>)}
          </MarqueeTrack>
        </MarqueeWrap>

        <Section id="como-funciona">
          <h2>Tu negocio visible en tres pasos</h2>
          <p className="lead">Sin conocimientos técnicos. Empiezas en minutos.</p>
          <StepsGrid className="steps-grid">
            <StepsLine><div className="steps-line-fill" /></StepsLine>
            <div className="step-item"><div className="step-num">1</div><h3>Crea tu cuenta</h3><p>Regístrate y agrega los datos básicos de tu negocio.</p></div>
            <div className="step-item"><div className="step-num">2</div><h3>Publica tu catálogo</h3><p>Sube fotos, horarios, ubicación y tus productos o servicios.</p></div>
            <div className="step-item"><div className="step-num">3</div><h3>Recibe clientes</h3><p>La gente de tu zona te encuentra y te contacta directo.</p></div>
          </StepsGrid>
        </Section>

        <Section id="negocios">
          <h2>Comercios en Nicolás Romero</h2>
          <p className="lead">Explora por categoría y encuentra lo que necesitas cerca de ti.</p>

          {!loading && categories.length > 1 && (
            <FilterBar role="tablist" aria-label="Filtrar por categoría">
              {categories.map((c) => (
                <FilterChip key={c} $active={filter === c} onClick={() => setFilter(c)} role="tab" aria-selected={filter === c}>{c}</FilterChip>
              ))}
            </FilterBar>
          )}

          <BusinessGrid ref={gridRef}>
            {loading ? (
              Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
            ) : visible.length === 0 ? (
              <EmptyState>Aún no hay negocios en esta categoría. ¡Sé el primero en registrarte!</EmptyState>
            ) : (
              visible.map((biz) => <TiltCard key={biz.id} biz={biz} />)
            )}
          </BusinessGrid>
        </Section>

        <FinalCTA id="unete" className="final-cta">
          <h2>Haz que te encuentren AlPunto</h2>
          <p>Registra tu negocio gratis y aparece frente a los clientes que ya te están buscando.</p>
          <a ref={finalBtn} href="/registro">Registrar mi negocio</a>
        </FinalCTA>
      </HomeContainer>
    </>
  );
};