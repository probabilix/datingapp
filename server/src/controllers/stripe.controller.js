import Stripe from 'stripe';
import { getGatewayConfig } from '../config/payments.js';

export const createStripeSession = async (req, res) => {
  try {
    const config = await getGatewayConfig('stripe');
    if (!config) return res.status(503).json({ error: "Stripe disabled" });

    const stripe = new Stripe(config.secret_key);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: config.default_currency || 'usd',
          product_data: { name: req.body.itemName },
          unit_amount: Math.round(req.body.amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/billing`,
      metadata: { userId: req.body.userId }
    });
    res.json({ url: session.url });
  } catch (err) { res.status(500).json({ error: err.message }); }
};