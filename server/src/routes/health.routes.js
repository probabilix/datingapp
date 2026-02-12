import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

router.get('/', async (req, res) => {
    const envCheck = {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_KEY: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY),
        STRIPE_SECRET: !!process.env.STRIPE_SECRET_KEY,
        CLIENT_URL: process.env.CLIENT_URL,
        NODE_ENV: process.env.NODE_ENV
    };

    let dbStatus = 'unknown';
    let dbError = null;

    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
        );
        const { data, error } = await supabase.from('system_settings').select('count', { count: 'exact', head: true });
        if (error) throw error;
        dbStatus = 'connected';
    } catch (err) {
        dbStatus = 'failed';
        dbError = err.message;
    }

    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        env: envCheck,
        db: { status: dbStatus, error: dbError }
    });
});

export default router;
