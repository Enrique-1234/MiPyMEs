// src/features/business-admin/pages/BusinessDashboard.styles.js
import styled from 'styled-components';

export const EmptyBusiness = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 3rem 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};

  h2 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.75rem;
  }
  p { line-height: 1.6; max-width: 480px; margin: 0 auto; }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
  }

  .stat-subtext {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }

  ${({ $highlight, theme }) =>
    $highlight &&
    `
    border-color: ${theme.colors.primary};
    background: color-mix(in srgb, ${theme.colors.primary} 8%, ${theme.colors.surface});
  `}
`;

export const SectionPanel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    gap: 1rem;
    flex-wrap: wrap;

    h3 {
      font-size: 1.05rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const QuickList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  li {
    display: grid;
    grid-template-columns: 90px 1fr auto;
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem 0.9rem;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.background};
    font-size: 0.85rem;

    .time {
      font-weight: 800;
      color: ${({ theme }) => theme.colors.primary};
    }
    .guest {
      color: ${({ theme }) => theme.colors.text};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .party {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.colors.textSoft};
      white-space: nowrap;
    }

    @media (max-width: 500px) {
      grid-template-columns: 70px 1fr;
      .party { display: none; }
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 0.9rem;
`;