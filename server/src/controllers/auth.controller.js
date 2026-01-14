import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../config/email.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';
import dotenv from 'dotenv';
dotenv.config();

// Create a Supabase Client with SERVICE_ROLE key (Admin)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // 1. Generate Link via Supabase Admin
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: `${process.env.CLIENT_URL || 'https://datingapp-one.vercel.app'}/reset-password`
            }
        });

        if (error) throw error;

        const recoveryLink = data.properties.action_link;
        // 2. Send Custom Email using Template
        const htmlContent = getResetPasswordTemplate(recoveryLink);

        const timestamp = new Date().toLocaleTimeString();
        await sendEmail(email, `Reset Password Request [${timestamp}]`, htmlContent);

        res.json({ message: "Password reset email sent successfully" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: error.message || "Failed to send reset email" });
    }
};
