// src/features/auth/pages/RegisterBusiness.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { supabase } from '../../../services/supabaseClient';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import {
  Wrapper, VisualPanel, FormSide, FormCard, FormGroup, EyeButton, SubmitBtn,
} from './Login.styles';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PIN_PATH = 'M50 8C30 8 16 23 16 42c0 24 34 50 34 50s34-26 34-50C84 23 70 8 50 8Z';

export const RegisterBusiness = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.login-anim', { y: 30, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.2 });
      gsap.from('.login-visual > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      setError('Formato de correo inválido');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: signErr } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            name: form.name.trim(),
            wants_business: true,
          },
             emailRedirectTo: `${window.location.origin}/registro/negocio`, 
        },
      });

      if (signErr) throw new Error(signErr.message);

      // Si email confirmation está desactivado, hay sesión → ir al formulario
      if (data.session) {
        navigate('/registro/negocio', { replace: true });
      } else {
        setNeedsConfirm(true);
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        setError('Este correo ya está registrado. Inicia sesión.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirm) {
    return (
      <>
        <Navbar />
        <Wrapper ref={rootRef}>
          <VisualPanel>
            <div className="login-visual">
              <div className="rings" aria-hidden="true">
                <i /><i /><i />
                <svg className="login-pin" viewBox="0 0 100 100">
                  <path d={PIN_PATH} fill="#fff" />
                  <circle cx="50" cy="42" r="12" fill="#2563eb" />
                </svg>
              </div>
              <h2>Revisa tu correo</h2>
              <p>Te enviamos un enlace para confirmar tu cuenta.</p>
            </div>
          </VisualPanel>
          <FormSide>
            <FormCard>
              <h1 className="login-anim">Verifica tu correo</h1>
              <p className="sub login-anim">
                Enviamos un enlace a <strong>{form.email}</strong>.
                Confirma tu cuenta y luego <Link to="/login" style={{ color: '#FF6B00' }}>inicia sesión</Link> para completar el registro de tu negocio.
              </p>
            </FormCard>
          </FormSide>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Wrapper ref={rootRef}>
        <VisualPanel>
          <div className="login-visual">
            <div className="rings" aria-hidden="true">
              <i /><i /><i />
              <svg className="login-pin" viewBox="0 0 100 100">
                <path d={PIN_PATH} fill="#fff" />
                <circle cx="50" cy="42" r="12" fill="#2563eb" />
              </svg>
            </div>
            <h2>Haz crecer tu negocio con ReservaPro</h2>
            <p>Sin comisiones. Sin contratos. Solo visibilidad y reservas.</p>
          </div>
        </VisualPanel>

        <FormSide>
          <FormCard onSubmit={handleSubmit}>
            <h1 className="login-anim">Registra tu negocio</h1>
            <p className="sub login-anim">Crea tu cuenta para empezar</p>

            <FormGroup className="login-anim">
              <input
                id="name"
                type="text"
                placeholder=" "
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                autoComplete="name"
                maxLength={100}
                required
              />
              <label htmlFor="name">Tu nombre</label>
            </FormGroup>

            <FormGroup className="login-anim">
              <input
                id="email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                autoComplete="email"
                maxLength={254}
                required
              />
              <label htmlFor="email">Correo electrónico</label>
            </FormGroup>

            <FormGroup className="login-anim">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder=" "
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                autoComplete="new-password"
                maxLength={128}
                required
              />
              <label htmlFor="password">Contraseña</label>
              <EyeButton type="button" onClick={() => setShowPass((s) => !s)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPass ? (
                    <><path d="M17.94 17.94A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /></>
                  ) : (
                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></>
                  )}
                </svg>
              </EyeButton>
            </FormGroup>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <SubmitBtn className="login-anim" type="submit" disabled={loading}>
              {loading ? 'Creando cuenta…' : 'Continuar'}
            </SubmitBtn>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8', marginTop: '1rem' }}>
              ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#FF6B00', fontWeight: 700 }}>Inicia sesión</Link>
            </p>
          </FormCard>
        </FormSide>
      </Wrapper>
    </>
  );
};