import { supabase } from '../config/supabase.js';

export const logTransaction = async (req, res) => {
  try {
    const { userId, gateway, amount, referenceId, itemName, couponUsed } = req.body;
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        gateway: gateway,
        amount: amount,
        reference_id: referenceId,
        item_name: itemName,
        status: 'pending',
        coupon_used: couponUsed || null
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};