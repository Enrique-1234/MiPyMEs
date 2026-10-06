// src/features/super-admin/pages/ZonesList.styles.js
import styled from 'styled-components';

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 1rem;

  a {
    color: ${({ theme }) => theme.colors.primary};
    &:hover { text-decoration: underline; }
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
`;

export const ZoneCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  .description {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSoft};
    line-height: 1.5;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    flex-wrap: wrap;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: ${({ $variant, theme }) => {
    if ($variant === 'success') return 'rgba(34, 197, 94, 0.15)';
    if ($variant === 'danger') return 'rgba(239, 68, 68, 0.15)';
    if ($variant === 'warning') return 'rgba(250, 204, 21, 0.15)';
    if ($variant === 'info') return 'rgba(56, 189, 248, 0.15)';
    return 'rgba(148, 163, 184, 0.15)';
  }};
  color: ${({ $variant, theme }) => {
    if ($variant === 'success') return theme.colors.success;
    if ($variant === 'danger') return theme.colors.error;
    if ($variant === 'warning') return theme.colors.warning;
    if ($variant === 'info') return theme.colors.info;
    return theme.colors.textSoft;
  }};
`;

export const SmallButton = styled.button`
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSoft};
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    border-color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.primary)};
    color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.primary)};
  }
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
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
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