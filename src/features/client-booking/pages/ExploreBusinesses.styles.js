// src/features/client-booking/pages/ExploreBusinesses.styles.js
import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
  min-width: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  outline: none;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  svg {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSoft};
    pointer-events: none;
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

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

export const BusinessCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
    box-shadow: 0 15px 30px -12px rgba(255, 107, 0, 0.3);
  }
`;

export const CardImage = styled.div`
  height: 140px;
  background: ${({ $url, theme }) =>
    $url
      ? `url(${$url}) center/cover`
      : 'linear-gradient(135deg, #FF6B00 0%, #FF2E93 100%)'};
  position: relative;
  display: grid;
  place-items: center;

  .initial {
    font-size: 3rem;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .logo-overlay {
    position: absolute;
    bottom: -24px;
    left: 1rem;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: ${({ theme }) => theme.colors.surface};
    border: 3px solid ${({ theme }) => theme.colors.surface};
    background-size: cover;
    background-position: center;
    display: grid;
    place-items: center;
    font-size: 1.35rem;
    font-weight: 800;
    color: #fff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
`;

export const CardBody = styled.div`
  padding: 1.75rem 1rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;

  h3 {
    font-size: 1.05rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 1.3;
  }

  .category {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: rgba(255, 107, 0, 0.12);
    color: ${({ theme }) => theme.colors.primary};
    width: fit-content;
  }

  .description {
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textSoft};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.75rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
    margin-top: auto;
    padding-top: 0.5rem;

    span {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      min-width: 0;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};

  svg { opacity: 0.3; margin-bottom: 1rem; }
  p { font-size: 0.95rem; line-height: 1.6; }
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