import styled from 'styled-components';

export const StatsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }

  .stat-subtext {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.success};
    margin-top: 0.25rem;
  }
`;