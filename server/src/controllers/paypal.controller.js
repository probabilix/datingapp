import paypal from "@paypal/checkout-server-sdk";
import { getGatewayConfig } from '../config/payments.js';

export const createPaypalOrder = async (req, res) => {
  try {
    const config = await getGatewayConfig('paypal');
    if (!config) return res.status(503).json({ error: "PayPal disabled" });

    const env = config.mode === 'live' 
      ? new paypal.core.LiveEnvironment(config.public_key, config.secret_key)
      : new paypal.core.SandboxEnvironment(config.public_key, config.secret_key);
    
    const client = new paypal.core.PayPalHttpClient(env);
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'USD', value: req.body.amount.toString() }
      }],
      application_context: {
        return_url: 'http://localhost:5173/dashboard',
        cancel_url: 'http://localhost:5173/billing'
      }
    });
    const order = await client.execute(request);
    res.json({ url: order.result.links.find(l => l.rel === 'approve').href });
  } catch (err) { res.status(500).json({ error: err.message }); }
};