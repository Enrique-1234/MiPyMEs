// src/features/client-booking/pages/BusinessDetail.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Clock, Mail, Users, Calendar,
  AlertCircle, CheckCircle2, Lock
} from 'lucide-react';
import { Navbar } from '../../../components/common/Navbar/Navbar';
import { publicBusinessesService } from '../services/publicBusinessesService';
import { supabase } from '../../../services/supabaseClient'; // 👈 Necesario para las mesas
import {
  PageWrapper, Container, HeroCard, HeroContent, Logo, HeroInfo,
  InfoGrid, Panel, InfoList, HoursList, HoursTime, ReservationCard,
  FieldLabel, PartySizeStepper, DateScroller, DateChip,
  SlotsGrid, SlotButton, HelperText, ErrorBox, LoadingContainer, BackLink,
} from './BusinessDetail.styles';
import { ReservationModal } from './ReservationModal';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Formatea 'YYYY-MM-DD' local
const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Formatea 'HH:MM:SS' → '11:30 AM'
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

// Formatea un timestamp UTC a la timezone del negocio
const formatSlotTime = (isoStr, timezone) => {
  try {
    return new Date(isoStr).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || 'America/Mexico_City',
    });
  } catch {
    return '—';
  }
};

export const BusinessDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Estado del widget de reserva
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Estados para mesas y eventos privados
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [availableTablesData, setAvailableTablesData] = useState([]);
  const [isPrivateEvent, setIsPrivateEvent] = useState(false);

  // Detectar el tipo de negocio para adaptar los textos
  const isRestaurant = business?.type_id === 'restaurante' || business?.type_id === 'eventos';
  const isAppointment = business?.type_id === 'barberia' || business?.type_id === 'veterinaria';
  // Solo estos tipos de negocio permiten reservar todo el lugar
  const allowPrivateEvent = ['restaurante', 'eventos', 'cafeteria', 'iglesia'].includes(business?.type_id);
  // Título dinámico
  const bookingTitle = isRestaurant ? 'Reserva tu mesa' : 'Agenda tu cita';
  
  // Texto dinámico para personas
  const partySizeLabel = isAppointment ? '¿Para cuántas personas?' : '¿Cuántas personas?';

  // Cargar negocio
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const biz = await publicBusinessesService.getBySlug(slug);
        if (!alive) return;
        setBusiness(biz);
        setHours(biz.business_hours || []);

        // Seleccionar la primera fecha válida
        const days = buildNext14Days(biz.business_hours || []);
        const firstOpen = days.find((d) => !d.isClosed);
        if (firstOpen) setSelectedDate(firstOpen.iso);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [slug]);

  // Cada 14 días con información de si el negocio abre
  const days = useMemo(() => {
    if (!business) return [];
    return buildNext14Days(hours);
  }, [business, hours]);

  // Consultar disponibilidad cuando cambia fecha o tamaño de grupo
  useEffect(() => {
    if (!business || !selectedDate) return;
    let alive = true;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError('');
      setSlots([]);
      setSelectedSlot(null);
      setSelectedTableId(null);
      setIsPrivateEvent(false);
      setAvailableTablesData([]);
      try {
        const data = await publicBusinessesService.getAvailability(
          business.id,
          selectedDate,
          partySize
        );
        if (alive) setSlots(data);
      } catch (err) {
        if (alive) setSlotsError(err.message);
      } finally {
        if (alive) setSlotsLoading(false);
      }
    };
    fetchSlots();
    return () => { alive = false; };
  }, [business, selectedDate, partySize]);

  // Función para manejar la selección de un horario y buscar sus mesas
  const handleSlotSelect = async (slot) => {
    setSelectedSlot(slot);
    setSelectedTableId(null);
    setIsPrivateEvent(false);
    setAvailableTablesData([]);

    // Si el negocio tiene mesas disponibles para este slot, las buscamos
    if (slot.available_table_ids && slot.available_table_ids.length > 0) {
      const { data } = await supabase
        .from('tables')
        .select('id, name, capacity, shape, floor:floors(name)')
        .in('id', slot.available_table_ids);
      setAvailableTablesData(data || []);
    }
  };

  const todayDow = new Date().getDay();

  if (loading) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <Container>
            <LoadingContainer>
              <div className="spinner" />
              <span>Cargando negocio...</span>
            </LoadingContainer>
          </Container>
        </PageWrapper>
      </>
    );
  }

  if (error || !business) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <Container>
            <BackLink onClick={() => navigate('/')}>
              <ArrowLeft size={14} /> Volver al inicio
            </BackLink>
            <Panel>
              <ErrorBox>
                <AlertCircle size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} />
                {error || 'Negocio no encontrado'}
              </ErrorBox>
              <p style={{ marginTop: '1rem' }}>
                El negocio que buscas no existe o ya no está disponible.
              </p>
            </Panel>
          </Container>
        </PageWrapper>
      </>
    );
  }

  const maxParty = business.max_party_size || 20;
  const minParty = business.min_party_size || 1;

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Container>
          <BackLink onClick={() => navigate('/')}>
            <ArrowLeft size={14} /> Volver al inicio
          </BackLink>

          {/* ===== HERO ===== */}
          <HeroCard $cover={business.cover_url}>
            <HeroContent>
              <Logo $src={business.logo_url}>
                {!business.logo_url && (business.name?.[0] || 'A')}
              </Logo>
              <HeroInfo>
                <h1>{business.name}</h1>
                <div className="meta">
                  {business.business_types && (
                    <span>📂 {business.business_types.label}</span>
                  )}
                  {business.city && (
                    <span><MapPin size={13} /> {business.city}</span>
                  )}
                  {business.phone && (
                    <span><Phone size={13} /> {business.phone}</span>
                  )}
                </div>
              </HeroInfo>
            </HeroContent>
          </HeroCard>

          {/* ===== INFO + WIDGET ===== */}
          <InfoGrid>
            {/* Columna izquierda: Info */}
            <div>
              {business.description && (
                <Panel>
                  <h2>Sobre este lugar</h2>
                  <p>{business.description}</p>
                </Panel>
              )}

              <Panel>
                <h2>Información de contacto</h2>
                <InfoList>
                  {business.address && (
                    <li>
                      <MapPin size={16} />
                      <span>{business.address}{business.city ? `, ${business.city}` : ''}{business.state ? `, ${business.state}` : ''}</span>
                    </li>
                  )}
                  {business.phone && (
                    <li>
                      <Phone size={16} />
                      <a href={`tel:${business.phone}`}>{business.phone}</a>
                    </li>
                  )}
                  {business.email && (
                    <li>
                      <Mail size={16} />
                      <a href={`mailto:${business.email}`}>{business.email}</a>
                    </li>
                  )}
                </InfoList>
              </Panel>

              <Panel>
                <h2>Horarios de atención</h2>
                <HoursList>
                  {DAY_NAMES.map((name, i) => {
                    const dayHours = hours.filter((h) => h.day_of_week === i);
                    const isToday = i === todayDow;
                    const isClosed = dayHours.length === 0 || dayHours.every((h) => h.is_closed);

                    let display = 'Cerrado';
                    if (!isClosed) {
                      display = dayHours
                        .filter((h) => !h.is_closed)
                        .map((h) => `${formatTime(h.opens_at)} - ${formatTime(h.closes_at)}`)
                        .join(' · ');
                    }

                    return (
                      <li key={i} className={isToday ? 'today' : ''}>
                        <span>{name}{isToday ? ' (hoy)' : ''}</span>
                        <HoursTime $closed={isClosed}>{display}</HoursTime>
                      </li>
                    );
                  })}
                </HoursList>
              </Panel>
            </div>

            {/* Columna derecha: Widget de reserva */}
            <ReservationCard>
              <h2>
                <Calendar size={18} />
                {bookingTitle}
              </h2>

              {/* Party size */}
              <FieldLabel>{partySizeLabel}</FieldLabel>
              <PartySizeStepper>
                <button
                  type="button"
                  onClick={() => setPartySize((p) => Math.max(minParty, p - 1))}
                  disabled={partySize <= minParty}
                  aria-label="Menos personas"
                >
                  −
                </button>
                <div className="value">
                  <strong>{partySize}</strong>
                  <span>{partySize === 1 ? 'persona' : 'personas'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPartySize((p) => Math.min(maxParty, p + 1))}
                  disabled={partySize >= maxParty}
                  aria-label="Más personas"
                >
                  +
                </button>
              </PartySizeStepper>

              {/* Date scroller */}
              <FieldLabel>¿Qué día?</FieldLabel>
              <DateScroller>
                {days.map((d) => (
                  <DateChip
                    key={d.iso}
                    type="button"
                    $active={selectedDate === d.iso}
                    $disabled={d.isClosed}
                    onClick={() => !d.isClosed && setSelectedDate(d.iso)}
                    disabled={d.isClosed}
                  >
                    <span className="day">{DAY_SHORT[d.dow]}</span>
                    <span className="num">{d.dayNum}</span>
                  </DateChip>
                ))}
              </DateScroller>

              {/* Slots */}
              <FieldLabel>Horarios disponibles</FieldLabel>

              {slotsError && <ErrorBox>⚠️ {slotsError}</ErrorBox>}

              {slotsLoading && (
                <HelperText>Cargando horarios...</HelperText>
              )}

              {!slotsLoading && !slotsError && slots.length === 0 && (
                <HelperText>
                  No hay horarios disponibles para {partySize} {partySize === 1 ? 'persona' : 'personas'} en esta fecha.
                </HelperText>
              )}

              {!slotsLoading && slots.length > 0 && (
                <SlotsGrid>
                  {slots.map((slot, i) => {
                    const label = formatSlotTime(slot.slot_start, business.timezone);
                    const isSelected = selectedSlot?.slot_start === slot.slot_start;
                    return (
                      <SlotButton
                        key={i}
                        type="button"
                        $selected={isSelected}
                        onClick={() => handleSlotSelect(slot)}
                      >
                        {label}
                      </SlotButton>
                    );
                  })}
                </SlotsGrid>
              )}

              {/* Selector de mesa */}
              {selectedSlot && availableTablesData.length > 0 && !isPrivateEvent && (
                <div style={{ marginTop: '1.25rem' }}>
                  <FieldLabel>Elige tu mesa</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {availableTablesData.map(table => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => setSelectedTableId(table.id)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: `2px solid ${selectedTableId === table.id ? '#FF6B00' : 'var(--border)'}`,
                          background: selectedTableId === table.id ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                          color: selectedTableId === table.id ? '#FF6B00' : 'var(--text-soft)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {table.name}
                        <br/>
                        <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{table.floor?.name || 'Zona'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Opción de Evento Privado */}
              {selectedSlot && allowPrivateEvent && (
                  <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isPrivateEvent}
                      onChange={(e) => {
                        setIsPrivateEvent(e.target.checked);
                        if (e.target.checked) setSelectedTableId(null);
                      }}
                      style={{ width: '18px', height: '18px', accentColor: '#FF6B00' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>Reservar todo el lugar (Evento Privado)</span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '0.4rem', marginLeft: '1.7rem' }}>
                    Sujeto a aprobación del administrador.
                  </p>
                </div>
              )}

              {/* Confirmación visual */}
              {selectedSlot && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    fontSize: '0.85rem',
                    color: '#22C55E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>
                    Seleccionado: <strong>{formatSlotTime(selectedSlot.slot_start, business.timezone)}</strong>
                    {selectedTableId && ` · Mesa ${availableTablesData.find(t => t.id === selectedTableId)?.name}`}
                    {isPrivateEvent && ' · Todo el lugar'}
                  </span>
                </div>
              )}

              {/* Botón de continuar */}
              {selectedSlot && (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  disabled={availableTablesData.length > 0 && !selectedTableId && !isPrivateEvent}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: (availableTablesData.length > 0 && !selectedTableId && !isPrivateEvent) ? '#555' : (business?.primary_color || '#FF6B00'),
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: (availableTablesData.length > 0 && !selectedTableId && !isPrivateEvent) ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!(availableTablesData.length > 0 && !selectedTableId && !isPrivateEvent)) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {(availableTablesData.length > 0 && !selectedTableId && !isPrivateEvent) 
                    ? 'Selecciona una mesa para continuar' 
                    : 'Continuar con la reserva →'}
                </button>
              )}

              {!selectedSlot && !slotsLoading && slots.length > 0 && (
                <HelperText style={{ marginTop: '0.75rem' }}>
                  Toca un horario para continuar
                </HelperText>
              )}

              {/* Modal */}
              <ReservationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={(reservation) => {
                  setModalOpen(false);
                  navigate(`/reserva/${reservation.confirmation_code}`);
                }}
                business={business}
                slot={selectedSlot}
                partySize={partySize}
                availableTableIds={isPrivateEvent ? [] : (selectedTableId ? [selectedTableId] : [])}
                availableMergeIds={selectedSlot?.available_merge_ids || []}
                isPrivateEvent={isPrivateEvent}
              />
            </ReservationCard>
          </InfoGrid>
        </Container>
      </PageWrapper>
    </>
  );
};

/* ========================================================================
   Helpers
   ======================================================================== */

/**
 * Construye los próximos 14 días con metadata (día de la semana, si el
 * negocio abre ese día según su `business_hours`, etc).
 */
function buildNext14Days(businessHours) {
  const result = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mapa: day_of_week → { isClosed, opens: [] }
  const hoursByDow = {};
  for (let i = 0; i < 7; i++) {
    const shifts = (businessHours || []).filter((h) => h.day_of_week === i);
    const isClosed = shifts.length === 0 || shifts.every((h) => h.is_closed);
    hoursByDow[i] = { isClosed };
  }

  for (let offset = 0; offset < 14; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dow = date.getDay();
    result.push({
      iso: toISODate(date),
      dow,
      dayNum: date.getDate(),
      month: date.getMonth() + 1,
      isClosed: hoursByDow[dow]?.isClosed ?? true,
    });
  }

  return result;
}