# Stripe Payment Integration Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Stripe Setup Steps

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Complete the account setup process

2. **Get Your API Keys**
   - Go to the Stripe Dashboard
   - Navigate to "Developers" > "API keys"
   - Copy your "Publishable key" and "Secret key"
   - Add them to your `.env.local` file

3. **Set Up Webhooks (Optional for testing)**
   - In Stripe Dashboard, go to "Developers" > "Webhooks"
   - Add endpoint: `https://yourdomain.com/api/webhook/stripe`
   - Select events: 
     - `checkout.session.completed` (required)
     - `checkout.session.async_payment_failed` (recommended)
     - `payment_intent.payment_failed` (recommended)
     - `charge.dispute.created` (recommended)
     - `refund.created` (recommended)
     - `customer.created` (optional)
     - `customer.updated` (optional)
     - `account.updated` (optional)
   - Copy the webhook secret and add to `.env.local`

## Payment Flow

1. User clicks "Get 30 Critiques Now" on the offer page
2. System creates a Stripe checkout session for €4
3. User is redirected to Stripe's secure payment page
4. After successful payment, user is redirected to `/payment/success`
5. Webhook processes payment and adds 30 uploads to user's account
6. User can then use the uploads for face rating analysis

## Testing

- Use Stripe's test mode for development
- Test card numbers are available in Stripe documentation
- Example test card: `4242 4242 4242 4242`

## Production Deployment (Vercel)

### 1. Update Webhook Configuration

1. **Go to Stripe Dashboard** → **Developers** → **Webhooks**
2. **Update webhook endpoint** to your Vercel URL:
   ```
   https://your-app-name.vercel.app/api/webhook/stripe
   ```
3. **Select events**: `checkout.session.completed`
4. **Copy the webhook secret** and add it to Vercel environment variables

### 2. Environment Variables for Production

Set these in your Vercel project settings:

```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

### 3. Switch to Live Keys

- **Development**: Use test keys (sk_test_... and pk_test_...)
- **Production**: Use live keys (sk_live_... and pk_live_...)
- **Important**: Never use live keys in development

### 4. Test Production Setup

1. **Deploy to Vercel** with live Stripe keys
2. **Test payment flow** with real payment methods
3. **Verify webhook** receives events in Stripe Dashboard
4. **Check credit addition** works correctly

### 5. Security Considerations

- Keep webhook secret secure
- Use HTTPS for all webhook endpoints
- Validate webhook signatures in production
- Monitor failed webhook deliveries




