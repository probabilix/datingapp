import express from 'express';
import { sendWelcomeEmail } from '../controllers/notifications.controller.js';

const router = express.Router();

router.post('/welcome', sendWelcomeEmail);

export default router;
