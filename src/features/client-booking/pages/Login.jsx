import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Navbar } from '../../../components/common/Navbar/Navbar';

const Wrapper = styled.div`
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
`;

const FormCard = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);

  h2 { margin-bottom: 0.5rem; text-align: center; }
  p { text-align: center; color: ${({ theme }) => theme.colors.textSoft}; margin-bottom: 1.5rem; font-size: 0.875rem; }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.35rem; }
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 0.95rem;
    outline: none;
    &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  border-radius: 8px;
  margin-top: 0.5rem;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Simulación de login con rol dinámico
    const isAdmin = email.includes('admin');
    const userData = {
      email,
      name: email.split('@')[0],
      role: isAdmin ? 'business-admin' : 'user'
    };

    login(userData);
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />
      <Wrapper>
        <FormCard onSubmit={handleSubmit}>
          <h2>Iniciar sesión</h2>
          <p>Ingresa a tu cuenta de AlPunto</p>

          <FormGroup>
            <label>Correo electrónico</label>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </FormGroup>

          <FormGroup>
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </FormGroup>

          <SubmitBtn type="submit">Entrar</SubmitBtn>
        </FormCard>
      </Wrapper>
    </>
  );
};