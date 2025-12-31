import express from 'express';
import cors from 'cors';
import stripeRoutes from './routes/stripe.routes.js';
import paypalRoutes from './routes/paypal.routes.js';
import razorpayRoutes from './routes/razorpay.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Modular Payment Routing
app.use('/api/payments/stripe', stripeRoutes);
app.use('/api/payments/paypal', paypalRoutes);
app.use('/api/payments/razorpay', razorpayRoutes);

export default app;