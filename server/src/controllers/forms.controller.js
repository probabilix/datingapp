import { supabase } from '../config/supabase.js';

export const handleDiscoverySubmit = async (req, res) => {
    try {
        const { userId, answers } = req.body;

        if (!userId || !answers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data: setting, error: dbError } = await supabase
            .from('system_settings')
            .select('key_value')
            .eq('key_name', 'N8N_DISCOVERY_WEBHOOK')
            .maybeSingle();

        if (dbError || !setting?.key_value) {
            console.error("Failed to find Discovery Webhook in DB:", dbError?.message);
            return res.status(500).json({ error: 'Configuration Error' });
        }

        const response = await fetch(setting.key_value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ userId, answers })
        });

        if (!response.ok) {
            console.error(`N8N Discovery returned ${response.status}`);
            return res.status(502).json({ error: 'The AI analyst is currently busy. Please try again in a moment.' });
        }

        // Return empty 200 OK since the original code just checked response.ok
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Discovery Controller Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleContactSubmit = async (req, res) => {
    try {
        // req.body contains all fields sent from ContactPage
        const payload = req.body;

        const { data, error: dbError } = await supabase
            .from('system_settings')
            .select('key_value')
            .eq('key_name', 'N8N_CONTACT_WEBHOOK')
            .single();

        if (dbError || !data?.key_value) {
            console.error("Failed to find Contact Webhook in DB:", dbError?.message);
            return res.status(500).json({ error: 'Configuration Error' });
        }

        const response = await fetch(data.key_value, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error(`N8N Contact returned ${response.status}`);
            return res.status(502).json({ error: 'Failed to send message.' });
        }

    } catch (error) {
        console.error("Contact Controller Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
