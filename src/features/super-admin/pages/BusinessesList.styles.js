// src/features/super-admin/pages/BusinessesList.styles.js
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

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
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

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
`;

export const Card = styled.article`
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
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.15rem;
  }

  .slug {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
    font-family: monospace;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }

.actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
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
    return 'rgba(148, 163, 184, 0.15)';
  }};
  color: ${({ $variant, theme }) => {
    if ($variant === 'success') return theme.colors.success;
    if ($variant === 'danger') return theme.colors.error;
    if ($variant === 'warning') return theme.colors.warning;
    return theme.colors.textSoft;
  }};
`;

export const SmallButton = styled.button`
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSoft};
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  white-space: nowrap;
  flex: 0 0 auto;
  min-width: max-content;
  overflow: visible;
  text-overflow: clip;

  &:hover {
    border-color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.primary)};
    color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.primary)};
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