import express from 'express';
import { handleContactSubmit, handleDiscoverySubmit } from '../controllers/forms.controller.js';

const router = express.Router();

router.post('/contact', handleContactSubmit);
router.post('/discovery', handleDiscoverySubmit);

export default router;
