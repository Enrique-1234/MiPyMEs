// src/services/mercadoPagoService.js

export async function createMercadoPagoPreference({
  reservationId,
  confirmationCode,
  businessName,
  amount = 100,
  payerEmail,
}) {
  const response = await fetch('/api/create-preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reservationId,
      confirmationCode,
      businessName,
      amount,
      payerEmail,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'No se pudo generar el enlace de pago');
  }

  return data;
}