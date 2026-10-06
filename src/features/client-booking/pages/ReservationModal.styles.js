// src/features/client-booking/pages/ReservationModal.styles.js
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px) scale(0.98); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
  overflow-y: auto;
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  animation: ${slideUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);

  @media (max-width: 500px) {
    border-radius: 16px;
    max-height: calc(100vh - 1rem);
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-size: 1.2rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.3;
  }

  p {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: 0.25rem;
  }
`;

export const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSoft};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: #fff;
  }
`;

export const ModalBody = styled.form`
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SummaryBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;

    span:first-child { color: ${({ theme }) => theme.colors.textSoft}; }
    span:last-child {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 700;
      text-align: right;
    }
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

  .error {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const ErrorBox = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.85rem;
  line-height: 1.4;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.5rem;
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

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;