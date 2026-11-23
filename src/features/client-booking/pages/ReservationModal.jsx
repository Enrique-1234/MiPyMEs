// src/features/client-booking/pages/ReservationModal.jsx
import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { reservationsService } from '../services/reservationsService';
import {
  Overlay, Modal, ModalHeader, CloseBtn, ModalBody, SummaryBox,
  FieldGroup, Row2, ErrorBox, Actions, GhostButton, SubmitButton,
} from './ReservationModal.styles';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Sanitiza inputs (nombres y textos libres)
const sanitizeText = (value, maxLen = 100) => {
  return String(value)
    .replace(/[<>]/g, '')   // evita HTML injection
    .slice(0, maxLen);
};

// Sanitiza teléfono: solo dígitos, +, espacios, guiones, paréntesis
const sanitizePhone = (value) => {
  return value.replace(/[^\d+\s()-]/g, '').slice(0, 20);
};

export const ReservationModal = ({
  isOpen,
  onClose,
  onSuccess,
  business,
  slot,
  partySize,
  availableTableIds = [],
  availableMergeIds = [],
}) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    special_requests: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prellenar con datos del usuario logueado
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      guest_name: prev.guest_name || user.name || '',
      guest_email: prev.guest_email || user.email || '',
      guest_phone: prev.guest_phone || user.phone || '',
    }));
  }, [user]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !slot) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (error) setError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.guest_name.trim()) {
      errs.guest_name = 'El nombre es obligatorio';
    } else if (form.guest_name.trim().length < 2) {
      errs.guest_name = 'El nombre es demasiado corto';
    }

    if (form.guest_email.trim() && !EMAIL_REGEX.test(form.guest_email.trim())) {
      errs.guest_email = 'Formato de correo inválido';
    }

    if (form.guest_phone.trim() && form.guest_phone.trim().length < 8) {
      errs.guest_phone = 'El teléfono es demasiado corto';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setError('');

    try {
      // Tomamos la primera mesa disponible del slot
      const tableIds = availableTableIds.slice(0, 1);

      const reservation = await reservationsService.create({
        businessId: business.id,
        userId: user?.id || null,
        floorId: null,
        tableIds,
        slotStart: slot.slot_start,
        slotEnd: slot.slot_end,
        partySize,
        guestName: sanitizeText(form.guest_name, 100),
        guestPhone: form.guest_phone ? sanitizePhone(form.guest_phone) : null,
        guestEmail: form.guest_email ? form.guest_email.trim().toLowerCase() : null,
        specialRequests: form.special_requests ? sanitizeText(form.special_requests, 500) : null,
      });

      onSuccess?.(reservation);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (isoStr) => {
    try {
      return new Date(isoStr).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: business.timezone || 'America/Mexico_City',
      });
    } catch {
      return '—';
    }
  };

  const formatDate = (isoStr) => {
    try {
      return new Date(isoStr).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: business.timezone || 'America/Mexico_City',
      });
    } catch {
      return '—';
    }
  };

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true">
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <h2>Confirmar reserva</h2>
            <p>{business.name}</p>
          </div>
          <CloseBtn onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </CloseBtn>
        </ModalHeader>

        <ModalBody onSubmit={handleSubmit}>
          {/* ===== Resumen ===== */}
          <SummaryBox>
            <div className="row">
              <span>📅 Fecha</span>
              <span>{formatDate(slot.slot_start)}</span>
            </div>
            <div className="row">
              <span>🕐 Hora</span>
              <span>
                {formatTime(slot.slot_start)} – {formatTime(slot.slot_end)}
              </span>
            </div>
            <div className="row">
              <span>👥 Personas</span>
              <span>{partySize}</span>
            </div>
          </SummaryBox>

          {error && <ErrorBox>⚠️ {error}</ErrorBox>}

          {/* ===== Formulario ===== */}
          <FieldGroup>
            <label htmlFor="guest_name">
              <User size={12} style={{ verticalAlign: '-1px', marginRight: '0.3rem' }} />
              Nombre completo *
            </label>
            <input
              id="guest_name"
              type="text"
              value={form.guest_name}
              onChange={(e) => updateField('guest_name', e.target.value)}
              placeholder="Ej: Juan Pérez"
              maxLength={100}
              autoComplete="name"
              required
            />
            {fieldErrors.guest_name && <span className="error">{fieldErrors.guest_name}</span>}
          </FieldGroup>

          <Row2>
            <FieldGroup>
              <label htmlFor="guest_phone">
                <Phone size={12} style={{ verticalAlign: '-1px', marginRight: '0.3rem' }} />
                Teléfono
              </label>
              <input
                id="guest_phone"
                type="tel"
                value={form.guest_phone}
                onChange={(e) => updateField('guest_phone', sanitizePhone(e.target.value))}
                placeholder="55 1234 5678"
                maxLength={20}
                autoComplete="tel"
              />
              {fieldErrors.guest_phone && <span className="error">{fieldErrors.guest_phone}</span>}
            </FieldGroup>

            <FieldGroup>
              <label htmlFor="guest_email">
                <Mail size={12} style={{ verticalAlign: '-1px', marginRight: '0.3rem' }} />
                Email
              </label>
              <input
                id="guest_email"
                type="email"
                value={form.guest_email}
                onChange={(e) => updateField('guest_email', e.target.value)}
                placeholder="tu@email.com"
                maxLength={120}
                autoComplete="email"
              />
              {fieldErrors.guest_email && <span className="error">{fieldErrors.guest_email}</span>}
            </FieldGroup>
          </Row2>

          <FieldGroup>
            <label htmlFor="special_requests">
              <MessageSquare size={12} style={{ verticalAlign: '-1px', marginRight: '0.3rem' }} />
              Peticiones especiales (opcional)
            </label>
            <textarea
              id="special_requests"
              value={form.special_requests}
              onChange={(e) => updateField('special_requests', e.target.value)}
              placeholder="Ej: Cumpleaños, silla para bebé, alergias..."
              maxLength={500}
            />
          </FieldGroup>

          <Actions>
            <GhostButton type="button" onClick={onClose} disabled={submitting}>
              Cancelar
            </GhostButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner" />
                  Reservando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirmar reserva
                </>
              )}
            </SubmitButton>
          </Actions>
        </ModalBody>
      </Modal>
    </Overlay>
  );
};