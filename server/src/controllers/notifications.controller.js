import { sendEmail } from '../config/email.js';
import { getWelcomeTemplate } from '../utils/emailTemplates.js';
import { createClient } from '@supabase/supabase-js';

// Helper to get safe admin client
const getAdminClient = () => {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Supabase Admin Keys missing in environment");
    }
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
        { auth: { persistSession: false } }
    );
};

export const sendWelcomeEmail = async (req, res) => {
    const { email, name, userId } = req.body;
    console.log(`[Welcome] Request received for: ${email}, ID: ${userId}`);

    if (!email) {
        console.error("[Welcome] Missing email in payload");
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // Lazy Init
        const supabaseAdmin = getAdminClient();

        // 1. Atomic Idempotency Lock
        // We attempt to set the flag to TRUE only if it is currently FALSE.
        // If this update affects 0 rows, it means the flag was already TRUE (race condition or previous run).
        if (userId) {
            const { data: updatedRows, error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ welcome_email_sent: true })
                .eq('id', userId)
                .is('welcome_email_sent', false) // Only update if currently false (or null if we handled that, but default is false)
                .select();

            if (updateError) {
                console.error("[Welcome] DB Error during lock:", updateError);
                // If DB error, we probably shouldn't send to avoid risk.
                return res.status(500).json({ error: "Database error" });
            }

            // If no rows were updated, it means welcome_email_sent was already TRUE.
            if (!updatedRows || updatedRows.length === 0) {
                console.log(`[Welcome] Skipped. Email already sent to user ${userId} (Atomic Check).`);
                return res.json({ message: "Welcome email already sent" });
            }

            console.log(`[Welcome] Atomic Lock Acquired for ${userId}. Proceeding to send.`);
        }

        console.log("[Welcome] Generating template...");
        const htmlContent = getWelcomeTemplate(name);

        console.log(`[Welcome] Template generated. Sending to ${email}...`);

        // 2. Send Email
        // CRITICAL FIX: In Vercel/Serverless, we MUST await the email.
        await sendEmail(email, "Welcome to DatingAdvice.io! 💖", htmlContent);

        console.log(`[Welcome] Email successfully sent to ${email}`);
        res.json({ message: "Welcome email sent successfully" });
    } catch (error) {
        console.error("Welcome Email Error:", error);
        // We keep the flag TRUE to prevent infinite retry loops.
        res.status(500).json({
            error: "Failed to queue welcome email",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
