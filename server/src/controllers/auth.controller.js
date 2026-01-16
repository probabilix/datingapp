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

    const start = Date.now();
    try {
        console.log(`[ForgotPwd] Started processing for ${email}`);

        // 1. Generate Link via Supabase Admin
        const t1 = Date.now();
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password`
            }
        });
        const linkDuration = Date.now() - t1;
        console.log(`[ForgotPwd] Link Gen took ${linkDuration}ms`);

        if (error) throw error;

        const recoveryLink = data.properties.action_link;
        // 2. Send Custom Email using Template
        const htmlContent = getResetPasswordTemplate(recoveryLink);

        // Removed timestamp as per user request to avoid syncing confusion
        const t2 = Date.now();
        await sendEmail(email, "Reset Password Request", htmlContent);
        const emailDuration = Date.now() - t2;
        console.log(`[ForgotPwd] Email Send took ${emailDuration}ms`);

        const totalDuration = Date.now() - start;
        res.json({
            message: "Password reset email sent successfully",
            timings: { link: linkDuration, email: emailDuration, total: totalDuration }
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        const totalDuration = Date.now() - start;
        res.status(500).json({
            error: error.message || "Failed to send reset email",
            timings: { total: totalDuration }
        });
    }
};
