// src/features/client-booking/pages/UserProfile.styles.js
import styled from 'styled-components';

export const FormCard = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 600px) {
    padding: 1.5rem 1.25rem;
  }
`;

export const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 500px) {
    flex-direction: column;
    text-align: center;
  }

  .avatar-big {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryDark});
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 2rem;
    font-weight: 800;
    flex-shrink: 0;
    box-shadow: 0 10px 30px rgba(255, 107, 0, 0.35);
    background-size: cover;
    background-position: center;
  }

  .info {
    min-width: 0;

    h2 {
      font-size: 1.25rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
      margin-bottom: 0.25rem;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .role {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      background: rgba(255, 107, 0, 0.12);
      color: ${({ theme }) => theme.colors.primary};
      margin-top: 0.35rem;
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

  input {
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
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .hint {
    font-size: 0.72rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }

  .error {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 500px) {
    flex-direction: column-reverse;
  }
`;

export const SubmitBtn = styled.button`
  padding: 0.85rem 1.75rem;
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

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryDark}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
`;