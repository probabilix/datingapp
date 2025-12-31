import Razorpay from 'razorpay';
import { getGatewayConfig } from '../config/payments.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const config = await getGatewayConfig('razorpay');
    if (!config) return res.status(503).json({ error: "Razorpay disabled" });

    // Initialize with keys from DB
    const rzp = new Razorpay({
      key_id: config.public_key,
      key_secret: config.secret_key,
    });

    const options = {
      amount: Math.round(req.body.amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await rzp.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};