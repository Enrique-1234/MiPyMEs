import styled from 'styled-components';

/* Contenedor fijo: oculto y sin clics mientras está cerrado */
export const OverlayRoot = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1500;
  visibility: hidden;
`;

export const OverlaySVG = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const MenuContent = styled.nav`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(1.5rem, 8vw, 8rem);

  /* Al pasar sobre un enlace, los demás se atenúan */
  &:hover a:not(:hover) { opacity: 0.35; }
`;

export const MenuItemWrap = styled.div`
  overflow: hidden;
  padding: 0.1em 0;
`;

export const MenuLink = styled.a`
  display: inline-block;
  font-size: clamp(2.4rem, 8vw, 5.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #fff;
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateX(18px);
    background: linear-gradient(90deg, #22d3ee, #c9a227);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &:focus-visible { outline: 3px solid #c9a227; outline-offset: 6px; border-radius: 6px; }
`;

export const CloseButton = styled.button`
  position: absolute;
  z-index: 3;
  top: 1.25rem;
  right: clamp(1rem, 3vw, 2rem);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  background: transparent;
  cursor: pointer;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: #fff;
  }
  span:first-child { transform: translate(-50%, -50%) rotate(45deg); }
  span:last-child { transform: translate(-50%, -50%) rotate(-45deg); }

  &:hover { transform: rotate(90deg) scale(1.08); background: rgba(255, 255, 255, 0.14); }
  &:focus-visible { outline: 3px solid #c9a227; outline-offset: 3px; }
`;

export const MenuFooter = styled.div`
  position: absolute;
  z-index: 2;
  left: clamp(1.5rem, 8vw, 8rem);
  right: clamp(1.5rem, 8vw, 8rem);
  bottom: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);

  strong { color: #fff; }
`;
