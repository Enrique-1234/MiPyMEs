// src/components/common/ImageUploader/ImageUploader.styles.js
import styled from 'styled-components';

export const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  aspect-ratio: ${({ $aspect }) => $aspect === 'square' ? '1/1' : '16/6'};
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: ${({ $url }) => $url ? `url(${$url})` : 'none'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .overlay {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: ${({ $url }) => $url ? '#fff' : 'inherit'};
    text-shadow: ${({ $url }) => $url ? '0 2px 4px rgba(0,0,0,0.8)' : 'none'};
    background: ${({ $url }) => $url ? 'rgba(0,0,0,0.4)' : 'transparent'};
    padding: ${({ $url }) => $url ? '1rem' : '0'};
    border-radius: 8px;
  }

  .icon { opacity: 0.7; }
  .text { font-size: 0.85rem; font-weight: 600; }
  .hint { font-size: 0.7rem; opacity: 0.7; }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: #fff;
  gap: 0.5rem;
  backdrop-filter: blur(2px);

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;