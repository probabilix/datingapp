import express from 'express';
import cors from 'cors';
import stripeRoutes from './routes/stripe.routes.js';
import paypalRoutes from './routes/paypal.routes.js';
import razorpayRoutes from './routes/razorpay.routes.js';

const app = express();
app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.CLIENT_URL // Dynamic fallback from env
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

import authRoutes from './routes/auth.routes.js';
import notificationRoutes from './routes/notifications.routes.js';

// Modular Payment Routing
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments/stripe', stripeRoutes);
app.use('/api/payments/paypal', paypalRoutes);
app.use('/api/payments/razorpay', razorpayRoutes);

export default app;