// src/features/client-booking/pages/LookupReservation.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Key, CheckCircle2, MapPin, Phone, Calendar, Clock, Users,
  MessageSquare, Home, Store,
} from 'lucide-react';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import { reservationsService } from '../services/reservationsService';
import {
  PageWrapper, Card, Header, Form, CodeInput, SubmitBtn, HelperText,
  ErrorBox, ResultCard, ResultHeader, StatusBadge, DetailRow,
  ActionsRow, ActionBtn, NewSearch,
} from './LookupReservation.styles';

// Sanitiza el código: solo alfanuméricos, mayúsculas
const sanitizeCode = (value) => {
  return String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12);
};

const STATUS_LABEL = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  seated: 'En curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asististe',
};

export const LookupReservation = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reservation, setReservation] = useState(null);

  const handleChange = (e) => {
    setCode(sanitizeCode(e.target.value));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanCode = code.trim();
    if (cleanCode.length < 8) {
      setError('El código debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await reservationsService.getByConfirmationCode(cleanCode);
      setReservation(data);
    } catch (err) {
      setReservation(null);
      setError('No encontramos ninguna reserva con ese código. Verifica que esté escrito correctamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setReservation(null);
    setCode('');
    setError('');
  };

  // Formatear fecha/hora con timezone del negocio
  const formatDateTime = (range, timezone) => {
    const { start } = reservationsService.parseRange(range);
    if (!start) return '—';
    return start.toLocaleString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || 'America/Mexico_City',
    });
  };

  const formatTime = (range, timezone) => {
    const { start, end } = reservationsService.parseRange(range);
    if (!start || !end) return '—';
    const tz = timezone || 'America/Mexico_City';
    const fmt = (d) =>
      d.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
      });
    return `${fmt(start)} – ${fmt(end)}`;
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Card>
          {!reservation ? (
            <>
              <Header>
                <div className="icon-circle">
                  <Key size={28} />
                </div>
                <h1>Consultar mi reserva</h1>
                <p>
                  Ingresa el código de confirmación que te dimos al reservar
                  para ver los detalles de tu cita.
                </p>
              </Header>

              <Form onSubmit={handleSubmit}>
                <CodeInput
                  type="text"
                  value={code}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXXXX"
                  autoFocus
                  spellCheck={false}
                  autoCapitalize="characters"
                  autoComplete="off"
                  maxLength={12}
                  aria-label="Código de confirmación"
                />

                <SubmitBtn type="submit" disabled={loading || code.length < 8}>
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Buscar reserva
                    </>
                  )}
                </SubmitBtn>
              </Form>

              {error && <ErrorBox>⚠️ {error}</ErrorBox>}

              <HelperText>
                ¿No encuentras tu código? Revisa tu correo o mensaje de
                confirmación, o <Link to="/">contacta al negocio</Link>.
              </HelperText>
            </>
          ) : (
            <>
              <Header>
                <div className="icon-circle" style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', boxShadow: '0 12px 30px rgba(34, 197, 94, 0.35)' }}>
                  <CheckCircle2 size={28} />
                </div>
                <h1>Reserva encontrada</h1>
                <p>Aquí están los detalles de tu cita.</p>
              </Header>

              <ResultCard>
                <ResultHeader>
                  <div>
                    <div className="business-name">
                      {reservation.business?.name}
                    </div>
                    <div className="code">🔑 {reservation.confirmation_code}</div>
                  </div>
                  <StatusBadge $status={reservation.status}>
                    {STATUS_LABEL[reservation.status] || reservation.status}
                  </StatusBadge>
                </ResultHeader>

                <DetailRow>
                  <span className="label"><Calendar size={13} /> Fecha</span>
                  <span className="value">
                    {formatDateTime(reservation.during, reservation.business?.timezone)}
                  </span>
                </DetailRow>

                <DetailRow>
                  <span className="label"><Clock size={13} /> Horario</span>
                  <span className="value">
                    {formatTime(reservation.during, reservation.business?.timezone)}
                  </span>
                </DetailRow>

                <DetailRow>
                  <span className="label"><Users size={13} /> Personas</span>
                  <span className="value">{reservation.party_size}</span>
                </DetailRow>

                <DetailRow>
                  <span className="label">🙋 A nombre de</span>
                  <span className="value">{reservation.guest_name}</span>
                </DetailRow>

                {reservation.guest_phone && (
                  <DetailRow>
                    <span className="label"><Phone size={13} /> Teléfono</span>
                    <span className="value">{reservation.guest_phone}</span>
                  </DetailRow>
                )}

                {reservation.business?.address && (
                  <DetailRow>
                    <span className="label"><MapPin size={13} /> Dirección</span>
                    <span className="value">
                      {reservation.business.address}
                      {reservation.business.city ? `, ${reservation.business.city}` : ''}
                    </span>
                  </DetailRow>
                )}

                {reservation.special_requests && (
                  <DetailRow>
                    <span className="label"><MessageSquare size={13} /> Notas</span>
                    <span className="value">{reservation.special_requests}</span>
                  </DetailRow>
                )}
              </ResultCard>

              <ActionsRow>
                {reservation.business?.slug && (
                  <ActionBtn
                    as={Link}
                    to={`/negocio/${reservation.business.slug}`}
                    $primary
                  >
                    <Store size={14} />
                    Ver el negocio
                  </ActionBtn>
                )}
                <ActionBtn as={Link} to="/">
                  <Home size={14} />
                  Ir al inicio
                </ActionBtn>
              </ActionsRow>

              <NewSearch onClick={handleNewSearch}>
                🔍 Buscar otra reserva
              </NewSearch>
            </>
          )}
        </Card>
      </PageWrapper>
    </>
  );
};