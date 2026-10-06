// src/features/business-admin/pages/ReservationsCalendar.styles.js
import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  .week-range {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    h2 {
      font-size: 1.15rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
    }
    p {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.textSoft};
    }
  }

  .nav-buttons {
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }
`;

export const NavButton = styled.button`
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $primary, theme }) =>
    $primary &&
    `
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    color: #fff;
    &:hover { background: ${theme.colors.primaryDark}; color: #fff; }
  `}
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.6rem;
  min-width: 0;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(7, minmax(160px, 1fr));
    min-width: 1100px;
  }
`;

export const DayColumn = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  flex-direction: column;

  ${({ $today, theme }) =>
    $today &&
    `
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 1px ${theme.colors.primary};
  `}
`;

export const DayHeader = styled.div`
  padding: 0.75rem 0.6rem;
  background: ${({ $today, theme }) =>
    $today ? theme.colors.primary : theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;

  .day-name {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ $today }) => ($today ? '#fff' : '#94A3B8')};
    font-weight: 700;
    opacity: ${({ $today }) => ($today ? 0.9 : 1)};
  }

  .day-num {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${({ $today, theme }) => ($today ? '#fff' : theme.colors.text)};
    line-height: 1.1;
    margin-top: 0.15rem;
  }

  .day-stats {
    font-size: 0.7rem;
    color: ${({ $today }) => ($today ? 'rgba(255,255,255,0.85)' : '#94A3B8')};
    margin-top: 0.35rem;
    font-weight: 600;
  }
`;

export const DayBody = styled.div`
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
  max-height: 500px;
`;

export const EmptyDay = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 0.75rem;
  opacity: 0.5;
  padding: 1rem 0.5rem;
  text-align: center;
`;

export const ReservationChip = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background: ${({ $status }) => {
    const map = {
      pending: 'rgba(250, 204, 21, 0.12)',
      confirmed: 'rgba(34, 197, 94, 0.12)',
      seated: 'rgba(56, 189, 248, 0.12)',
      completed: 'rgba(148, 163, 184, 0.1)',
      cancelled: 'rgba(239, 68, 68, 0.1)',
      no_show: 'rgba(239, 68, 68, 0.15)',
    };
    return map[$status] || 'rgba(148, 163, 184, 0.1)';
  }};
  border-color: ${({ $status }) => {
    const map = {
      pending: 'rgba(250, 204, 21, 0.3)',
      confirmed: 'rgba(34, 197, 94, 0.3)',
      seated: 'rgba(56, 189, 248, 0.3)',
      completed: 'rgba(148, 163, 184, 0.2)',
      cancelled: 'rgba(239, 68, 68, 0.25)',
      no_show: 'rgba(239, 68, 68, 0.35)',
    };
    return map[$status] || 'rgba(148, 163, 184, 0.2)';
  }};
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  color: inherit;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .time {
    font-size: 0.7rem;
    font-weight: 800;
    color: ${({ $status }) => {
      const map = {
        pending: '#FACC15',
        confirmed: '#22C55E',
        seated: '#38BDF8',
        completed: '#94A3B8',
        cancelled: '#EF4444',
        no_show: '#EF4444',
      };
      return map[$status] || '#94A3B8';
    }};
    letter-spacing: 0.02em;
  }

  .name {
    font-size: 0.78rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-top: 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .party {
    font-size: 0.68rem;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: 0.1rem;
  }
`;

export const LoadingState = styled.div`
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

// ===== Modal de detalle de reserva =====
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
`;

export const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.25rem;
  }

  .code {
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-bottom: 1.25rem;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.85rem;

  &:last-of-type {
    border-bottom: none;
  }

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

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;