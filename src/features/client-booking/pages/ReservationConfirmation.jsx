import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Home, MapPin, MessageCircle, CreditCard } from 'lucide-react';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import { reservationsService } from '../services/reservationsService';
import { createMercadoPagoPreference } from '../../../services/mercadoPagoService';
import { supabase } from '../../../services/supabaseClient';
import { buildClientToBusinessWhatsAppUrl } from '../../../utils/whatsapp';
import {
  PageWrapper, Card, SuccessIcon, Title, Subtitle, CodeBox,
  DetailsGrid, Notice, Actions, PrimaryBtn, GhostBtn,
  LoadingWrapper, ErrorWrapper,
} from './ReservationConfirmation.styles';
import { toast } from '../../../utils/alerts';

export const ReservationConfirmation = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await reservationsService.getByConfirmationCode(code);
        if (!alive) return;

        // Si Mercado Pago regresó con ?payment=approved, confirmamos la reserva en Supabase
        const paymentStatus = searchParams.get('payment');
        if (paymentStatus === 'approved' && data && data.status === 'pending') {
          await supabase
            .from('reservations')
            .update({
              status: 'confirmed',
              notes: 'Anticipo aprobado vía Mercado Pago Sandbox',
            })
            .eq('id', data.id);

          data.status = 'confirmed';
          toast.success('¡Anticipo recibido! Tu reservación quedó confirmada.');
        }

        setReservation(data);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [code, searchParams]);

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

  const getStartDate = (range) => {
    const match = String(range || '').match(/[[(]([^,]+),/);
    return match ? new Date(match[1]) : null;
  };

  const tz = reservation.business?.timezone || 'America/Mexico_City';
  const startDate = getStartDate(reservation.during);

  const formattedDateTime = startDate
    ? startDate.toLocaleString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
      })
    : '—';

  const dateLabel = startDate
    ? startDate.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: tz,
      })
    : '';

  const timeLabel = startDate
    ? startDate.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
      })
    : '';

  const tableNames = (reservation.reservation_tables || [])
    .filter((rt) => rt.active !== false)
    .map((rt) => rt.table?.name)
    .filter(Boolean)
    .join(', ');

  const waUrl = buildClientToBusinessWhatsAppUrl({
    businessWhatsapp: reservation.business?.whatsapp || reservation.business?.phone,
    businessName: reservation.business?.name,
    confirmationCode: reservation.confirmation_code,
    guestName: reservation.guest_name,
    dateLabel,
    timeLabel,
    partySize: reservation.party_size,
    tableName: tableNames,
  });

  const handlePayAdvance = async () => {
    try {
      setPaying(true);
      const pref = await createMercadoPagoPreference({
        reservationId: reservation.id,
        confirmationCode: reservation.confirmation_code,
        businessName: reservation.business?.name,
        amount: 100,
        payerEmail: reservation.guest_email,
      });

      window.location.href = pref.sandbox_init_point || pref.init_point;
    } catch (err) {
      toast.error(err.message || 'No se pudo iniciar el pago con Mercado Pago');
    } finally {
      setPaying(false);
    }
  };

  const isConfirmed = reservation.status === 'confirmed';

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Card>
          <SuccessIcon>
            <CheckCircle2 />
          </SuccessIcon>

          <Title>{isConfirmed ? '¡Reserva confirmada!' : '¡Reserva recibida!'}</Title>
          <Subtitle>
            Tu solicitud fue enviada a <strong>{reservation.business?.name}</strong>.
            {isConfirmed
              ? ' Tu anticipo fue acreditado y tu lugar está asegurado.'
              : ' Puedes adelantar tu anticipo o enviar tu folio por WhatsApp.'}
          </Subtitle>

          <CodeBox>
            <div className="label">Código de confirmación</div>
            <div className="code">{reservation.confirmation_code}</div>
          </CodeBox>

          <DetailsGrid>
            <div className="row">
              <span className="label">📅 Cuándo</span>
              <span className="value">{formattedDateTime}</span>
            </div>
            <div className="row">
              <span className="label">👥 Personas</span>
              <span className="value">{reservation.party_size}</span>
            </div>
            {tableNames && (
              <div className="row">
                <span className="label">🪑 Mesa / Espacio</span>
                <span className="value">{tableNames}</span>
              </div>
            )}
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
              <span className="value">
                {isConfirmed ? '✅ Confirmada' : '⏳ Pendiente de confirmación'}
              </span>
            </div>
          </DetailsGrid>

          <Notice>
            <strong>Importante:</strong> Guarda tu código de confirmación. El negocio
            te contactará pronto al teléfono o correo que proporcionaste para confirmar
            tu reserva. Si necesitas cancelar, comunícate directamente con el negocio.
          </Notice>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '1rem',
              width: '100%',
            }}
          >
            {!isConfirmed && (
              <button
                type="button"
                onClick={handlePayAdvance}
                disabled={paying}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#009EE3',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: paying ? 'not-allowed' : 'pointer',
                  opacity: paying ? 0.7 : 1,
                }}
              >
                <CreditCard size={18} />
                {paying ? 'Conectando con Mercado Pago...' : 'Pagar anticipo ($100 MXN) con Mercado Pago'}
              </button>
            )}

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={18} />
                Enviar folio por WhatsApp al negocio
              </a>
            )}
          </div>

          <Actions>
            <PrimaryBtn as={Link} to={`/negocio/${reservation.business?.slug}`}>
              <MapPin size={16} />
              Ver el negocio
            </PrimaryBtn>

            <GhostBtn
              onClick={() => {
                const url = `${window.location.origin}/mi-reserva`;
                navigator.clipboard.writeText(url);
                toast.success('Enlace copiado. Guárdalo para consultar tu reserva después.');
              }}
            >
              📋 Copiar enlace de consulta
            </GhostBtn>

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