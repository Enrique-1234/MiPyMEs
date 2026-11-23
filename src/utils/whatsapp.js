// src/utils/whatsapp.js

/**
 * Normaliza un número telefónico mexicano a formato internacional wa.me (52XXXXXXXXXX)
 */
export function formatPhoneMX(rawPhone) {
  if (!rawPhone) return '';
  const digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length === 10) return `52${digits}`;
  if (digits.length === 12 && digits.startsWith('52')) return digits;
  if (digits.length === 13 && digits.startsWith('521')) return `52${digits.slice(3)}`;
  return digits;
}

/**
 * Genera el enlace wa.me para que el CLIENTE envíe su comprobante/folio al negocio
 */
export function buildClientToBusinessWhatsAppUrl({
  businessWhatsapp,
  businessName,
  confirmationCode,
  guestName,
  dateLabel,
  timeLabel,
  partySize,
  tableName,
}) {
  const phone = formatPhoneMX(businessWhatsapp);
  if (!phone) return null;

  const message = [
    `Hola *${businessName}*, acabo de generar mi reservación en *Reserva Pro*:`,
    ``,
    `• *Folio:* ${confirmationCode}`,
    `• *Titular:* ${guestName}`,
    `• *Fecha:* ${dateLabel}`,
    `• *Horario:* ${timeLabel}`,
    `• *Personas:* ${partySize}`,
    tableName ? `• *Espacio/Mesa:* ${tableName}` : null,
    ``,
    `¿Me podrían confirmar de recibido?`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera el enlace wa.me para que el BUSINESS-ADMIN confirme o recuerde al cliente
 */
export function buildAdminToClientWhatsAppUrl({
  guestPhone,
  guestName,
  businessName,
  confirmationCode,
  dateLabel,
  timeLabel,
  status = 'confirmed',
}) {
  const phone = formatPhoneMX(guestPhone);
  if (!phone) return null;

  const statusText =
    status === 'confirmed'
      ? `tu reservación ha sido *CONFIRMADA*`
      : status === 'cancelled'
      ? `tu reservación ha sido *CANCELADA*`
      : `te recordamos tu próxima reservación`;

  const message = [
    `Hola *${guestName}*, te saludamos de *${businessName}* (vía Reserva Pro).`,
    `Te informamos que ${statusText}:`,
    ``,
    `• *Folio:* ${confirmationCode}`,
    `• *Fecha:* ${dateLabel}`,
    `• *Hora:* ${timeLabel}`,
    ``,
    `¡Te esperamos!`,
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}