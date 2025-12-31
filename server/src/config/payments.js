import { supabase } from './supabase.js';

export const getGatewayConfig = async (gatewayId) => {
  const { data, error } = await supabase
    .from('payment_settings')
    .select('*')
    .eq('id', gatewayId)
    .single();

  if (error || !data || !data.is_enabled) return null; // Logic to handle disabled gateways
  return data;
};