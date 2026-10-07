// src/features/business-admin/pages/MenuList.styles.js
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
  white-space: nowrap;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryDark}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const SmallButton = styled.button`
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.78rem;
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

export const CategoryBlock = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
  flex-wrap: wrap;

  .title-block {
    min-width: 0;
    flex: 1;

    h3 {
      font-size: 1.1rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
      overflow-wrap: break-word;
      word-break: break-word;
    }
    p {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.textSoft};
      margin-top: 0.15rem;
    }
  }

  .actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ItemRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  transition: background 0.15s;
  min-width: 0;

  &:hover {
    background: color-mix(in srgb, ${({ theme }) => theme.colors.primary} 5%, ${({ theme }) => theme.colors.background});
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .info {
    min-width: 0;

    .name {
      font-size: 0.95rem;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.text};
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .desc {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.textSoft};
      margin-top: 0.15rem;
      line-height: 1.4;
      overflow-wrap: break-word;
    }
  }

  .price {
    font-size: 0.95rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
  }

  .actions {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    justify-content: flex-end;

    @media (max-width: 600px) {
      justify-content: flex-start;
      padding-top: 0.5rem;
      border-top: 1px dashed ${({ theme }) => theme.colors.border};
    }
  }
`;

export const EmptyCategory = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSoft};
  padding: 0.75rem 0.9rem;
  font-style: italic;
  opacity: 0.7;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};

  svg { opacity: 0.3; margin-bottom: 1rem; }
  p { font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem; }
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
  white-space: nowrap;
`;

// ===== Modales (los saco a estilos compartidos) =====
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
  overflow-y: auto;
`;

export const ModalCard = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 90vh;
  overflow-y: auto;

  h2 {
    font-size: 1.2rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.25rem;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSoft};
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  input, textarea {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.background};
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;

    &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  }

  textarea {
    resize: vertical;
    min-height: 70px;
  }

  .hint {
    font-size: 0.72rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 500px) {
    flex-direction: column-reverse;
  }
`;

export const GhostButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.15s;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;