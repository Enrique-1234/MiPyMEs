// src/features/auth/pages/Login.styles.js
import styled, { keyframes } from 'styled-components';

const ring = keyframes`0%{transform:scale(.3);opacity:.7}100%{transform:scale(1.5);opacity:0}`;
const gradientShift = keyframes`0%,100%{background-position:0% 50%}50%{background-position:100% 50%}`;
const spin = keyframes`to{transform:rotate(360deg)}`;
const sweep = keyframes`0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}`;

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  min-height: 100vh;
  padding-top: 70px;
  background: ${({ theme }) => theme.colors.background};
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

export const VisualPanel = styled.aside`
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 3rem;
  color: #fff;
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.primary});
  background-size: 300% 300%;
  animation: ${gradientShift} 12s ease infinite;
  @media (max-width: 900px) { display: none; }

  .rings { position: relative; width: 220px; height: 220px; margin: 0 auto 2rem; display: grid; place-items: center; }
  .rings i {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.6);
    animation: ${ring} 3.6s ease-out infinite;
  }
  .rings i:nth-child(2) { animation-delay: 1.2s; }
  .rings i:nth-child(3) { animation-delay: 2.4s; }
  .rings svg { width: 96px; height: 96px; filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.3)); }

  h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.75rem; }
  p { max-width: 380px; margin: 0 auto; opacity: 0.9; line-height: 1.6; }
`;

export const FormSide = styled.div`
  display: grid;
  place-items: center;
  padding: 2rem 1.5rem;
`;

export const FormCard = styled.form`
  width: 100%;
  max-width: 420px;

  h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.4rem; color: ${({ theme }) => theme.colors.text}; }
  .sub { margin-bottom: 2rem; color: ${({ theme }) => theme.colors.textSoft}; }
`;

export const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1.25rem;

  input {
    width: 100%;
    padding: 1.4rem 3rem 0.55rem 1rem;
    font-size: 1rem;
    border-radius: 12px;
    outline: none;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface};
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  input:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 18%, transparent);
  }
  label {
    position: absolute;
    left: 1rem;
    top: 1.05rem;
    pointer-events: none;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textSoft};
    transform-origin: left top;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s;
  }
  input:focus + label,
  input:not(:placeholder-shown) + label {
    transform: translateY(-0.65rem) scale(0.75);
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

export const EyeButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 38px; height: 38px;
  border: none; border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSoft};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
  svg { width: 20px; height: 20px; }
`;

export const SubmitBtn = styled.button`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryDark});
  box-shadow: 0 14px 28px -12px ${({ theme }) => theme.colors.primary};
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s;

  &::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.45) 50%, transparent 70%);
    animation: ${sweep} 3.2s ease-in-out infinite;
  }
  &:hover:not(:disabled) { transform: translateY(-2px); }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { cursor: progress; opacity: 0.9; }
  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.accent}; outline-offset: 3px; }

  .spinner {
    display: inline-block; width: 18px; height: 18px; vertical-align: -3px; margin-right: 0.6rem;
    border: 2.5px solid rgba(255, 255, 255, 0.4); border-top-color: #fff; border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
  }
`;