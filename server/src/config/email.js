import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Create Admin Client to fetch secrets (User should not have access to system_settings in frontend)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
);

export const sendEmail = async (to, subject, html) => {
    console.log("----- Starting Email Send Process -----");
    try {
        // 1. Dynamic Fetch: Get SMTP credentials from Database
        console.log("1. Fetching settings from Supabase System Settings...");
        const { data: settings, error } = await supabaseAdmin
            .from('system_settings')
            .select('key_name, key_value')
            .in('key_name', ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL', 'SMTP_SECURE']);

        if (error) {
            console.error("❌ DB Error fetching settings:", error);
            throw new Error("Failed to load SMTP settings from DB");
        }
        if (!settings || settings.length === 0) {
            console.error("❌ No settings found in DB. Did you run the SQL script?");
            throw new Error("No SMTP settings found");
        }

        console.log(`✅ Loaded ${settings.length} settings from DB.`);

        // Convert array to object key-value map
        const config = settings.reduce((acc, curr) => ({ ...acc, [curr.key_name]: curr.key_value }), {});

        // Validate essential keys
        if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
            console.error("❌ Missing keys in config:", Object.keys(config));
            throw new Error("Missing SMTP credentials in system_settings table");
        }

        console.log(`2. Creating Transporter (Host: ${config.SMTP_HOST}, User: ${config.SMTP_USER}, Port: ${config.SMTP_PORT})`);

        // 2. Create Transporter on the fly
        const transporter = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: parseInt(config.SMTP_PORT || '587'),
            secure: config.SMTP_SECURE === 'true',
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASS,
            },
            debug: true, // Show SMTP traffic
            logger: true // Log to console
        });

        // 3. Send Mail
        console.log("3. Sending Mail...");
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Dating Advice'}" <${config.SMTP_FROM_EMAIL}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Message sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("----- Email Process Complete -----");
        return info;

    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};
