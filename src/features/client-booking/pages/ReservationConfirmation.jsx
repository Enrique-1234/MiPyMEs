// src/features/client-booking/pages/ReservationConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Home, MapPin } from 'lucide-react';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import { reservationsService } from '../services/reservationsService';
import {
  PageWrapper, Card, SuccessIcon, Title, Subtitle, CodeBox,
  DetailsGrid, Notice, Actions, PrimaryBtn, GhostBtn,
  LoadingWrapper, ErrorWrapper,
} from './ReservationConfirmation.styles';

export const ReservationConfirmation = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await reservationsService.getByConfirmationCode(code);
        if (alive) setReservation(data);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [code]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingWrapper>
          <div className="spinner" />
          <span>Cargando tu reserva...</span>
        </LoadingWrapper>
      </>
    );
  }

  if (error || !reservation) {
    return (
      <>
        <Navbar />
        <ErrorWrapper>
          <h1>Reserva no encontrada</h1>
          <p>{error || 'El código de confirmación no es válido o la reserva fue eliminada.'}</p>
          <GhostBtn onClick={() => navigate('/')}>Volver al inicio</GhostBtn>
        </ErrorWrapper>
      </>
    );
  }

  const formatDateTime = (range) => {
    try {
      // range es tipo '[2026-10-10 17:30:00+00,2026-10-10 19:30:00+00)'
      // Extraemos el lower
      const match = String(range).match(/[[(]([^,]+),/);
      if (!match) return '—';
      const start = new Date(match[1]);
      return start.toLocaleString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: reservation.business?.timezone || 'America/Mexico_City',
      });
    } catch {
      return '—';
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Card>
          <SuccessIcon>
            <CheckCircle2 />
          </SuccessIcon>

          <Title>¡Reserva recibida!</Title>
          <Subtitle>
            Tu solicitud fue enviada a <strong>{reservation.business?.name}</strong>.
            Te contactarán para confirmar los detalles.
          </Subtitle>

          <CodeBox>
            <div className="label">Código de confirmación</div>
            <div className="code">{reservation.confirmation_code}</div>
          </CodeBox>

          <DetailsGrid>
            <div className="row">
              <span className="label">📅 Cuándo</span>
              <span className="value">{formatDateTime(reservation.during)}</span>
            </div>
            <div className="row">
              <span className="label">👥 Personas</span>
              <span className="value">{reservation.party_size}</span>
            </div>
            <div className="row">
              <span className="label">🙋 A nombre de</span>
              <span className="value">{reservation.guest_name}</span>
            </div>
            {reservation.guest_phone && (
              <div className="row">
                <span className="label">📞 Teléfono</span>
                <span className="value">{reservation.guest_phone}</span>
              </div>
            )}
            <div className="row">
              <span className="label">📍 Estado</span>
              <span className="value">⏳ Pendiente de confirmación</span>
            </div>
          </DetailsGrid>

          <Notice>
            <strong>Importante:</strong> Guarda tu código de confirmación. El negocio
            te contactará pronto al teléfono o correo que proporcionaste para confirmar
            tu reserva. Si necesitas cancelar, comunícate directamente con el negocio.
          </Notice>

          <Actions>
            <PrimaryBtn as={Link} to={`/negocio/${reservation.business?.slug}`}>
              <MapPin size={16} />
              Ver el negocio
            </PrimaryBtn>
            <GhostBtn onClick={() => navigate('/')}>
              <Home size={14} style={{ verticalAlign: '-2px', marginRight: '0.3rem' }} />
              Volver al inicio
            </GhostBtn>
          </Actions>
        </Card>
      </PageWrapper>
    </>
  );
};