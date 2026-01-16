import { sendEmail } from '../config/email.js';
import { getWelcomeTemplate } from '../utils/emailTemplates.js';

export const sendWelcomeEmail = async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const htmlContent = getWelcomeTemplate(name);

        // CRITICAL FIX: In Vercel/Serverless, we MUST await the email.
        // "Fire and forget" causes the function to freeze before sending, 
        // leading to emails only sending on the *next* request (Cold Start thaw).
        await sendEmail(email, "Welcome to DatingAdvice.io! 💖", htmlContent);

        console.log(`[Welcome] Email successfully sent to ${email}`);
        res.json({ message: "Welcome email sent successfully" });
    } catch (error) {
        console.error("Welcome Email Error:", error);
        res.status(500).json({ error: "Failed to queue welcome email" });
    }
};
