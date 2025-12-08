# Webhook Testing Guide

## Overview
Your webhook-based credit system is now properly implemented! Here's how to test it:

## What Changed

### 1. **Webhook (`app/api/webhook/stripe/route.ts`)**
- ✅ Now properly allocates credits to user accounts in Firebase
- ✅ Verifies payment status before adding credits
- ✅ Includes comprehensive error handling and logging
- ✅ Tracks payment history for audit trail

### 2. **Checkout Session (`app/api/create-checkout-session/route.ts`)**
- ✅ Now includes user ID in session metadata
- ✅ Webhook can identify which user to credit

### 3. **Offer Page (`app/offer/page.tsx`)**
- ✅ Passes user ID when creating checkout session
- ✅ Ensures webhook knows which user made the payment

### 4. **Success Page (`app/payment/success/page.tsx`)**
- ✅ No longer adds credits on frontend (security improvement)
- ✅ Refreshes user data to show updated credits from webhook
- ✅ Better user messaging about webhook processing

## Testing Steps

### 1. **Local Testing (Development)**
```bash
# Start your development server
npm run dev

# Use Stripe CLI to forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### 2. **Test Payment Flow**
1. Go to `/offer` page
2. Click "Buy for $15" button
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Check browser console for webhook logs
6. Verify credits appear in dashboard

### 3. **Webhook Verification**
Check your Stripe Dashboard → Developers → Webhooks to see:
- ✅ Webhook events are being received
- ✅ Events are being processed successfully
- ✅ No failed deliveries

### 4. **Database Verification**
Check Firebase Firestore:
- ✅ User document has updated `uploadsRemaining` field
- ✅ `lastPaymentDate` and `lastPaymentSessionId` are set
- ✅ `totalPayments` counter is incremented

## Production Deployment

### 1. **Update Webhook URL**
In Stripe Dashboard → Developers → Webhooks:
```
https://your-app-name.vercel.app/api/webhook/stripe
```

### 2. **Environment Variables**
Ensure these are set in Vercel:
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

### 3. **Test Production**
1. Deploy to Vercel
2. Test with real payment method (small amount)
3. Verify webhook receives events
4. Check credits are added correctly

## Security Benefits

✅ **Payment Verification**: Credits only added after confirmed payment
✅ **No Frontend Manipulation**: Credits added server-side only
✅ **Audit Trail**: All payments logged with session IDs
✅ **Reliable Delivery**: Webhooks ensure credits are added even if user closes browser
✅ **Error Handling**: Comprehensive logging for debugging

## Monitoring

### Check These Logs:
- Stripe Dashboard → Webhooks → Event logs
- Vercel Function logs
- Browser console (for frontend errors)
- Firebase console (for database updates)

### Success Indicators:
- Webhook events show "200 OK" status
- User credits increase after payment
- No failed webhook deliveries
- Payment success page shows confirmation

## Troubleshooting

### If Credits Don't Appear:
1. Check webhook is receiving events
2. Verify user_id is in session metadata
3. Check Firebase permissions
4. Look for errors in webhook logs

### If Webhook Fails:
1. Verify webhook secret is correct
2. Check Stripe keys are valid
3. Ensure Firebase is properly configured
4. Check network connectivity

## Next Steps

Your webhook system is now production-ready! The credits will be allocated securely and reliably through Stripe webhooks instead of the frontend.
