// src/components/common/WeeklyChart/WeeklyChart.jsx
import React, { useMemo } from 'react';
import {
  ChartWrapper, ChartHeader, BarsRow, BarColumn, TrendRow, TrendCard, EmptyChart,
} from './WeeklyChart.styles';

const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Chart semanal reutilizable.
 * @param {Array} reservations - Lista de reservas (con during en formato tstzrange)
 * @param {Function} parseRange - Función para parsear during → { start, end }
 * @param {string} timezone - Zona horaria del negocio
 */
export const WeeklyChart = ({ reservations = [], parseRange, timezone }) => {
  const tz = timezone || 'America/Mexico_City';

  // Agrupa por día (últimos 7 días incluyendo hoy)
  const data = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push({
        date: d,
        dateKey: new Intl.DateTimeFormat('en-CA', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(d),
        dow: d.getDay(),
        isToday: i === 0,
        reservations: 0,
        guests: 0,
      });
    }

    const byKey = Object.fromEntries(days.map((d) => [d.dateKey, d]));

    for (const r of reservations) {
      const { start } = parseRange(r.during);
      if (!start) continue;
      if (['cancelled', 'no_show'].includes(r.status)) continue;

      const key = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(start);

      if (byKey[key]) {
        byKey[key].reservations += 1;
        byKey[key].guests += r.party_size || 0;
      }
    }

    return days;
  }, [reservations, parseRange, tz]);

  // Máximos para escalar las barras
  const maxReservations = useMemo(
    () => Math.max(1, ...data.map((d) => d.reservations)),
    [data]
  );
  const maxGuests = useMemo(
    () => Math.max(1, ...data.map((d) => d.guests)),
    [data]
  );

  // Totales de los próximos 7 días
  const totals = useMemo(() => {
    const totalReservations = data.reduce((s, d) => s + d.reservations, 0);
    const totalGuests = data.reduce((s, d) => s + d.guests, 0);

    return { totalReservations, totalGuests };
  }, [data]);

  if (reservations.length === 0) {
    return <EmptyChart>Sin datos para mostrar en el gráfico.</EmptyChart>;
  }

  return (
    <ChartWrapper>
      <ChartHeader>
        <div className="title-block">
          <h4>Próximos 7 días</h4>
          <p>Reservas y personas esperadas por día</p>
        </div>
        <div className="legend">
          <span><i className="dot reservations" /> Reservas</span>
          <span><i className="dot guests" /> Personas</span>
        </div>
      </ChartHeader>

      <BarsRow>
        {[...data].reverse().map((day, idx) => {
          const resPct = (day.reservations / maxReservations) * 100;
          const guestsPct = (day.guests / maxGuests) * 100;

          return (
            <BarColumn key={idx} $today={day.isToday}>
              <div className="value">
                {day.reservations > 0 ? day.reservations : ''}
              </div>
              <div className="bar-area">
                <div className="bar-stack">
                  <div
                    className="bar reservations"
                    style={{ height: `${Math.max(resPct, day.reservations > 0 ? 8 : 0)}%` }}
                    title={`${day.reservations} reservas`}
                  />
                  <div
                    className="bar guests"
                    style={{ height: `${Math.max(guestsPct, day.guests > 0 ? 8 : 0)}%` }}
                    title={`${day.guests} personas`}
                  />
                </div>
              </div>
              <div className="day-label">{DAY_SHORT[day.dow]}</div>
            </BarColumn>
          );
        })}
      </BarsRow>

      <TrendRow>
        <TrendCard>
          <div className="label">Reservas próximas</div>
          <div className="value-row">
            <span className="current">{totals.totalReservations}</span>
          </div>
        </TrendCard>
        <TrendCard>
          <div className="label">Personas esperadas</div>
          <div className="value-row">
            <span className="current">{totals.totalGuests}</span>
          </div>
        </TrendCard>
      </TrendRow>
    </ChartWrapper>
  );
};