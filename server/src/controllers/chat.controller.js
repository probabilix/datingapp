import { supabase } from '../config/supabase.js';

export const handleChat = async (req, res) => {
    try {
        const { message, agentId, userId, advisorName } = req.body;

        if (!message || !agentId || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Fetch N8N API Key from system_settings
        const { data: keyData, error: keyError } = await supabase
            .from('system_settings')
            .select('key_value')
            .eq('key_name', 'N8N_API_KEY')
            .single();

        if (keyError || !keyData) {
            console.error("Failed to fetch N8N API KEY", keyError);
            return res.status(500).json({ error: 'System configuration error' });
        }
        const n8nApiKey = keyData.key_value;

        // 2. Fetch the specific advisor's webhook URL
        const { data: advisorData, error: advisorError } = await supabase
            .from('advisors')
            .select('n8n_webhook_path')
            .eq('id', agentId)
            .single();

        if (advisorError || !advisorData?.n8n_webhook_path) {
            console.error("Failed to fetch Advisor webhook", advisorError);
            return res.status(404).json({ error: 'Advisor not found or webhook misconfigured' });
        }
        const webhookUrl = advisorData.n8n_webhook_path;

        // 3. Send request to N8N
        const n8nResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-N8N-API-KEY": n8nApiKey
            },
            body: JSON.stringify({
                message,
                agentId,
                userId,
                advisorName
            }),
        });

        if (!n8nResponse.ok) {
            console.error(`N8N returned ${n8nResponse.status}`);
            return res.status(502).json({ error: 'Failed to communicate with AI provider' });
        }

        const aiResponse = await n8nResponse.json();

        // 4. Return to client
        return res.json(aiResponse);

    } catch (error) {
        console.error("Chat Controller Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
