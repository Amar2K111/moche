# Stripe Dispute Handling Documentation

## Overview

The Stripe webhook handler now includes comprehensive dispute-handling business logic for `charge.dispute.created` events. This implementation ensures robust handling of payment disputes with proper user account management, data persistence, and administrator notifications.

## Implementation Details

### Location
`app/api/webhook/stripe/route.ts` (lines ~203-386)

### Key Features

#### 1. **Idempotency Protection**
- Checks if a dispute has already been processed using Firestore document existence
- Prevents duplicate processing on webhook retries
- Returns appropriate response when duplicate is detected

#### 2. **User Lookup (Multi-Strategy)**
The system attempts to identify the user through multiple fallback methods:
1. **Charge Metadata** - Looks for `user_id` in the charge metadata
2. **Payment Intent Metadata** - Retrieves the payment intent and checks its metadata
3. **Email Lookup** - Queries Firestore users collection by billing email
4. **Graceful Degradation** - Continues processing even if user cannot be identified

```typescript
// Example metadata structure expected in Stripe charges:
{
  user_id: "firebase_user_id_here"
}
```

#### 3. **Firestore Data Persistence**

##### Disputes Collection
A new top-level collection `disputes` stores comprehensive dispute information:

```typescript
{
  disputeId: string,           // Stripe dispute ID
  chargeId: string,            // Associated charge ID
  amount: number,              // Amount in cents
  currency: string,            // Currency code (e.g., 'usd')
  reason: string,              // Dispute reason from Stripe
  status: string,              // Current dispute status
  evidence: object | null,     // Evidence details
  evidenceDetails: object | null,
  isChargeable: boolean,       // If charge can be refunded
  networkReasonCode: string | null,
  userId: string | null,       // Associated user ID
  userEmail: string | null,    // User email
  chargeMetadata: object,      // Full charge metadata
  createdAt: Date,             // When dispute was created
  processedAt: Date,           // When webhook processed it
  rawEvent: object            // Full Stripe event object
}
```

##### User Account Updates
When a user is identified, their document is updated with:

```typescript
{
  dispute_review: true,                    // Flag for review
  dispute_review_timestamp: Date,          // When flagged
  disputeCount: number,                    // Total disputes
  disputes: string[],                      // Array of dispute IDs
  accountRestricted: boolean,              // Restriction status
  lastDisputeId: string,                   // Most recent dispute
  lastDisputeReason: string,               // Reason for last dispute
  lastDisputeAmount: number,               // Amount of last dispute
  updatedAt: Date                          // Last update timestamp
}
```

##### Activity Log
Each dispute creates an entry in the user's activity subcollection:

```typescript
// users/{userId}/activity/{activityId}
{
  type: 'dispute_created',
  disputeId: string,
  amount: number,
  reason: string,
  accountRestricted: boolean,
  timestamp: Date
}
```

#### 4. **Account Restriction Logic**

The system automatically determines if an account should be restricted based on:

- **High-value disputes**: Amount greater than $100 USD
- **Fraud-related reasons**: Reasons include 'fraudulent' or 'product_unacceptable'
- **Multiple disputes**: User has 2 or more disputes

```typescript
const disputeAmountUSD = dispute.amount / 100
const isFraudRelated = ['fraudulent', 'product_unacceptable'].includes(dispute.reason)
const shouldRestrict = disputeAmountUSD > 100 || isFraudRelated || userDisputeCount >= 2
```

You can customize these thresholds by modifying the logic in the webhook handler.

#### 5. **Administrator Notifications**

The system implements a multi-channel notification approach:

##### Console Logging
All disputes are logged with a distinctive format for easy monitoring:
```
🚨 ADMIN ALERT: Dispute Created
```

##### Firestore Admin Notifications
Stored in `admin_notifications` collection for dashboard display:

```typescript
{
  type: 'dispute_alert',
  disputeId: string,
  chargeId: string,
  amount: string,              // Formatted with currency
  reason: string,
  status: string,
  userId: string,
  userEmail: string,
  userDisputeCount: number,
  accountRestricted: boolean,
  isChargeable: boolean,
  createdAt: string,           // ISO timestamp
  chargeMetadata: object,
  dashboardUrl: string,        // Direct link to Stripe dashboard
  read: false,                 // Unread status
  timestamp: Date,
  priority: 'high' | 'medium'  // Based on restriction status
}
```

##### Email Notifications (TODO)
To enable email notifications, uncomment and configure the email section in the `sendDisputeNotification` function:

1. Add environment variable:
   ```
   ADMIN_EMAIL=admin@yourdomain.com
   ```

2. Install email service (example with Resend):
   ```bash
   npm install resend
   ```

3. Uncomment and implement the email logic in `route.ts`

##### Slack Notifications (TODO)
To enable Slack notifications:

1. Create a Slack Incoming Webhook:
   - Go to https://api.slack.com/messaging/webhooks
   - Create a new webhook for your channel
   - Copy the webhook URL

2. Add environment variable:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

3. Uncomment the Slack notification code in `sendDisputeNotification` function

The implementation includes a ready-to-use Slack message with:
- Rich formatting with markdown
- Key dispute details in structured fields
- Direct link button to Stripe dashboard
- Visual indicators for restricted accounts

#### 6. **Error Handling**

The implementation includes robust error handling at multiple levels:

##### User Lookup Errors
```typescript
try {
  const charge = await stripe.charges.retrieve(dispute.charge as string)
  // ... user lookup logic
} catch (chargeError) {
  console.error('Error fetching charge details:', chargeError)
  // Continue processing even if charge lookup fails
}
```

##### User Update Errors
```typescript
try {
  await userDocRef.update({ ... })
} catch (userUpdateError) {
  console.error('Error updating user account:', userUpdateError)
  // Continue to notification even if user update fails
}
```

##### Notification Errors
```typescript
try {
  await sendDisputeNotification({ ... })
} catch (notificationError) {
  console.error('Error sending dispute notification:', notificationError)
  // Don't fail the webhook if notification fails
}
```

##### Webhook-Level Error Handling
Even if dispute processing fails, the webhook returns `200 OK` to prevent Stripe from retrying unrecoverable errors:

```typescript
return NextResponse.json({ 
  error: 'Failed to process dispute',
  details: error.message,
  disputeId: dispute.id
}, { status: 200 })
```

## Testing

### Test with Stripe CLI

1. Install Stripe CLI:
   ```bash
   stripe login
   ```

2. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

3. Trigger a test dispute:
   ```bash
   stripe trigger charge.dispute.created
   ```

### Manual Testing in Stripe Dashboard (Test Mode)

1. Create a test payment with metadata:
   ```json
   {
     "user_id": "test_user_123"
   }
   ```

2. In Stripe Dashboard, go to the payment and create a test dispute

3. Monitor your webhook endpoint logs

## Firestore Security Rules

Add these rules to your `firestore.rules`:

```javascript
// Disputes collection - admin only
match /disputes/{disputeId} {
  allow read, write: if isAdmin();
}

// Admin notifications - admin only
match /admin_notifications/{notificationId} {
  allow read, write: if isAdmin();
}

// User activity logs - user can read own, admin can read all
match /users/{userId}/activity/{activityId} {
  allow read: if request.auth.uid == userId || isAdmin();
  allow write: if isAdmin();
}
```

## Monitoring and Maintenance

### Key Metrics to Monitor

1. **Dispute Rate**: Track `disputeCount` across all users
2. **Restriction Rate**: Monitor how many accounts are being restricted
3. **User Lookup Failures**: Check logs for disputes where user wasn't found
4. **Notification Delivery**: Ensure admin notifications are being received

### Recommended Dashboard Queries

```typescript
// Get all unread high-priority dispute notifications
db.collection('admin_notifications')
  .where('type', '==', 'dispute_alert')
  .where('priority', '==', 'high')
  .where('read', '==', false)
  .orderBy('timestamp', 'desc')

// Get users with multiple disputes
db.collection('users')
  .where('disputeCount', '>=', 2)
  .orderBy('dispute_review_timestamp', 'desc')

// Get all active disputes
db.collection('disputes')
  .where('status', '==', 'needs_response')
  .orderBy('createdAt', 'desc')
```

## Customization

### Adjusting Restriction Thresholds

Edit the restriction logic in `route.ts`:

```typescript
// Current thresholds
const disputeAmountUSD = dispute.amount / 100
const isFraudRelated = ['fraudulent', 'product_unacceptable'].includes(dispute.reason)
const shouldRestrict = disputeAmountUSD > 100 || isFraudRelated || userDisputeCount >= 2

// Example: More lenient thresholds
const shouldRestrict = disputeAmountUSD > 500 || userDisputeCount >= 3

// Example: More strict thresholds
const shouldRestrict = disputeAmountUSD > 50 || isFraudRelated || userDisputeCount >= 1
```

### Adding Custom Dispute Reasons

```typescript
const isFraudRelated = [
  'fraudulent', 
  'product_unacceptable',
  'product_not_received',  // Add custom reason
  'duplicate'              // Add another custom reason
].includes(dispute.reason)
```

### Temporary vs Permanent Restrictions

Currently, `accountRestricted` is a boolean. You might want to add:

```typescript
await userDocRef.update({
  accountRestricted: shouldRestrict,
  restrictionType: shouldRestrict ? 'temporary' : null,  // or 'permanent'
  restrictionExpiresAt: shouldRestrict ? getExpiryDate() : null,
  // ...
})
```

## Environment Variables Required

```bash
# Existing (required)
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Optional (for enhanced notifications)
ADMIN_EMAIL=admin@yourdomain.com          # For email notifications
SLACK_WEBHOOK_URL=https://hooks.slack...  # For Slack notifications
```

## Related Files

- `app/api/webhook/stripe/route.ts` - Main webhook handler
- `lib/firebase-admin.ts` - Firebase Admin SDK initialization
- `FIRESTORE_SECURE_RULES.md` - Firestore security rules
- `WEBHOOK_TESTING.md` - Webhook testing documentation

## Support

For questions or issues:
1. Check Stripe webhook logs in your dashboard
2. Review server logs for detailed error messages
3. Verify Firestore documents are being created correctly
4. Test with Stripe CLI for consistent results

