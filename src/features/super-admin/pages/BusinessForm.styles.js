// src/features/super-admin/pages/BusinessForm.styles.js
import styled from 'styled-components';

export const WizardHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

export const StepIndicator = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${({ $active, $done, theme }) =>
    $done ? theme.colors.success : $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? `color-mix(in srgb, ${theme.colors.primary} 10%, transparent)` : 'transparent'};
  color: ${({ $active, $done, theme }) =>
    $done ? theme.colors.success : $active ? theme.colors.primary : theme.colors.textSoft};
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  .step-num {
    display: block;
    font-size: 0.75rem;
    opacity: 0.7;
    margin-bottom: 0.25rem;
  }
  .step-title {
    font-size: 0.9rem;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FormCard = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 800px;
`;

export const StepTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const StepSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 1rem;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSoft};
  }

  input,
  textarea,
  select {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.background};
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  textarea {
    resize: vertical;
    min-height: 90px;
  }

  .hint {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }

  .error {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => `repeat(${$cols || 2}, 1fr)`};
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;

  span:first-child {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

export const HoursGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DayRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 1fr 120px;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  .day-name {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
  }

  input[type="time"] {
    padding: 0.5rem;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
      opacity: 0.4;
    }
  }

  .closed-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSoft};
    cursor: pointer;
  }

  input[type="checkbox"] {
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.25rem;
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
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
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

export const ErrorBox = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
`;