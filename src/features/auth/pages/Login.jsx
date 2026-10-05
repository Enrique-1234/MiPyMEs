// src/features/auth/pages/Login.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../../context/AuthContext';
import { Navbar } from '../../../components/common/Navbar/Navbar';

import {
  Wrapper,
  VisualPanel,
  FormSide,
  FormCard,
  FormGroup,
  EyeButton,
  SubmitBtn,
} from './Login.styles';

const PIN_PATH = 'M50 8C30 8 16 23 16 42c0 24 34 50 34 50s34-26 34-50C84 23 70 8 50 8Z';

/* ================================
   🛡️ VALIDACIÓN Y SANITIZACIÓN
   ================================ */

// Regex de email robusto (sin permitir caracteres raros)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Caracteres permitidos en email (lista blanca)
const sanitizeEmail = (value) => {
  // Elimina todo lo que no sea letra, número, punto, guion, guion bajo, @ o +
  return value.replace(/[^a-zA-Z0-9._@+-]/g, '').slice(0, 254);
};

// Validaciones con mensajes claros
const validateEmail = (email) => {
  const clean = email.trim();
  if (!clean) return 'El correo es obligatorio';
  if (clean.length > 254) return 'El correo es demasiado largo';
  if (!EMAIL_REGEX.test(clean)) return 'Formato de correo inválido';
  return null;
};

const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (password.length > 128) return 'La contraseña es demasiado larga';
  // Bloquea null bytes y caracteres de control
  if (/[\x00-\x1F\x7F]/.test(password)) return 'La contraseña contiene caracteres inválidos';
  return null;
};

// Escapa HTML para prevenir XSS al mostrar errores
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/* ================================ */

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });
  const [attempts, setAttempts] = useState(0);

  const { login, getHomeRoute, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);

  // 🎯 Si ya está autenticado, redirige directo a su dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getHomeRoute(), { replace: true });
    }
  }, [isAuthenticated, getHomeRoute, navigate]);

  // 🎬 Animaciones GSAP (protegidas con gsap.context)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from('.login-anim', { y: 30, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.2 });
      gsap.from('.login-visual > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
      gsap.to('.login-pin', { y: -10, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, root);

    return () => ctx.revert();
  }, []);

  // 🧹 Limpia el error cuando el usuario empieza a escribir
  useEffect(() => {
    if (error) setError('');
  }, [email, password]);

  // 🎯 Handlers con sanitización en tiempo real
  const handleEmailChange = (e) => {
    const sanitized = sanitizeEmail(e.target.value);
    setEmail(sanitized);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(sanitized) }));
    }
  };

  const handlePasswordChange = (e) => {
    // No sanitizamos el password (puede tener cualquier carácter),
    // pero limitamos la longitud para prevenir ataques de DoS
    const value = e.target.value.slice(0, 128);
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // 🛡️ Validación completa antes de enviar
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setFieldErrors({ email: emailErr, password: passErr });
      return;
    }

    // 🛡️ Rate limiting básico: máx 5 intentos por minuto
    if (attempts >= 5) {
      setError('Demasiados intentos. Espera un momento antes de volver a intentar.');
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({ email: null, password: null });

    try {
      // 🔑 El authService valida las credenciales y devuelve el user con su rol
      const userData = await login(email.trim().toLowerCase(), password);

      // 🎯 Redirección basada en el rol devuelto
      const redirectTo = location.state?.from?.pathname || getHomeRoute();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setAttempts((a) => a + 1);
      // 🛡️ Escapamos el mensaje por si viene del backend con HTML
      setError(escapeHtml(err.message || 'Error al iniciar sesión'));
    } finally {
      setLoading(false);
    }
  };

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
            <h2>Tu negocio, visible para todo Nicolás Romero</h2>
            <p>Administra tu catálogo, actualiza horarios y recibe clientes desde un solo panel.</p>
          </div>
        </VisualPanel>

        <FormSide>
          <FormCard onSubmit={handleSubmit} noValidate>
            <h1 className="login-anim">Iniciar sesión</h1>
            <p className="sub login-anim">Ingresa a tu cuenta de AlPunto</p>

            <FormGroup className="login-anim" $hasError={!!fieldErrors.email}>
              <input
                id="email"
                type="email"
                placeholder=" "
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
                required
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              <label htmlFor="email">Correo electrónico</label>
            </FormGroup>
            {fieldErrors.email && (
              <p id="email-error" style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.75rem', marginBottom: '1rem' }}>
                {fieldErrors.email}
              </p>
            )}

            <FormGroup className="login-anim" $hasError={!!fieldErrors.password}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder=" "
                autoComplete="current-password"
                maxLength={128}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setFieldErrors((prev) => ({ ...prev, password: validatePassword(password) }))}
                required
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              <label htmlFor="password">Contraseña</label>
              <EyeButton
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPass ? (
                    <><path d="M17.94 17.94A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /></>
                  ) : (
                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></>
                  )}
                </svg>
              </EyeButton>
            </FormGroup>
            {fieldErrors.password && (
              <p id="password-error" style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.75rem', marginBottom: '1rem' }}>
                {fieldErrors.password}
              </p>
            )}

            {error && (
              <p
                role="alert"
                style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.75rem', textAlign: 'center' }}
                dangerouslySetInnerHTML={{ __html: error }}
              />
            )}

            <SubmitBtn className="login-anim" type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Entrando…' : 'Entrar'}
            </SubmitBtn>

            {/* 💡 Ayuda temporal para probar los 3 roles mientras no hay Supabase */}
            {import.meta.env.DEV && (
              <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.7 }}>
                <strong>Cuentas de prueba:</strong><br />
                super@alpunto.com / super123<br />
                barberia@alpunto.com / barberia123<br />
                cliente@test.com / cliente123
              </div>
            )}
          </FormCard>
        </FormSide>
      </Wrapper>
    </>
  );
};