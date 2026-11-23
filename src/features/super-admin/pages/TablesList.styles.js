// src/features/super-admin/pages/TablesList.styles.js
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
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const CanvasPreview = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  margin-bottom: 1.5rem;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;

  .empty-preview {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.9rem;
    gap: 0.5rem;
  }
`;

export const PreviewTable = styled.div`
  position: absolute;
  left: ${({ $x }) => `${$x / 10}%`};
  top: ${({ $y }) => `${$y / 8}%`};
  width: ${({ $w }) => `${$w / 5}px`};
  height: ${({ $h }) => `${$h / 5}px`};
  min-width: 30px;
  min-height: 30px;
  border-radius: ${({ $shape }) =>
    $shape === 'circle' ? '50%' : $shape === 'oval' ? '50% / 35%' : '8px'};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'rgba(148, 163, 184, 0.2)'};
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primaryDark : theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#fff' : '#94a3b8')};
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform 0.15s;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    z-index: 2;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

export const TableCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: border-color 0.2s;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;

    h3 {
      font-size: 1rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding-top: 0.6rem;
    margin-top: 0.25rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: ${({ $variant }) => {
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
  padding: 0.4rem 0.7rem;
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
  gap: 0.3rem;
  white-space: nowrap;
  flex: 0 0 auto;

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