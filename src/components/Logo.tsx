import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LogoProps {
    className?: string; // To allow custom sizing per component
}

export const Logo: React.FC<LogoProps> = ({ className = "h-14 w-auto object-contain" }) => {
    const [logoUrl, setLogoUrl] = useState('/plain-logo.png'); // Default local logo

    useEffect(() => {
        let mounted = true;

        async function fetchAdminLogo() {
            try {
                const { data, error } = await supabase
                    .from('system_settings')
                    .select('key_value')
                    .eq('key_name', 'PLAIN_LOGO_URL')
                    .single();

                if (error) throw error;

                if (data?.key_value && mounted) {
                    setLogoUrl(data.key_value);
                }
            } catch (error) {
                console.error("Failed to load admin logo.", error);
            }
        }

        fetchAdminLogo();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <img
            src={logoUrl}
            alt="DatingAdvice Logo"
            className={className}
        />
    );
}
