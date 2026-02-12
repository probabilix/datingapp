import express from 'express';
import cors from 'cors';
import stripeRoutes from './routes/stripe.routes.js';
import authRoutes from './routes/auth.routes.js';
import notificationRoutes from './routes/notifications.routes.js';

const app = express();

// Trust Vercel Proxy (Needed for Rate Limiting to work correctly)
app.set('trust proxy', 1);

app.use(cors({
    origin: [
        process.env.CLIENT_URL // Dynamic fallback from env
    ].filter(Boolean),
    credentials: true
}));
// Apply JSON middleware globally EXCEPT for Stripe webhook
app.use((req, res, next) => {
    if (req.originalUrl.includes('/api/payments/stripe/webhook')) {
        next();
    } else {
        express.json()(req, res, next);
    }
});

import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

// Modular Payment Routing
// Apply strict limiter to Auth routes
app.use('/api/auth', authLimiter, authRoutes);

// Apply general limiter to other routes
app.use('/api/notifications', apiLimiter, notificationRoutes);

// Apply Stripe routes (Webhook needs raw body, handled inside router or before json middleware)
app.use('/api/payments/stripe', stripeRoutes);

export default app;