// src/features/client-booking/pages/ReservationConfirmation.styles.js
import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 90px 1rem 4rem;
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
  max-width: 560px;
  width: 100%;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);

  @media (max-width: 500px) {
    padding: 1.75rem 1.25rem;
  }
`;

export const SuccessIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22C55E, #16A34A);
  display: grid;
  place-items: center;
  margin: 0 auto 1.25rem;
  color: #fff;
  animation: ${popIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  svg { width: 36px; height: 36px; }
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 500px) {
    font-size: 1.4rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 1.75rem;
  line-height: 1.6;
`;

export const CodeBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1.5px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;

  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-bottom: 0.5rem;
  }
  .code {
    font-family: 'Courier New', monospace;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: ${({ theme }) => theme.colors.primary};
    word-break: break-all;
  }
`;

export const DetailsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  text-align: left;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.background};

    .label {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.textSoft};
      flex-shrink: 0;
    }
    .value {
      font-size: 0.9rem;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.text};
      text-align: right;
      min-width: 0;
      overflow-wrap: break-word;
    }
  }
`;

export const Notice = styled.div`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: rgba(250, 204, 21, 0.12);
  border: 1px solid rgba(250, 204, 21, 0.4);
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.85rem;
  line-height: 1.5;
  text-align: left;
  margin-bottom: 1.5rem;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`;

export const GhostBtn = styled.button`
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const LoadingWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
  background: ${({ theme }) => theme.colors.background};

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export const ErrorWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  text-align: center;

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text};
  }
  p {
    color: ${({ theme }) => theme.colors.textSoft};
    margin-bottom: 1.5rem;
    max-width: 400px;
  }
`;