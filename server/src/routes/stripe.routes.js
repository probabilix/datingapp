import express from 'express';
import { createStripeSession, handleStripeWebhook, createPortalSession } from '../controllers/stripe.controller.js';

const router = express.Router();

// Webhook must be raw for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

router.post('/create-session', createStripeSession);
router.post('/create-portal-session', createPortalSession);

export default router;