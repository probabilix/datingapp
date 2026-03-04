import express from 'express';
import { createStripeSession, handleStripeWebhook, createPortalSession, validateCoupon } from '../controllers/stripe.controller.js';

import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Webhook must be raw for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Apply Rate Limiting to Session Creation to prevent spam
router.post('/create-session', apiLimiter, createStripeSession);
router.post('/create-portal-session', apiLimiter, createPortalSession);
router.post('/validate-coupon', apiLimiter, validateCoupon);

export default router;