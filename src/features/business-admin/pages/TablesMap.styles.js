// src/features/business-admin/pages/TablesMap.styles.js
import styled from 'styled-components';

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

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSoft};

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .dot.bookable { background: ${({ theme }) => theme.colors.primary}; }
  .dot.not-bookable { background: rgba(148, 163, 184, 0.5); }
  .dot.locked { background: rgba(148, 163, 184, 0.5); border: 1px dashed #94A3B8; }
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
  transform-origin: top left;
  transform: ${({ $scale }) => `scale(${$scale || 1})`};
  transition: transform 0.2s ease;

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
  z-index: 1;
  cursor: pointer;
  transition: transform 0.15s, filter 0.15s;

  background: ${({ $bookable, theme }) =>
    $bookable ? theme.colors.primary : 'rgba(148, 163, 184, 0.35)'};
  border: 2px solid
    ${({ $bookable, theme }) =>
      $bookable ? theme.colors.primaryDark : 'rgba(148, 163, 184, 0.6)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  border-radius: ${({ $shape }) => {
    if ($shape === 'circle') return '50%';
    if ($shape === 'oval') return '50% / 35%';
    if ($shape === 'square') return '8px';
    return '10px';
  }};

  &:hover {
    filter: brightness(1.15);
    transform: translate(-50%, -50%) scale(1.05);
    z-index: 5;
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
  .lock-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    opacity: 0.7;
  }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;

  .stat-box {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};

    .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: ${({ theme }) => theme.colors.textSoft};
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
      line-height: 1;
    }
  }
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

  svg { opacity: 0.3; margin-bottom: 1rem; }
  p { font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.5rem; }
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    &:hover { text-decoration: underline; }
  }
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

// ===== Modal de detalle de mesa =====
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  padding: 1.5rem;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);

  h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1rem;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.85rem;

  &:last-of-type { border-bottom: none; }

  .label {
    color: ${({ theme }) => theme.colors.textSoft};
    flex-shrink: 0;
  }
  .value {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    text-align: right;
    overflow-wrap: break-word;
    min-width: 0;
  }
`;