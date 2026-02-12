import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase Admin (Service Role) for DB updates
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- Helper: Get or Create Portal Configuration ---
const getOrCreatePortalConfig = async (userPlan) => {
  // Define Configurations based on Plan
  // Elite: Can CANCEL only. No Updates (Downgrades).
  // Pro: Can UPDATE (Upgrade) and CANCEL.
  const isElite = userPlan === 'Elite';

  // Naming convention to find existing configs
  const configName = isElite ? 'Elite Portal Config' : 'Standard Portal Config';

  try {
    // 1. Check if config exists
    const configs = await stripe.billingPortal.configurations.list({ limit: 10 });
    const existingConfig = configs.data.find(c => c.metadata && c.metadata.type === configName);

    if (existingConfig) return existingConfig.id;

    // 2. Create new config
    const config = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription',
      },
      features: {
        payment_method_update: { enabled: true },
        customer_update: {
          enabled: true,
          allowed_updates: ['email', 'address', 'phone', 'tax_id'],
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          proration_behavior: 'none',
        },
        subscription_update: {
          enabled: !isElite, // Elite cannot update (downgrade)
          default_allowed_updates: ['price'],
          proration_behavior: 'always_invoice',
          // If Pro, allow upgrading to Elite (Need Elite Price ID). 
          // For simplicity in this logic, we enable updates for Pro, which lets them see available upgrades.
          // Note: In a real prod env, you'd explicitly list product IDs here to strictly control paths.
          // For now, enabling it for Pro allows them to switch. Disabling for Elite prevents them from switching.
        },
        invoice_history: { enabled: true },
      },
      metadata: { type: configName }
    });

    return config.id;
  } catch (err) {
    console.error("Error creating portal config:", err);
    return null; // Fallback to default portal
  }
};

// --- 1. Create Checkout Session ---
export const createStripeSession = async (req, res) => {
  try {
    const { userId, type, amount, planName, credits, creditType, couponCode } = req.body;

    if (!userId || !type) return res.status(400).json({ error: "Missing required fields" });

    // Gate: Custom Credits only for Paid Plans
    if (type === 'credit') {
      const { data: userUsage } = await supabase
        .from('user_usage')
        .select('plan_type')
        .eq('user_id', userId)
        .single();

      if (!userUsage || userUsage.plan_type === 'Free' || !userUsage.plan_type) {
        return res.status(403).json({ error: "Upgrade to a paid plan to purchase custom credits." });
      }
    }

    // Gate: Prevent Duplicate Subscriptions
    if (type === 'plan') {
      const { data: existingSub } = await supabase
        .from('user_usage')
        .select('subscription_status, plan_type')
        .eq('user_id', userId)
        .single();

      // If user has an active subscription that IS NOT 'Free', block new plan purchase
      if (existingSub && existingSub.subscription_status === 'active' && existingSub.plan_type !== 'Free') {
        return res.status(400).json({
          error: `You are already subscribed to the ${existingSub.plan_type} Plan. Please manage your subscription in Billing.`
        });
      }
    }

    // 1. Validate Coupon (If provided)
    let stripeCouponId = null;
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('stripe_coupon_id')
        .eq('code', couponCode)
        .eq('is_enabled', true)
        .single();

      if (coupon && coupon.stripe_coupon_id) {
        stripeCouponId = coupon.stripe_coupon_id;
      }
    }

    // 2. Create Transaction Record (Pending)
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: type === 'plan' ? 0 : amount, // Plan amount determined by Stripe, Credit amount known
        currency: 'usd',
        status: 'pending',
        type: type === 'plan' ? 'plan_purchase' : 'credit_topup',
        metadata: { planName, credits, creditType, couponCode }
      })
      .select()
      .single();

    if (txError) throw new Error(`DB Error: ${txError.message}`);

    let sessionConfig = {
      payment_method_types: ['card'],
      mode: type === 'plan' ? 'subscription' : 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/billing`,
      metadata: {
        transactionId: transaction.id,
        userId: userId,
        type: type, // 'plan' or 'credit'
        planName: planName, // For plans
        credits: credits,   // For credits
        creditType: creditType // 'voice' or 'chat'
      },
      line_items: []
    };

    // Apply Coupon if valid
    if (stripeCouponId) {
      if (typeof stripeCouponId === 'string' && stripeCouponId.startsWith('promo_')) {
        sessionConfig.discounts = [{ promotion_code: stripeCouponId }];
      } else {
        sessionConfig.discounts = [{ coupon: stripeCouponId }];
      }
    }

    if (type === 'plan') {
      // Lookup price based on plan name (Hardcoded for MVP, ideally assume Price ID in plan_settings)
      // We fetch the stripe_price_id from the DB as requested
      const { data: plan } = await supabase.from('plan_settings').select('stripe_price_id, price_usd').eq('plan_name', planName).single();

      if (!plan || !plan.stripe_price_id) {
        return res.status(400).json({ error: `Price ID not found for plan: ${planName}` });
      }

      sessionConfig.line_items.push({
        price: plan.stripe_price_id,
        quantity: 1
      });
    } else {
      // Credit Top-up (One-time)
      // Since we don't have predefined price IDs for every custom amount, we use ad-hoc price_data
      sessionConfig.line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `${credits} ${creditType === 'voice' ? 'Voice Minutes' : 'Chat Credits'}` },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1
      });
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Update Transaction with Session ID
    await supabase.from('transactions').update({ stripe_session_id: session.id }).eq('id', transaction.id);

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Session Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- 3. Create Portal Session (For Manage Billing) ---
export const createPortalSession = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    // 1. Get Stripe Customer ID and Current Plan from DB
    const { data: user } = await supabase
      .from('user_usage')
      .select('stripe_customer_id, plan_type')
      .eq('user_id', userId)
      .single();

    if (!user || !user.stripe_customer_id) {
      return res.status(400).json({ error: "No active billing account found. Please subscribe first." });
    }

    // 2. Get Dynamic Configuration ID
    const configurationId = await getOrCreatePortalConfig(user.plan_type);

    // 3. Create Portal Session with Config
    const sessionConfig = {
      customer: user.stripe_customer_id,
      return_url: `${process.env.CLIENT_URL}/billing`,
    };

    if (configurationId) {
      sessionConfig.configuration = configurationId;
    }

    const session = await stripe.billingPortal.sessions.create(sessionConfig);

    res.json({ url: session.url });

  } catch (err) {
    console.error("Portal Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- 4. Handle Webhook ---
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle Events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { transactionId, userId, type, planName, credits, creditType } = session.metadata;

      // 1. Optimistic Locking: Only proceed if status is 'pending'
      // This prevents race conditions where double webhooks trigger duplicate credits
      const { data: updatedTx, error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          amount: session.amount_total / 100,
          stripe_session_id: session.id, // Ensure session ID is captured
          // CRITICAL: Store Invoice ID to prevent duplicate logs from 'invoice.payment_succeeded'
          metadata: {
            ...session.metadata, // Keep existing metadata
            invoice_id: session.invoice // Store the Stripe Invoice ID
          }
        })
        .eq('id', transactionId)
        .eq('status', 'pending') // <--- CRITICAL: Only update if pending
        .select()
        .single();

      if (updateError && updateError.code !== 'PGRST116') { // PGRST116 = JSON object not found (row mismatch)
        console.error("Transaction Update Error:", updateError);
        return res.status(500).json({ error: "DB Error" });
      }

      // If no row returned, it means it was already completed or doesn't exist.
      // In either case, we stop here to prevent duplicate credit addition.
      if (!updatedTx) {
        console.log(`[Webhook] Transaction ${transactionId} already processed or not found.`);
        return res.json({ received: true });
      }

      console.log(`[Webhook] Transaction ${transactionId} marked blocked/completed. Proceeding to fulfill.`);

      // 3. Fulfill Order (Only runs ONCE now)
      if (type === 'plan') {
        const { data: plan } = await supabase.from('plan_settings').select('monthly_messages, monthly_voice_mins').eq('plan_name', planName).single();
        if (plan) {
          await supabase.from('user_usage').update({
            plan_type: planName,
            subscription_status: 'active',
            stripe_customer_id: session.customer,
            subscription_id: session.subscription,
            messages_left: plan.monthly_messages,
            voice_minutes_left: plan.monthly_voice_mins,
            current_plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }).eq('user_id', userId);
        }
      } else if (type === 'credit') {
        const creditAmount = parseFloat(credits);
        if (creditType === 'voice') {
          const { data: user } = await supabase.from('user_usage').select('voice_minutes_left').eq('user_id', userId).single();
          await supabase.from('user_usage').update({ voice_minutes_left: (user.voice_minutes_left || 0) + creditAmount }).eq('user_id', userId);
        } else {
          const { data: user } = await supabase.from('user_usage').select('messages_left').eq('user_id', userId).single();
          await supabase.from('user_usage').update({ messages_left: (user.messages_left || 0) + creditAmount }).eq('user_id', userId);
        }
      }
      break;
    }

    // --- Subscription Updated (Upgrades/Downgrades/Cancellation Toggles) ---
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const previousAttributes = event.data.previous_attributes;
      const customerId = subscription.customer;

      console.log(`[Webhook] Subscription Updated: ${subscription.id}`);

      // 1. Handle Cancellation Toggle (Cancel / Resume)
      if (previousAttributes && 'cancel_at_period_end' in previousAttributes) {
        const isCanceling = subscription.cancel_at_period_end;
        const newStatus = isCanceling ? 'active_canceling' : 'active';

        console.log(`[Webhook] Cancellation Toggle: ${isCanceling ? 'CANCELED' : 'RESUMED'}. Updating status to: ${newStatus}`);

        await supabase.from('user_usage').update({
          subscription_status: newStatus
        }).eq('stripe_customer_id', customerId);

        // INSERT TRANSACTION RECORD FOR TRACKING
        try {
          const { data: user } = await supabase.from('user_usage').select('user_id').eq('stripe_customer_id', customerId).single();
          if (user) {
            // Check for existing transaction to avoid duplicates
            // Composite key conceptually: user_id + subscription_id + action + timestamp (approx)
            // Hard to dedupe perfectly without a unique ID from Stripe for this action, 
            // but these are low-risk events (logging only).

            console.log(`[Webhook] Logging ${isCanceling ? 'CANCELLATION' : 'RESUMPTION'} transaction for user ${user.user_id}`);
            await supabase.from('transactions').insert({
              user_id: user.user_id,
              amount: 0,
              currency: 'usd',
              status: 'completed',
              type: isCanceling ? 'subscription_cancellation' : 'subscription_resumption',
              metadata: {
                source: 'stripe_webhook',
                event: 'customer.subscription.updated',
                action: isCanceling ? 'cancel' : 'resume',
                stripe_subscription_id: subscription.id
              }
            });
          }
        } catch (err) {
          console.error("Error logging cancellation/resumption transaction:", err);
        }
      }

      // 2. Handle Plan Change (Upgrade / Downgrade)
      // Only reset credits if the PLAN (Price ID) actually changed.
      if (previousAttributes && previousAttributes.items) {
        const priceId = subscription.items.data[0].price.id;

        // Find plan by price_id
        const { data: plan } = await supabase.from('plan_settings').select('plan_name, monthly_messages, monthly_voice_mins').eq('stripe_price_id', priceId).single();

        if (plan) {
          console.log(`[Webhook] Plan Changed to ${plan.plan_name}. Resetting limits.`);
          // Update User Usage
          await supabase.from('user_usage').update({
            plan_type: plan.plan_name,
            // messages_left: plan.monthly_messages, // REMOVED: Managed by invoice.payment_succeeded to preserve rollover
            // voice_minutes_left: plan.monthly_voice_mins, // REMOVED
            subscription_status: 'active' // Ensure it's active if they just switched
          }).eq('stripe_customer_id', customerId);
        }
      }
      break;
    }

    // --- Subscription Cancelled (At End of Period) ---
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      console.log(`[Webhook] Subscription DELETED (Expired). Reverting to Free.`);
      await supabase.from('user_usage').update({
        subscription_status: 'canceled',
        plan_type: 'Free'
      }).eq('stripe_customer_id', customerId);
      break;
    }

    // --- Payment Failed (Renewal) ---
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      await supabase.from('user_usage').update({
        subscription_status: 'past_due'
      }).eq('stripe_customer_id', customerId);
      break;
    }

    // --- Payment Succeeded (Renewals & Upgrades) ---
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      console.log(`[Webhook] Invoice Payment Succeeded. Reason: ${invoice.billing_reason}`);

      // Skip if this is the initial subscription (handled by checkout.session.completed)
      // billing_reason can be 'subscription_create', 'subscription_cycle', 'subscription_update'
      if (invoice.billing_reason === 'subscription_create') {
        return res.json({ received: true });
      }

      const customerId = invoice.customer;
      const amountPaid = invoice.amount_paid / 100;
      const currency = invoice.currency;

      // Safe Extract of Period
      const periodStart = (invoice.lines?.data?.[0]?.period?.start) ? new Date(invoice.lines.data[0].period.start * 1000).toISOString() : new Date().toISOString();
      const periodEnd = (invoice.lines?.data?.[0]?.period?.end) ? new Date(invoice.lines.data[0].period.end * 1000).toISOString() : new Date().toISOString();


      // Find User
      const { data: user } = await supabase.from('user_usage').select('user_id').eq('stripe_customer_id', customerId).single();

      if (user) {
        // Prevent Duplicate Invoice Logging
        // We check if a transaction with this invoice_id already exists in metadata
        // Note: This relies on metadata structure consistency.
        // We use a raw filter for JSONB metadata containing the invoice_id
        const { data: existingTx } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', user.user_id)
          .eq('metadata->>invoice_id', invoice.id) // Check deeply in metadata
          .single();

        if (existingTx) {
          console.log(`[Webhook] Transaction for Invoice ${invoice.id} already exists. Skipping duplicate log.`);
          return res.json({ received: true });
        }

        console.log(`[Webhook] Recording Transaction for User ${user.user_id}: $${amountPaid}`);

        // Insert Transaction Record
        try {
          await supabase.from('transactions').insert({
            user_id: user.user_id,
            amount: amountPaid,
            currency: currency,
            status: 'completed',
            type: invoice.billing_reason === 'subscription_update' ? 'plan_upgrade' : 'subscription_renewal',
            metadata: {
              invoice_id: invoice.id,
              plan_period_start: periodStart,
              plan_period_end: periodEnd
            }
          });
        } catch (insertErr) {
          console.error("[Webhook] Failed to insert transaction record:", insertErr);
        }

        // --- 4. Replenish Credits (Renewal Logic) ---
        // Verify this is a subscription renewal or update (not initial purchase)
        if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_update') {
          const priceId = invoice.lines.data[0]?.price?.id;
          if (priceId) {
            const { data: plan } = await supabase
              .from('plan_settings')
              .select('monthly_messages, monthly_voice_mins')
              .eq('stripe_price_id', priceId)
              .single();

            if (plan) {
              console.log(`[Webhook] Renewing Credits for User ${user.user_id}. Adding: ${plan.monthly_messages} msgs, ${plan.monthly_voice_mins} mins.`);

              // Fetch current balance to increment
              const { data: currentUserUsage } = await supabase
                .from('user_usage')
                .select('messages_left, voice_minutes_left')
                .eq('user_id', user.user_id)
                .single();

              const currentMessages = currentUserUsage?.messages_left || 0;
              const currentVoice = currentUserUsage?.voice_minutes_left || 0;

              await supabase.from('user_usage').update({
                messages_left: currentMessages + plan.monthly_messages,
                voice_minutes_left: currentVoice + plan.monthly_voice_mins,
                current_plan_expires_at: periodEnd, // Update expiration
                subscription_status: 'active'
              }).eq('user_id', user.user_id);
            }
          }
        }
      } else {
        console.error(`[Webhook] User not found for Stripe Customer: ${customerId}`);
      }
      break;
    }
  }

  res.json({ received: true });
};