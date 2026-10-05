import styled, { keyframes, css } from 'styled-components';

const float = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}`;
const drift = keyframes`0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,-35px) scale(1.18)}`;
const shimmer = keyframes`to{background-position:200% center}`;
const marquee = keyframes`to{transform:translateX(-50%)}`;
const sweep = keyframes`0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}`;
const gradientShift = keyframes`0%,100%{background-position:0% 50%}50%{background-position:100% 50%}`;
const skeleton = keyframes`to{background-position:-200% 0}`;

const mix = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export const HomeContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: clip;
  background-color: ${({ theme }) => theme.colors.background};

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

/* ───────────── HERO ───────────── */
export const HeroSection = styled.section`
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 8rem 1.5rem 5rem;
  text-align: center;
  overflow: hidden;

  /* Spotlight que sigue al mouse */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(
      650px circle at var(--mx, 50%) var(--my, 35%),
      ${({ theme }) => mix(theme.colors.primary, 20)},
      transparent 60%
    );
  }

  /* Malla de puntos que se desvanece en los bordes */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    background-image: radial-gradient(${({ theme }) => mix(theme.colors.text, 16)} 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse at center, #000 25%, transparent 72%);
  }
`;

export const Blob = styled.div`
  position: absolute;
  z-index: -3;
  width: ${({ $size }) => $size || 420}px;
  height: ${({ $size }) => $size || 420}px;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  right: ${({ $right }) => $right};
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(90px);
  opacity: 0.35;
  animation: ${drift} ${({ $dur }) => $dur || 14}s ease-in-out infinite;
`;

export const HeroInner = styled.div`
  position: relative;
  max-width: 920px;
  z-index: 2;
`;

export const PinStage = styled.div`
  width: 130px;
  height: 150px;
  margin: 0 auto 1.25rem;

  svg { width: 100%; height: 100%; overflow: visible; }
  .g1 { stop-color: ${({ theme }) => theme.colors.primary}; }
  .g2 { stop-color: ${({ theme }) => theme.colors.accent}; }
  .pin-body {
    fill: none;
    stroke: ${({ theme }) => theme.colors.primary};
    stroke-width: 3.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
  }
  .pin-fill { fill: url(#pinGrad); }
  .pin-dot { fill: #fff; }
  .ripple { fill: none; stroke: ${({ theme }) => theme.colors.primary}; stroke-width: 1.6; }
`;

export const MainTitle = styled.h1`
  font-size: clamp(2.6rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const Word = styled.span`
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding: 0 0.12em 0.14em;
  margin-bottom: -0.14em;

  > span { display: inline-block; will-change: transform; }

  ${({ $brand, theme }) =>
    $brand &&
    css`
    > span {
      background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.primary});
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: ${shimmer} 4s linear infinite;
    }
  `}
`;

export const HeroLead = styled.p`
  max-width: 560px;
  margin: 0 auto;
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const CTARow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.25rem;
`;

export const CTAButton = styled.a`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  will-change: transform;

  ${({ $variant, theme }) =>
    $variant === 'ghost'
      ? css`
    color: ${theme.colors.text};
    border: 1.5px solid ${theme.colors.border};
    background: ${theme.colors.surface};
    transition: border-color .25s, color .25s;
    &:hover { border-color: ${theme.colors.primary}; color: ${theme.colors.primary}; }
  `
      : css`
    color: #fff;
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark});
    box-shadow: 0 14px 30px -10px ${mix(theme.colors.primary, 70)};
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.5) 50%, transparent 70%);
      animation: ${sweep} 3.2s ease-in-out infinite;
    }
  `}

  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.accent}; outline-offset: 3px; }
`;

export const FloatingChip = styled.div`
  position: absolute;
  z-index: 1;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  right: ${({ $right }) => $right};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 16px 30px -14px ${({ theme }) => mix(theme.colors.primary, 45)};
  animation: ${float} ${({ $dur }) => $dur || 5}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || 0}s;

  i {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${({ $color, theme }) => $color || theme.colors.primary};
  }

  @media (max-width: 1000px) { display: none; }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 640px;
  margin: 3.5rem auto 0;

  .stat strong {
    display: block;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 800;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .stat span { font-size: 0.85rem; color: ${({ theme }) => theme.colors.textSoft}; }
`;

/* ───────────── MARQUEE ───────────── */
export const MarqueeWrap = styled.div`
  overflow: hidden;
  padding: 1.2rem 0;
  border-block: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
`;

export const MarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  gap: 3rem;
  animation: ${marquee} 32s linear infinite;
  &:hover { animation-play-state: paused; }

  span {
    display: inline-flex;
    align-items: center;
    gap: 3rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSoft};
    white-space: nowrap;
  }
  span::after {
    content: '';
    width: 10px; height: 10px; border-radius: 50%;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  }
`;

/* ───────────── SECCIONES ───────────── */
export const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 1.5rem 2rem;
  scroll-margin-top: 80px;
  text-align: center;

  h2 {
    font-size: clamp(1.9rem, 4.5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.75rem;
  }
  .lead {
    max-width: 520px;
    margin: 0 auto;
    color: ${({ theme }) => theme.colors.textSoft};
    line-height: 1.6;
  }
`;

export const StepsGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3.5rem;

  @media (max-width: 800px) { grid-template-columns: 1fr; }

  .step-item h3 { margin: 1.25rem 0 0.5rem; font-size: 1.2rem; font-weight: 700; color: ${({ theme }) => theme.colors.text}; }
  .step-item p { max-width: 280px; margin: 0 auto; font-size: 0.95rem; line-height: 1.55; color: ${({ theme }) => theme.colors.textSoft}; }
  .step-num {
    position: relative;
    z-index: 2;
    width: 56px; height: 56px;
    margin: 0 auto;
    display: grid; place-items: center;
    border-radius: 50%;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    box-shadow: 0 0 0 6px ${({ theme }) => theme.colors.background}, 0 12px 24px -8px ${({ theme }) => mix(theme.colors.primary, 60)};
  }
`;

export const StepsLine = styled.div`
  position: absolute;
  top: 27px;
  left: 16.6%;
  right: 16.6%;
  height: 3px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.border};
  @media (max-width: 800px) { display: none; }

  .steps-line-fill {
    height: 100%;
    transform-origin: left;
    border-radius: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  }
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 2rem;
`;

export const FilterChip = styled.button`
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text)};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  &:hover { transform: translateY(-2px); border-color: ${({ theme }) => theme.colors.primary}; }
  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.accent}; outline-offset: 2px; }
`;

export const BusinessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
  max-width: 1300px;
  margin: 2.5rem auto 0;
  padding: 0 1rem 3rem;
  text-align: left;
`;

export const BusinessCard = styled.article`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: 1.75rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  will-change: transform;
  transition: border-color 0.3s, box-shadow 0.3s;

  /* Brillo que sigue al cursor */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
    background: radial-gradient(
      320px circle at var(--gx, 50%) var(--gy, 0%),
      ${({ theme }) => mix(theme.colors.primary, 18)},
      transparent 60%
    );
  }
  &:hover::before { opacity: 1; }
  &:hover {
    border-color: ${({ theme }) => mix(theme.colors.primary, 55)};
    box-shadow: 0 30px 50px -22px ${({ theme }) => mix(theme.colors.primary, 45)};
  }

  .category-tag {
    display: inline-block;
    margin-bottom: 0.9rem;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => mix(theme.colors.primary, 10)};
  }
  h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem; color: ${({ theme }) => theme.colors.text}; }
  p { font-size: 0.9rem; line-height: 1.55; color: ${({ theme }) => theme.colors.textSoft}; }
  .cta {
    display: inline-flex; align-items: center; gap: 0.4rem;
    margin-top: 1.25rem;
    font-weight: 700; font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.primary};
  }
  .cta svg { width: 16px; height: 16px; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  &:hover .cta svg { transform: translateX(6px); }
`;

export const Skeleton = styled.div`
  height: 200px;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => mix(theme.colors.primary, 8)} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${skeleton} 1.4s linear infinite;
`;

export const EmptyState = styled.p`
  grid-column: 1 / -1;
  padding: 3rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};
`;

/* ───────────── CTA FINAL ───────────── */
export const FinalCTA = styled.section`
  position: relative;
  overflow: hidden;
  max-width: 1100px;
  margin: 3rem auto 6rem;
  padding: 4.5rem 1.5rem;
  border-radius: 32px;
  text-align: center;
  color: #fff;
  scroll-margin-top: 90px;
  background: linear-gradient(120deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.primary});
  background-size: 300% 300%;
  animation: ${gradientShift} 10s ease infinite;

  &::before {
    content: '';
    position: absolute;
    width: 420px; height: 420px;
    right: -120px; top: -160px;
    border-radius: 50%;
    border: 60px solid rgba(255, 255, 255, 0.1);
  }
  h2 { position: relative; font-size: clamp(1.9rem, 4.5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.75rem; }
  p { position: relative; max-width: 480px; margin: 0 auto 2rem; opacity: 0.92; line-height: 1.6; }

  a {
    position: relative;
    display: inline-block;
    padding: 1rem 2.25rem;
    border-radius: 14px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primaryDark};
    background: #fff;
    will-change: transform;
    box-shadow: 0 16px 30px -12px rgba(0, 0, 0, 0.35);
  }
  a:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }
`;
