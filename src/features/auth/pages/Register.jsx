// src/features/auth/pages/Register.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { supabase } from '../../../services/supabaseClient';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import {
  Wrapper, VisualPanel, FormSide, FormCard, FormGroup, EyeButton, SubmitBtn,
} from './Login.styles';

const NAME_REGEX = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;

const EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_UPPERCASE = /[A-Z]/;
const PASSWORD_LOWERCASE = /[a-z]/;
const PASSWORD_NUMBER = /\d/;
const PASSWORD_SPECIAL = /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/;

const PIN_PATH =
  'M50 8C30 8 16 23 16 42c0 24 34 50 34 50s34-26 34-50C84 23 70 8 50 8Z';

export const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.login-anim', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.login-visual > *', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = form.name.trim().replace(/\s+/g, ' ');
    const email = form.email.trim();
    const password = form.password;

    // Validar nombre
    if (name.length < 2 || name.length > 60) {
      return setError(
        'El nombre debe tener entre 2 y 60 caracteres'
      );
    }

    if (!NAME_REGEX.test(name)) {
      return setError(
        'El nombre solo puede contener letras, acentos, espacios, apóstrofes y guiones'
      );
    }

    // Validar correo electrónico
    if (
      email.length > 254 ||
      !EMAIL_REGEX.test(email) ||
      email.includes('..') ||
      email.split('@')[0].startsWith('.') ||
      email.split('@')[0].endsWith('.')
    ) {
      return setError('Introduce un correo electrónico válido');
    }

    // Validar longitud de contraseña
    if (
      password.length < PASSWORD_MIN_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH
    ) {
      return setError(
        'La contraseña debe tener entre 8 y 128 caracteres'
      );
    }

    // No permitir espacios en la contraseña
    if (/\s/.test(password)) {
      return setError(
        'La contraseña no puede contener espacios'
      );
    }

    // Exigir mayúscula
    if (!PASSWORD_UPPERCASE.test(password)) {
      return setError(
        'La contraseña debe incluir al menos una mayúscula'
      );
    }

    // Exigir minúscula
    if (!PASSWORD_LOWERCASE.test(password)) {
      return setError(
        'La contraseña debe incluir al menos una minúscula'
      );
    }

    // Exigir número
    if (!PASSWORD_NUMBER.test(password)) {
      return setError(
        'La contraseña debe incluir al menos un número'
      );
    }

    // Exigir carácter especial
    if (!PASSWORD_SPECIAL.test(password)) {
      return setError(
        'La contraseña debe incluir un carácter especial, por ejemplo: @, # o !'
      );
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: signErr } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            name,
            wants_business: false,
          },
          emailRedirectTo: `${window.location.origin}/user/dashboard`,
        },
      });

      if (signErr) {
        const message = signErr.message || '';
        const lowerMessage = message.toLowerCase();

        if (
          lowerMessage.includes('already registered') ||
          lowerMessage.includes('already been registered') ||
          lowerMessage.includes('user already registered')
        ) {
          throw new Error(
            'Este correo ya está registrado. Inicia sesión.'
          );
        }

        throw new Error(message);
      }

      if (data.session) {
        navigate('/user/dashboard', { replace: true });
      } else {
        setNeedsConfirm(true);
      }
    } catch (err) {
      setError(
        err.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.'
      );
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
                <i />
                <i />
                <i />

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
                Confírmalo y{' '}
                <Link
                  to="/login"
                  style={{ color: '#FF6B00' }}
                >
                  inicia sesión
                </Link>.
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
              <i />
              <i />
              <i />

              <svg className="login-pin" viewBox="0 0 100 100">
                <path d={PIN_PATH} fill="#fff" />
                <circle cx="50" cy="42" r="12" fill="#2563eb" />
              </svg>
            </div>

            <h2>Descubre ReservaPro</h2>
            <p>
              Encuentra y reserva en los mejores negocios de Nicolás Romero.
            </p>
          </div>
        </VisualPanel>

        <FormSide>
          <FormCard onSubmit={handleSubmit}>
            <h1 className="login-anim">Crear cuenta</h1>

            <p className="sub login-anim">
              Regístrate para empezar a reservar
            </p>

            <FormGroup className="login-anim">
              <input
                id="name"
                type="text"
                placeholder=" "
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                autoComplete="name"
                minLength={2}
                maxLength={60}
                pattern="[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*"
                title="Utiliza letras, acentos, espacios, apóstrofes o guiones"
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
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                title="Debe incluir mayúscula, minúscula, número y carácter especial, sin espacios"
                required
              />

              <label htmlFor="password">Contraseña</label>

              <EyeButton
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={
                  showPass
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {showPass ? (
                    <>
                      <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </EyeButton>
            </FormGroup>

            {error && (
              <p
                role="alert"
                style={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem',
                  textAlign: 'center',
                }}
              >
                {error}
              </p>
            )}

            <SubmitBtn
              className="login-anim"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
            </SubmitBtn>

            <p
              style={{
                textAlign: 'center',
                fontSize: '0.8rem',
                color: '#94A3B8',
                marginTop: '1rem',
              }}
            >
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                style={{
                  color: '#FF6B00',
                  fontWeight: 700,
                }}
              >
                Inicia sesión
              </Link>
            </p>
          </FormCard>
        </FormSide>
      </Wrapper>
    </>
  );
};