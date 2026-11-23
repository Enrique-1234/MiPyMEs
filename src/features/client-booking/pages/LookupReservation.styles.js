// src/features/client-booking/pages/LookupReservation.styles.js
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 100px 1rem 4rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 520px;
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

  @media (max-width: 500px) {
    padding: 1.75rem 1.25rem;
    border-radius: 16px;
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 1.75rem;

  .icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B00, #FF2E93);
    display: grid;
    place-items: center;
    margin: 0 auto 1rem;
    color: #fff;
    box-shadow: 0 12px 30px rgba(255, 107, 0, 0.35);
  }

  h1 {
    font-size: 1.65rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: 500px) {
      font-size: 1.35rem;
    }
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSoft};
    line-height: 1.5;
    max-width: 380px;
    margin: 0 auto;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const CodeInput = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-align: center;
  text-transform: uppercase;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
    opacity: 0.5;
    font-size: 1rem;
    letter-spacing: 0.1em;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.15);
  }

  @media (max-width: 500px) {
    font-size: 1.1rem;
    letter-spacing: 0.1em;
    padding: 0.9rem 1rem;
  }
`;

export const SubmitBtn = styled.button`
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

export const HelperText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: center;
  margin-top: 0.75rem;
  line-height: 1.5;

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    &:hover { text-decoration: underline; }
  }
`;

export const ErrorBox = styled.div`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.85rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1rem;
`;

// ====== Vista de reserva encontrada ======
export const ResultCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  .business-name {
    font-size: 1.05rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.3;
  }
  .code {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
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
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0;
  font-size: 0.85rem;

  .label {
    color: ${({ theme }) => theme.colors.textSoft};
    flex-shrink: 0;
  }
  .value {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    text-align: right;
    overflow-wrap: break-word;
    word-break: break-word;
    min-width: 0;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

export const ActionBtn = styled.a`
  flex: 1;
  min-width: 140px;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: all 0.15s;
  border: 1.5px solid transparent;

  ${({ $primary, theme }) =>
    $primary
      ? `
    background: ${theme.colors.primary};
    color: #fff;
    &:hover { background: ${theme.colors.primaryDark}; }
  `
      : `
    background: transparent;
    border-color: ${theme.colors.border};
    color: ${theme.colors.text};
    &:hover {
      border-color: ${theme.colors.primary};
      color: ${theme.colors.primary};
    }
  `}
`;

export const NewSearch = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  background: transparent;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;