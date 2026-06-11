/**
 * ========================================================
 * ApexTools Express Server & Dodo Payments Webhook Handler
 * ========================================================
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to capture the raw request body buffer for cryptographic signature checking
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

const fs = require('fs');

const SESSION_SECRET = process.env.SESSION_SECRET || 'apextools_secret_passphrase_guard_98765';
const SUBS_FILE = path.join(__dirname, 'subscriptions.json');

// --- Subscriptions JSON File Database Helpers ---
function readSubscriptions() {
  try {
    if (!fs.existsSync(SUBS_FILE)) {
      return {};
    }
    const data = fs.readFileSync(SUBS_FILE, 'utf8');
    return JSON.parse(data || '{}');
  } catch (err) {
    console.error('Error reading subscriptions database:', err);
    return {};
  }
}

function writeSubscriptions(subs) {
  try {
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing subscriptions database:', err);
  }
}

function activateSubscription(email, durationDays = 365) {
  const subs = readSubscriptions();
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + durationDays);
  
  subs[email.toLowerCase()] = {
    active: true,
    expiry: expiry.toISOString(),
    updatedAt: new Date().toISOString()
  };
  writeSubscriptions(subs);
  console.log(`[Database] Subscription activated/renewed for ${email}. Expiry: ${expiry.toISOString()}`);
}

function cancelSubscription(email) {
  const subs = readSubscriptions();
  if (subs[email.toLowerCase()]) {
    subs[email.toLowerCase()].active = false;
    subs[email.toLowerCase()].updatedAt = new Date().toISOString();
    writeSubscriptions(subs);
    console.log(`[Database] Subscription deactivated for ${email}`);
  }
}

// --- Cryptographic Signed Cookie Helpers ---
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts.shift().trim();
      const val = parts.join('=').trim();
      list[name] = decodeURIComponent(val);
    });
  }
  return list;
}

function signValue(value, secret) {
  return value + '.' + crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function unsignValue(signedValue, secret) {
  if (!signedValue) return null;
  const parts = signedValue.split('.');
  if (parts.length < 2) return null;
  const value = parts.slice(0, -1).join('.');
  const signature = parts[parts.length - 1];
  const expectedSignature = crypto.createHmac('sha256', secret).update(value).digest('base64url');
  
  const bufA = Buffer.from(signature);
  const bufB = Buffer.from(expectedSignature);
  if (bufA.length !== bufB.length) return null;
  
  try {
    if (crypto.timingSafeEqual(bufA, bufB)) {
      return value;
    }
  } catch (e) {}
  return null;
}

// --- Gatekeeper Middleware for Tools folder ---
app.use('/tools', (req, res, next) => {
  const cookies = parseCookies(req);
  const authCookie = cookies['apextools_auth'];
  
  if (!authCookie) {
    console.warn(`[Gatekeeper] Unauthorized access attempt to ${req.originalUrl}. No auth cookie present.`);
    return res.redirect('/checkout.html?status=unauthorized');
  }

  const email = unsignValue(authCookie, SESSION_SECRET);
  if (!email) {
    console.warn(`[Gatekeeper] Unauthorized access attempt to ${req.originalUrl}. Invalid cookie signature.`);
    return res.redirect('/checkout.html?status=unauthorized');
  }

  const subs = readSubscriptions();
  const userSub = subs[email.toLowerCase()];

  if (!userSub || !userSub.active || new Date(userSub.expiry) < new Date()) {
    console.warn(`[Gatekeeper] Unauthorized access attempt to ${req.originalUrl} for ${email}. Subscription expired or inactive.`);
    return res.redirect('/checkout.html?status=expired');
  }

  // User has active subscription. Proceed to serve tool files statically.
  next();
});

// Serve all static portal files
app.use(express.static(path.join(__dirname)));

/**
 * POST /api/webhook
 * Handles incoming Dodo Payments notifications.
 * Cryptographically verifies signatures using HMAC SHA-256 with DODO_PAYMENTS_WEBHOOK_KEY.
 */
app.post('/api/webhook', (req, res) => {
  const signature = req.headers['webhook-signature'] || req.headers['svix-signature'] || req.headers['x-webhook-signature'];
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

  console.log(`[Dodo Payments Webhook] Received request at /api/webhook`);

  if (!signature) {
    console.error('Error: Webhook signature header is missing.');
    return res.status(400).json({ error: 'Webhook signature header missing' });
  }

  if (!webhookKey || webhookKey === 'your_webhook_key_here') {
    console.warn('Warning: DODO_PAYMENTS_WEBHOOK_KEY is not configured or is a placeholder. Bypassing validation (development mode).');
  } else {
    try {
      const svixId = req.headers['svix-id'] || req.headers['webhook-id'];
      const svixTimestamp = req.headers['svix-timestamp'] || req.headers['webhook-timestamp'];
      
      let verified = false;

      if (svixId && svixTimestamp) {
        // Standard Svix Webhook Verification
        let key = webhookKey;
        if (webhookKey.startsWith('whsec_')) {
          key = webhookKey.substring(6);
        }
        const secretBuffer = Buffer.from(key, 'base64');
        const signedContent = `${svixId}.${svixTimestamp}.${req.rawBody.toString('utf8')}`;
        
        // Split space-delimited signatures
        const parts = signature.split(' ');
        for (const part of parts) {
          const [version, sig] = part.split(',');
          if (version === 'v1' && sig) {
            const computed = crypto
              .createHmac('sha256', secretBuffer)
              .update(signedContent)
              .digest('base64');
            
            try {
              if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(computed))) {
                verified = true;
                break;
              }
            } catch (e) {}
          }
        }
      } else {
        // Fallback: Simple Body HMAC (for dev environment simulator / testing compatibility)
        const computedSignature = crypto
          .createHmac('sha256', webhookKey)
          .update(req.rawBody)
          .digest('hex');
        verified = (computedSignature === signature);
      }

      if (!verified) {
        console.error('Error: Webhook signature verification failed.');
        return res.status(400).json({ error: 'Signature mismatch' });
      }
      console.log('[Dodo Payments Webhook] Signature verified successfully.');
    } catch (err) {
      console.error('Error during webhook verification:', err.message);
      return res.status(400).json({ error: 'Signature verification error' });
    }
  }

  const event = req.body;
  if (!event || !event.type) {
    console.error('Error: Invalid webhook body received.');
    return res.status(400).json({ error: 'Invalid payload' });
  }

  console.log(`[Dodo Payments Webhook] Event Type: ${event.type}`);
  console.log(`[Dodo Payments Webhook] Payload:`, JSON.stringify(event, null, 2));

  // Process subscription & payment lifecycle events and update database
  switch (event.type) {
    case 'payment.succeeded': {
      const paymentData = event.data;
      const customer = paymentData.customer;
      const email = customer ? customer.email : null;
      if (email) {
        activateSubscription(email);
      }
      break;
    }
    case 'subscription.created': {
      const subData = event.data;
      const customer = subData.customer;
      const email = customer ? customer.email : null;
      if (email) {
        activateSubscription(email);
      }
      break;
    }
    case 'subscription.cancelled': {
      const subData = event.data;
      const customer = subData.customer;
      const email = (customer && customer.email) || subData.customer_email;
      if (email) {
        cancelSubscription(email);
      }
      break;
    }
    default:
      console.log(`[Info] Unhandled webhook event type: ${event.type}`);
  }

  // Acknowledge receipt of the webhook event
  res.status(200).json({ received: true });
});


// POST /api/create-checkout-session
// Initiates a secure checkout session with Dodo Payments, falling back to simulation if configuration is missing or invalid.
app.post('/api/create-checkout-session', async (req, res) => {
  const { email, name, productId } = req.body;
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  const isLive = process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode';
  const baseUrl = isLive ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';

  console.log(`[Checkout Session] Request received. Email: ${email}, ProductId: ${productId}`);

  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('Warning: DODO_PAYMENTS_API_KEY is not configured or is a placeholder. Using mock redirection.');
    return res.json({ checkout_url: `/checkout-success.html?email=${encodeURIComponent(email || 'demo@apextools.io')}&mock=true` });
  }

  try {
    const payload = {
      product_cart: [
        {
          product_id: productId || process.env.DODO_PAYMENTS_PRODUCT_ID || 'pdp_01j04qg9vze4k7scsw573f0k12', // standard fallback product ID
          quantity: 1
        }
      ],
      customer: {
        email: email || 'test-customer@apextools.io',
        name: name || 'Apex Customer'
      },
      billing_address: {
        country: 'US'
      }
    };

    const response = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Checkout Session] Dodo Payments API Error:', data);
      // Fail gracefully to simulation redirect with error logging so the demo does not freeze
      return res.json({ 
        checkout_url: `/checkout-success.html?email=${encodeURIComponent(email || 'demo@apextools.io')}&mock=true&error=${encodeURIComponent(JSON.stringify(data.detail || data.message || 'API error'))}` 
      });
    }

    console.log('[Checkout Session] Checkout session created successfully:', data.checkout_url);
    res.json({ checkout_url: data.checkout_url });
  } catch (err) {
    console.error('[Checkout Session] Exception:', err);
    res.json({ checkout_url: `/checkout-success.html?email=${encodeURIComponent(email || 'demo@apextools.io')}&mock=true&error=${encodeURIComponent(err.message)}` });
  }
});

// POST /api/simulate-webhook
// Internal development route to simulate Dodo Payments webhook events in local terminal logs.
app.post('/api/simulate-webhook', (req, res) => {
  const { email, eventType } = req.body;
  const transId = 'tx_mock_' + Math.random().toString(36).substring(2, 11);
  const subId = 'sub_mock_' + Math.random().toString(36).substring(2, 11);
  const targetEmail = email || 'demo@apextools.io';

  console.log(`\n========================================================`);
  console.log(`📢 [Simulated Webhook] Event triggered manually: ${eventType || 'payment.succeeded'}`);
  console.log(`👤 Customer: ${targetEmail}`);
  console.log(`💵 Amount: $99.00 USD`);
  console.log(`🆔 Transaction: ${transId}`);
  console.log(`🔑 Subscription: ${subId}`);
  console.log(`========================================================\n`);

  // Persist the subscription status inside our JSON database
  if (eventType === 'subscription.cancelled') {
    cancelSubscription(targetEmail);
  } else {
    activateSubscription(targetEmail);
  }

  res.json({
    success: true,
    event: {
      type: eventType || 'payment.succeeded',
      data: {
        transaction_id: transId,
        amount: 9900,
        customer: {
          email: targetEmail,
          name: 'Apex Customer'
        },
        subscription_id: subId
      }
    }
  });
});

// POST /api/auth-pass
// Validates whether an email has an active pass and issues a signed HTTP-Only pass cookie.
app.post('/api/auth-pass', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const subs = readSubscriptions();
  const userSub = subs[email.toLowerCase()];

  if (!userSub || !userSub.active || new Date(userSub.expiry) < new Date()) {
    return res.status(401).json({ success: false, error: 'No active All-Access Pass found for this email address.' });
  }

  // Generate cryptographically signed token
  const signedCookie = signValue(email.toLowerCase(), SESSION_SECRET);

  // Set secure HTTP-only cookie
  res.cookie('apextools_auth', signedCookie, {
    httpOnly: true,
    secure: false, // Set to false so it works on local HTTP and user's HTTP domain
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  });

  console.log(`[Auth] Pass activated successfully for ${email}. Cookie issued.`);
  res.json({ success: true, email: email.toLowerCase() });
});

// Fallback to index.html for undefined frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 ApexTools Portal is running at http://localhost:${PORT}`);
  console.log(`🔌 Webhook Verification Endpoint: http://localhost:${PORT}/api/webhook`);
  console.log(`========================================================`);
});
