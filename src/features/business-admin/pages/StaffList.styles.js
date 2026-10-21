
 // src/features/business-admin/pages/StaffList.styles.js
import styled from 'styled-components';

// ==============================
// TOOLBAR
// ==============================
export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
  min-width: 0;

  .spacer {
    flex: 1 1 auto;
  }

  @media (max-width: 600px) {
    gap: 0.6rem;
    margin-bottom: 1rem;

    .spacer {
      display: none;
    }

    > button {
      max-width: 100%;
    }
  }
`;

// ==============================
// BOTÓN PRINCIPAL
// ==============================
export const PrimaryButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  white-space: normal;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
`;

// ==============================
// LISTA DE PERSONAL
// ==============================
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
`;

// ==============================
// TARJETA DE PERSONAL
// ==============================
export const StaffCard = styled.article`
  display: grid;
  grid-template-columns:
    56px
    minmax(0, 1fr)
    minmax(150px, 200px)
    auto;
  gap: 1rem;
  align-items: center;
  width: 100%;
  min-width: 0;
  padding: 1.25rem;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  > * {
    min-width: 0;
  }

  /* Tablet y pantallas medianas */
  @media (max-width: 900px) {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 0.85rem;
    padding: 1rem;

    /* Bloques adicionales de información */
    > .details-block,
    > .actions-block,
    > *:nth-child(3),
    > *:nth-child(4) {
      grid-column: 1 / -1;
    }
  }

  /* Teléfonos */
  @media (max-width: 480px) {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 0.75rem;
    padding: 0.85rem;
    border-radius: 12px;
  }
`;

// ==============================
// AVATAR
// ==============================
export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primaryDark}
  );
  background-size: cover;
  background-position: center;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  box-shadow: 0 6px 16px rgba(255, 107, 0, 0.2);

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 1rem;
  }
`;

// ==============================
// INFORMACIÓN DEL EMPLEADO
// ==============================
export const InfoBlock = styled.div`
  min-width: 0;
  overflow-wrap: anywhere;

  .name-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem 0.5rem;
    min-width: 0;
  }

  .name {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
    font-weight: 800;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .position {
    margin-top: 0.2rem;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.8rem;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .email {
    margin-top: 0.2rem;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.8rem;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.75rem;
    margin-top: 0.3rem;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.75rem;
    overflow-wrap: anywhere;
  }

  .date {
    margin-top: 0.3rem;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.7rem;
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    .name {
      font-size: 0.95rem;
    }

    .contact {
      gap: 0.35rem 0.5rem;
    }
  }
`;

// ==============================
// DETALLES ADICIONALES
// ==============================
export const DetailsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;

  .detail-item {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.25rem 0.35rem;
    min-width: 0;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.8rem;
    overflow-wrap: anywhere;

    strong {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 700;
    }

    svg {
      flex-shrink: 0;
    }
  }

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    padding-top: 0.85rem;
    border-top: 1px dashed ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.6rem;
  }
`;

// ==============================
// SELECTOR DE ROL
// ==============================
export const RoleSelect = styled.select`
  width: 100%;
  max-width: 220px;
  min-width: 0;
  padding: 0.6rem 0.7rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 900px) {
    max-width: none;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// ==============================
// ACCIONES
// ==============================
export const ActionsCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;

  @media (max-width: 900px) {
    justify-content: flex-start;
    padding-top: 0.85rem;
    border-top: 1px dashed ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 480px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }
`;

// Alias para componentes que usan la clase actions-block.
export const ActionsBlock = ActionsCell;

// ==============================
// BOTONES PEQUEÑOS
// ==============================
export const SmallButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  flex: 0 1 auto;
  min-width: 0;
  padding: 0.55rem 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSoft};
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: normal;
  overflow-wrap: anywhere;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ $danger, theme }) =>
      $danger ? theme.colors.error : theme.colors.primary};
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.error : theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.65rem 0.5rem;
    font-size: 0.75rem;
  }
`;

// ==============================
// ETIQUETAS DE ESTADO
// ==============================
export const Badge = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  max-width: 100%;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  overflow-wrap: anywhere;

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

// ==============================
// ESTADOS VACÍOS
// ==============================
export const EmptyState = styled.div`
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: center;

  svg {
    max-width: 100%;
    opacity: 0.35;
    margin-bottom: 1rem;
  }

  p {
    max-width: 480px;
    margin: 0 auto;
    font-size: 0.95rem;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  @media (max-width: 480px) {
    padding: 2rem 0.75rem;
  }
`;

// ==============================
// CARGA
// ==============================
export const LoadingState = styled.div`
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: center;

  @media (max-width: 480px) {
    padding: 2rem 0.75rem;
  }
`;

// ==============================
// ERRORES
// ==============================
export const ErrorBox = styled.div`
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

// ==============================
// INFORMACIÓN
// ==============================
export const InfoBox = styled.div`
  margin-bottom: 1.25rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 10px;
  background: rgba(56, 189, 248, 0.1);
  color: ${({ theme }) => theme.colors.info};
  font-size: 0.85rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

// ==============================
// OVERLAY DEL MODAL
// ==============================
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);

  @media (max-width: 600px) {
    align-items: flex-start;
    padding: 0.75rem;
  }

  @media (max-width: 360px) {
    padding: 0.5rem;
  }
`;

// ==============================
// TARJETA DEL MODAL
// ==============================
export const ModalCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  max-height: 90dvh;
  min-width: 0;
  margin: auto;
  padding: 1.75rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};

  h2 {
    margin: 0 0 0.25rem;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.2rem;
    font-weight: 800;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  @media (max-width: 600px) {
    max-height: calc(100vh - 1.5rem);
    max-height: calc(100dvh - 1.5rem);
    padding: 1.25rem;
    border-radius: 14px;
  }

  @media (max-width: 360px) {
    padding: 1rem;
    gap: 0.85rem;
  }
`;

// ==============================
// CAMPOS DEL FORMULARIO
// ==============================
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;

  label {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-width: 0;
    padding: 0.75rem 1rem;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  @media (max-width: 480px) {
    input,
    select,
    textarea {
      padding: 0.75rem;
      font-size: 16px;
    }
  }
`;

// ==============================
// ACCIONES DEL MODAL
// ==============================
export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  > button {
    min-width: 0;
  }

  @media (max-width: 500px) {
    flex-direction: column-reverse;

    > button {
      width: 100%;
      justify-content: center;
    }
  }
`;

// ==============================
// BOTÓN SECUNDARIO
// ==============================
export const GhostButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.25rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;
