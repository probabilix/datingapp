import express from 'express';
import { createStripeSession } from '../controllers/stripe.controller.js';
import { createPaypalOrder } from '../controllers/paypal.controller.js';

const router = express.Router();

router.post('/stripe/create-session', createStripeSession);
router.post('/paypal/create-order', createPaypalOrder);

export default router;