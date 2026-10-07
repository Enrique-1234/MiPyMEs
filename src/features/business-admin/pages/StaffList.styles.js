// src/features/business-admin/pages/StaffList.styles.js
import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;

  .spacer { flex: 1; }
`;

export const PrimaryButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const StaffCard = styled.article`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.15s;
  min-width: 0;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  @media (max-width: 800px) {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 0.75rem;
    padding: 1rem;

    > *:nth-child(3),
    > *:nth-child(4) {
      grid-column: 1 / -1;
    }
  }
`;

export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryDark});
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.15rem;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(255, 107, 0, 0.3);
`;

export const InfoBlock = styled.div`
  min-width: 0;

  .name {
    font-size: 1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .email {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: 0.15rem;
    overflow-wrap: break-word;
    word-break: break-all;
  }

  .date {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: 0.3rem;
    opacity: 0.7;
  }
`;

export const RoleSelect = styled.select`
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  min-width: 120px;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const ActionsCell = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const SmallButton = styled.button`
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSoft};
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
  flex: 0 0 auto;

  &:hover:not(:disabled) {
    border-color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.primary)};
    color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.primary)};
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: ${({ $variant }) => {
    if ($variant === 'success') return 'rgba(34, 197, 94, 0.15)';
    if ($variant === 'danger') return 'rgba(239, 68, 68, 0.15)';
    if ($variant === 'warning') return 'rgba(250, 204, 21, 0.15)';
    return 'rgba(148, 163, 184, 0.15)';
  }};
  color: ${({ $variant, theme }) => {
    if ($variant === 'success') return theme.colors.success;
    if ($variant === 'danger') return theme.colors.error;
    if ($variant === 'warning') return theme.colors.warning;
    return theme.colors.textSoft;
  }};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};

  svg { opacity: 0.3; margin-bottom: 1rem; }
  p { font-size: 0.95rem; line-height: 1.6; }
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

export const InfoBox = styled.div`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: ${({ theme }) => theme.colors.info};
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
`;