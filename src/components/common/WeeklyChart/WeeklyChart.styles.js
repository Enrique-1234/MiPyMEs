// src/components/common/WeeklyChart/WeeklyChart.styles.js
import styled from 'styled-components';

export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;

  .title-block {
    h4 {
      font-size: 0.95rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text};
      margin-bottom: 0.15rem;
    }
    p {
      font-size: 0.78rem;
      color: ${({ theme }) => theme.colors.textSoft};
    }
  }

  .legend {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSoft};

    span {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .dot.reservations { background: ${({ theme }) => theme.colors.primary}; }
    .dot.guests { background: #22C55E; }
  }
`;

export const BarsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.5rem;
  align-items: end;
  min-height: 160px;
  padding: 0.5rem 0;

  @media (max-width: 500px) {
    gap: 0.3rem;
    min-height: 140px;
  }
`;

export const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  height: 100%;
  cursor: pointer;
  transition: transform 0.15s;

  &:hover {
    transform: translateY(-2px);
  }

  &:hover .bar-stack {
    filter: brightness(1.15);
  }

  .bar-area {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;
    min-height: 100px;
  }

  .bar-stack {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 100%;
    transition: filter 0.15s;
  }

  .bar {
    width: 100%;
    min-height: 2px;
    border-radius: 4px 4px 0 0;
    transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .bar.reservations {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryDark});
    width: 14px;
    max-width: 100%;
  }

  .bar.guests {
    background: linear-gradient(180deg, #22C55E, #16A34A);
    width: 14px;
    max-width: 100%;
  }

  .day-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSoft};
    white-space: nowrap;
  }

  .value {
    font-size: 0.7rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    min-height: 14px;
  }

  ${({ $today, theme }) =>
    $today &&
    `
    .day-label { color: ${theme.colors.primary}; }
    .value { color: ${theme.colors.primary}; }
  `}

  @media (max-width: 500px) {
    .bar.reservations,
    .bar.guests {
      width: 10px;
    }
    .day-label {
      font-size: 0.6rem;
    }
    .value {
      font-size: 0.62rem;
    }
  }
`;

export const TrendRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const TrendCard = styled.div`
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};

  .label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: ${({ theme }) => theme.colors.textSoft};
    font-weight: 700;
    margin-bottom: 0.3rem;
  }

  .value-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .current {
    font-size: 1.35rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
  }

  .trend {
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
    padding: 0.15rem 0.4rem;
    border-radius: 6px;

    &.up {
      color: #22C55E;
      background: rgba(34, 197, 94, 0.12);
    }
    &.down {
      color: #EF4444;
      background: rgba(239, 68, 68, 0.12);
    }
    &.flat {
      color: ${({ theme }) => theme.colors.textSoft};
      background: rgba(148, 163, 184, 0.12);
    }
  }
`;

export const EmptyChart = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 0.85rem;
  opacity: 0.7;
`;