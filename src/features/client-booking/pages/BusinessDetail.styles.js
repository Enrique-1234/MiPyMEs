// src/features/client-booking/pages/BusinessDetail.styles.js
import styled from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding-top: 70px;
  color: ${({ theme }) => theme.colors.text};
  overflow-x: hidden;      /* ⬅️ NUEVO: evita scroll horizontal */
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 700px) {
    padding: 1rem 1rem 3rem;
  }
`;

export const HeroCard = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 2rem;
  min-height: 260px;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  background: ${({ $cover }) =>
    $cover
      ? `url(${$cover}) center/cover no-repeat`
      : 'linear-gradient(135deg, #FF6B00 0%, #FF2E93 50%, #CC5500 100%)'};

  @media (max-width: 700px) {
    min-height: 180px;
    padding: 1.25rem 1rem;
    margin-bottom: 1.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 60%);
    pointer-events: none;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const Logo = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 16px;
  background: ${({ $src }) => ($src ? `url(${$src}) center/cover` : '#0A0A0A')};
  border: 3px solid #fff;
  display: grid;
  place-items: center;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);

  @media (max-width: 700px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

export const HeroInfo = styled.div`
  flex: 1;
  min-width: 0;              /* ⬅️ NUEVO: permite que el texto se encoja */
  color: #fff;

  h1 {
    font-size: clamp(1.5rem, 3.5vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
    overflow-wrap: break-word;    /* ⬅️ NUEVO: rompe palabras largas */
    word-break: break-word;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    font-size: 0.9rem;
    opacity: 0.95;
    color: rgba(255, 255, 255, 0.9);

    span {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      overflow-wrap: break-word;
      word-break: break-word;
    }
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;    /* ⬅️ NUEVO: minmax(0, 1fr) */
  gap: 2rem;
  align-items: start;
  width: 100%;
  box-sizing: border-box;

  /* ⬅️ NUEVO: los hijos del grid deben poder encogerse */
  > * {
    min-width: 0;
  }

  @media (max-width: 950px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  min-width: 0;
  overflow-wrap: break-word;    /* ⬅️ NUEVO */
  word-break: break-word;

  h2 {
    font-size: 1.15rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textSoft};
    overflow-wrap: break-word;
    word-break: break-word;
  }

  @media (max-width: 700px) {
    padding: 1.25rem 1rem;
  }
`;

export const InfoList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSoft};
    line-height: 1.5;
    min-width: 0;

    svg {
      flex-shrink: 0;
      margin-top: 2px;
      color: ${({ theme }) => theme.colors.primary};
    }

    span {
      min-width: 0;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    a {
      color: ${({ theme }) => theme.colors.text};
      overflow-wrap: break-word;
      word-break: break-all;
      &:hover { color: ${({ theme }) => theme.colors.primary}; }
    }
  }
`;

export const HoursList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background};
    font-size: 0.875rem;
    min-width: 0;

    &.today {
      background: color-mix(in srgb, ${({ theme }) => theme.colors.primary} 15%, transparent);
      border: 1px solid ${({ theme }) => theme.colors.primary};
      font-weight: 700;
    }

    > span:first-child {
      color: ${({ theme }) => theme.colors.text};
      flex-shrink: 0;              /* ⬅️ NUEVO: "Lunes" no se encoge */
      white-space: nowrap;
    }
  }

  @media (max-width: 500px) {
    li {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
      padding: 0.6rem 0.75rem;
    }
  }
`;

export const HoursTime = styled.span`
  color: ${({ $closed, theme }) =>
    $closed ? theme.colors.error : theme.colors.textSoft};
  font-weight: 600;
  text-align: right;
  font-size: 0.85rem;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;

  @media (max-width: 500px) {
    text-align: left;
    width: 100%;
  }
`;

export const ReservationCard = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  position: sticky;
  top: 90px;
  min-width: 0;
  overflow-wrap: break-word;

  h2 {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.text};
  }

  @media (max-width: 950px) {
    position: static;
  }

  @media (max-width: 700px) {
    padding: 1.25rem 1rem;
  }
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 0.6rem;
`;

export const PartySizeStepper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1.25rem;

  button {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.25rem;
    font-weight: 700;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.15s;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary};
      color: #fff;
    }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
  }

  .value {
    text-align: center;
    flex: 1;

    strong {
      display: block;
      font-size: 1.5rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
      line-height: 1;
    }
    span {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.colors.textSoft};
    }
  }
`;

export const DateScroller = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.25rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} transparent;

  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  /* ⬅️ NUEVO: no permitir que el scroll horizontal empuje el padre */
  max-width: 100%;
  min-width: 0;
`;

export const DateChip = styled.button`
  flex: 0 0 auto;
  min-width: 64px;
  padding: 0.6rem 0.5rem;
  border-radius: 12px;
  border: 1.5px solid ${({ $active, $disabled, theme }) =>
    $disabled
      ? 'transparent'
      : $active
      ? theme.colors.primary
      : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active, $disabled, theme }) =>
    $disabled
      ? theme.colors.textSoft
      : $active
      ? '#fff'
      : theme.colors.text};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  transition: all 0.15s;

  .day {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.75;
  }
  .num {
    font-size: 1.1rem;
    font-weight: 800;
  }

  &:hover:not(:disabled) {
    border-color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.primary)};
  }
`;

export const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.6rem;
  margin-top: 0.5rem;

  @media (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 0.5rem;
  }
`;

export const SlotButton = styled.button`
  padding: 0.75rem 0.5rem;
  border-radius: 10px;
  border: 1.5px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.background};
  color: ${({ $selected }) => ($selected ? '#fff' : 'inherit')};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

export const HelperText = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: center;
  padding: 1rem 0;
  margin: 0;
`;

export const ErrorBox = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textSoft};

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 1rem;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;