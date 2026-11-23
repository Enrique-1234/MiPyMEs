// src/features/business-admin/pages/ReservationsList.styles.js
import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  outline: none;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const ChipsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`;

export const Chip = styled.button`
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active }) => ($active ? '#fff' : 'inherit')};
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ReservationCard = styled.article`
  display: grid;
  grid-template-columns: 90px 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.15s;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
`;

export const DateBlock = styled.div`
  text-align: center;
  padding: 0.5rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};

  .day {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1;
  }
  .month {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: 0.15rem;
  }
  .time {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: 0.3rem;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    text-align: left;

    .day { font-size: 1.15rem; }
    .month { margin-top: 0; }
    .time { margin-top: 0; margin-left: auto; }
  }
`;

export const InfoBlock = styled.div`
  min-width: 0;

  .guest {
    font-size: 1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.2rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.textSoft};

    span {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
  }

  .code {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: 0.35rem;
    letter-spacing: 0.05em;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  white-space: nowrap;
  background: ${({ $status }) => {
    const map = {
      pending: 'rgba(250, 204, 21, 0.15)',
      confirmed: 'rgba(34, 197, 94, 0.15)',
      seated: 'rgba(56, 189, 248, 0.15)',
      completed: 'rgba(148, 163, 184, 0.15)',
      cancelled: 'rgba(239, 68, 68, 0.15)',
      no_show: 'rgba(239, 68, 68, 0.2)',
    };
    return map[$status] || 'rgba(148, 163, 184, 0.15)';
  }};
  color: ${({ $status, theme }) => {
    const map = {
      pending: '#FACC15',
      confirmed: '#22C55E',
      seated: '#38BDF8',
      completed: '#94A3B8',
      cancelled: '#EF4444',
      no_show: '#EF4444',
    };
    return map[$status] || theme.colors.textSoft;
  }};
`;

export const StatusSelect = styled.select`
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  min-width: 140px;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 900px) {
    width: 100%;
    min-width: 0;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
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