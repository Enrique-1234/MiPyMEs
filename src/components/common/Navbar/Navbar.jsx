import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';

const Nav = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};

  span.mark {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    color: #fff;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 1.1rem;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;
  a {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textSoft};
    transition: color 0.2s;
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const Button = styled(Link)`
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  ${({ $primary, theme }) =>
    $primary
      ? `
    background: ${theme.colors.primary};
    color: #fff;
    &:hover { background: ${theme.colors.primaryDark}; }
  `
      : `
    border: 1px solid ${theme.colors.border};
    color: ${theme.colors.text};
    &:hover { background: ${theme.colors.background}; }
  `}
`;

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Nav>
      <Logo to="/">
        <span class="mark">A</span>
        <span>AlPunto</span>
      </Logo>

      <NavLinks>
        <Link to="/#soluciones">Soluciones</Link>
        <Link to="/#funciona">Cómo funciona</Link>
        <Link to="/#ventajas">Ventajas</Link>
      </NavLinks>

      <Actions>
        {user ? (
          <>
            <Button to="/dashboard" $primary="true">Mi Panel ({user.name || 'Usuario'})</Button>
            <button 
              onClick={handleLogout} 
              style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, padding: '0.5rem' }}
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Button to="/login">Iniciar sesión</Button>
            <Button to="/registro" $primary="true">Registrarse</Button>
          </>
        )}
      </Actions>
    </Nav>
  );
};