import { sendEmail } from '../config/email.js';
import { getWelcomeTemplate } from '../utils/emailTemplates.js';

export const sendWelcomeEmail = async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const htmlContent = getWelcomeTemplate(name);

        // Fire and forget - don't block response
        sendEmail(email, "Welcome to DatingAdvice.io! 💖", htmlContent)
            .catch(err => console.error("Welcome Email Failed:", err));

        res.json({ message: "Welcome email queued" });
    } catch (error) {
        console.error("Welcome Email Error:", error);
        res.status(500).json({ error: "Failed to queue welcome email" });
    }
};
