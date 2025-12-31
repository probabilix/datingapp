import express from 'express';
import { createPaypalOrder } from '../controllers/paypal.controller.js';

const router = express.Router();
router.post('/create-order', createPaypalOrder);

export default router;