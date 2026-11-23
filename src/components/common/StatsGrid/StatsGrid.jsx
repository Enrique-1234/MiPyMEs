import React from 'react';
import { StatsGridContainer, StatCard } from './StatsGrid.styles';

export const StatsGrid = ({ stats = [] }) => {
  return (
    <StatsGridContainer>
      {stats.map((stat, index) => (
        <StatCard key={index}>
          <div className="stat-header">
            <span>{stat.label}</span>
            {stat.icon}
          </div>
          <div className="stat-value">{stat.value}</div>
          {stat.subtext && <div className="stat-subtext">{stat.subtext}</div>}
        </StatCard>
      ))}
    </StatsGridContainer>
  );
};