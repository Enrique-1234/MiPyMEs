// src/features/super-admin/pages/FloorEditor.styles.js
import styled from 'styled-components';

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 1rem;
  flex-wrap: wrap;

  a {
    color: ${({ theme }) => theme.colors.primary};
    &:hover { text-decoration: underline; }
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.25rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  .spacer { flex: 1; }
`;

export const ZoneSelect = styled.select`
  padding: 0.6rem 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const Button = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1.5px solid transparent;

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  ${({ $variant, theme }) => {
    if ($variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: #fff;
        &:hover:not(:disabled) { background: ${theme.colors.primaryDark}; }
      `;
    }
    if ($variant === 'danger') {
      return `
        background: transparent;
        border-color: ${theme.colors.error};
        color: ${theme.colors.error};
        &:hover:not(:disabled) { background: ${theme.colors.error}; color: #fff; }
      `;
    }
    return `
      background: transparent;
      border-color: ${theme.colors.border};
      color: ${theme.colors.text};
      &:hover:not(:disabled) {
        border-color: ${theme.colors.primary};
        color: ${theme.colors.primary};
      }
    `;
  }}
`;

export const DirtyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(250, 204, 21, 0.15);
  color: ${({ theme }) => theme.colors.warning};
  border: 1px solid rgba(250, 204, 21, 0.4);
`;

export const CanvasOuter = styled.div`
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;
  overflow: auto;
  max-width: 100%;

  &::-webkit-scrollbar { width: 12px; height: 12px; }
  &::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.background}; border-radius: 8px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    &:hover { background: ${({ theme }) => theme.colors.primary}; }
  }

  @media (max-width: 900px) {
    padding: 0.5rem;
  }
`;

export const Canvas = styled.div`
  position: relative;
  width: ${({ $w }) => `${$w}px`};
  height: ${({ $h }) => `${$h}px`};
  background: ${({ theme }) => theme.colors.background};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 40px 40px;

  /* Zoom en móvil para que quepa */
  transform-origin: top left;
  transform: ${({ $scale }) => `scale(${$scale || 1})`};
  transition: transform 0.2s ease;

  /* Guía central vertical */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 107, 0, 0.15);
    pointer-events: none;
  }

  /* Guía central horizontal */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 107, 0, 0.15);
    pointer-events: none;
  }
`;

export const EmptyCanvasMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};
  pointer-events: none;
  font-size: 0.9rem;
  opacity: 0.6;
`;

export const TableShape = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  font-size: 0.7rem;
  font-weight: 800;
  color: #fff;
  text-align: center;
  user-select: none;
  z-index: ${({ $dragging }) => ($dragging ? 1000 : 1)};
  cursor: ${({ $movable }) => ($movable ? 'grab' : 'not-allowed')};
  transition: box-shadow 0.15s, filter 0.15s;

  /* Sombra y color según estado */
  background: ${({ $bookable, theme }) =>
    $bookable ? theme.colors.primary : 'rgba(148, 163, 184, 0.35)'};
  border: 2px solid
    ${({ $bookable, theme }) =>
      $bookable ? theme.colors.primaryDark : 'rgba(148, 163, 184, 0.6)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  /* Formas */
  border-radius: ${({ $shape }) => {
    if ($shape === 'circle') return '50%';
    if ($shape === 'oval') return '50% / 35%';
    if ($shape === 'square') return '8px';
    return '10px'; // rectangle
  }};

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }

  /* Cuando se está arrastrando (clase que agrega GSAP) */
  &.dragging {
    cursor: grabbing !important;
    box-shadow: 0 12px 30px rgba(255, 107, 0, 0.5);
    filter: brightness(1.15);
    z-index: 1000;
  }

  .table-name {
    font-size: 0.85rem;
    line-height: 1;
  }
  .table-cap {
    font-size: 0.65rem;
    opacity: 0.9;
    font-weight: 600;
  }

  /* Candado para mesas no movibles */
  .lock-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    opacity: 0.7;
  }
`;

export const CoordinatesBadge = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);

  span { color: ${({ theme }) => theme.colors.primary}; }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const ErrorBox = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;