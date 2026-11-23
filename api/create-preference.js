// api/create-preference.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: 'Falta configurar MP_ACCESS_TOKEN en Vercel' });
  }

  try {
    const {
      reservationId,
      confirmationCode,
      businessName,
      amount = 100, // Anticipo por defecto en MXN
      payerEmail,
    } = req.body || {};

    const origin = req.headers.origin || 'https://reserva-pro-equipo04.vercel.app';

    const preferencePayload = {
      items: [
        {
          id: reservationId || confirmationCode,
          title: `Anticipo de Reservación - ${businessName || 'Reserva Pro'} (${confirmationCode})`,
          quantity: 1,
          currency_id: 'MXN',
          unit_price: Number(amount),
        },
      ],
      payer: payerEmail ? { email: payerEmail } : undefined,
      external_reference: confirmationCode || reservationId,
      back_urls: {
       back_urls: {
        success: `${origin}/reserva/${confirmationCode}?payment=approved`,
        failure: `${origin}/reserva/${confirmationCode}?payment=failure`,
        pending: `${origin}/reserva/${confirmationCode}?payment=pending`,
      },
      },
      auto_return: 'approved',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferencePayload),
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      return res.status(mpResponse.status).json({ error: data.message || 'Error en Mercado Pago', details: data });
    }

    // sandbox_init_point abre el Checkout de pruebas de Mercado Pago
    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}