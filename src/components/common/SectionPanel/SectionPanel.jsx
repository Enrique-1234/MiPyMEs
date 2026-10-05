import React from 'react';
import { SectionPanelWrapper } from './SectionPanel.styles';

export const SectionPanel = ({ title, children }) => {
  return (
    <SectionPanelWrapper>
      <div className="panel-header">
        <h3>{title}</h3>
      </div>
      {children}
    </SectionPanelWrapper>
  );
};