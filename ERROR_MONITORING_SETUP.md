# Error Monitoring and Observability Setup

## Overview

This document explains the enhanced error monitoring system implemented for critical rollback failures, specifically for the profile update rollback scenario in `AuthContext.tsx`.

## What's Been Implemented

### 1. **Critical Error Reporting System** (`lib/errorUtils.ts`)

A comprehensive error tracking infrastructure that:

- **Reports to Error Tracking APIs**: Sends errors to services like Sentry or Datadog with rich context
- **Emits Tagged Metrics**: Creates events that can trigger alerts in your monitoring dashboards
- **Persists Audit Logs**: Stores critical errors in Firestore's `audit_logs` collection for manual reconciliation
- **Captures Rich Metadata**: Includes user ID, original error, operation type, timestamps, and custom context

### 2. **Enhanced Rollback Error Handling** (`contexts/AuthContext.tsx`)

When a profile update rollback fails (lines 332-370), the system now:

1. **Captures Complete Context**:
   - User ID and email
   - Original Firestore error that triggered the rollback
   - Rollback error details
   - Attempted updates and rollback values
   - Current Auth profile state
   - Full error messages and stack traces

2. **Reports to Monitoring Systems**: Calls `reportCriticalError()` with all metadata

3. **Maintains Error Flow**: Still re-throws the original error to preserve normal error handling

## Integration with Monitoring Services

### Sentry Integration

1. **Install Sentry**:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

2. **Configure in `lib/errorUtils.ts`**:
   ```typescript
   // In sendToErrorTrackingAPI function, uncomment and configure:
   import * as Sentry from '@sentry/nextjs'
   
   if (typeof Sentry !== 'undefined') {
     Sentry.captureException(error, {
       tags: {
         operation: event.category,
         severity: event.severity
       },
       extra: event.metadata,
       level: 'error'
     })
   }
   ```

3. **Add environment variables**:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   ```

### Datadog RUM Integration

1. **Install Datadog**:
   ```bash
   npm install @datadog/browser-rum
   ```

2. **Initialize in your app** (`app/layout.tsx`):
   ```typescript
   import { datadogRum } from '@datadog/browser-rum'
   
   datadogRum.init({
     applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID!,
     clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN!,
     site: 'datadoghq.com',
     service: 'your-app-name',
     env: process.env.NODE_ENV,
     version: '1.0.0',
     sessionSampleRate: 100,
     sessionReplaySampleRate: 20,
     trackUserInteractions: true,
     trackResources: true,
     trackLongTasks: true,
     defaultPrivacyLevel: 'mask-user-input'
   })
   ```

3. **Configure in `lib/errorUtils.ts`**:
   ```typescript
   // In sendToErrorTrackingAPI function:
   import { datadogRum } from '@datadog/browser-rum'
   
   if (typeof window !== 'undefined' && datadogRum) {
     datadogRum.addError(error, {
       operation: event.category,
       severity: event.severity,
       ...event.metadata
     })
   }
   
   // In emitMetricEvent function:
   if (typeof window !== 'undefined' && datadogRum) {
     datadogRum.addAction('critical_error', {
       category: event.category,
       severity: event.severity,
       userId: event.metadata.userId
     })
   }
   ```

### Custom Metrics Endpoint

You can create a custom API endpoint to send metrics:

1. **Create `app/api/metrics/route.ts`**:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   
   export async function POST(req: NextRequest) {
     try {
       const body = await req.json()
       
       // Send to your metrics service (e.g., CloudWatch, Prometheus, etc.)
       console.log('[Metrics]', body)
       
       // Example: Send to AWS CloudWatch
       // await cloudwatch.putMetricData({...})
       
       return NextResponse.json({ success: true })
     } catch (error) {
       console.error('Failed to record metric:', error)
       return NextResponse.json({ success: false }, { status: 500 })
     }
   }
   ```

2. **Update `lib/errorUtils.ts` emitMetricEvent**:
   ```typescript
   await fetch('/api/metrics', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       metric: 'critical_error',
       tags: [`operation:${event.category}`, `severity:${event.severity}`],
       value: 1,
       timestamp: event.metadata.timestamp.toISOString()
     })
   })
   ```

## Firestore Audit Logs

### Collection Structure: `audit_logs`

Each document contains:
```typescript
{
  type: 'critical_error',
  category: string,              // e.g., 'profile_update_rollback_failed'
  error: string,                 // Error message
  errorStack?: string,           // Stack trace
  userId: string,                // User who experienced the error
  operation: string,             // Operation that failed
  originalError: object | string, // The original error that triggered rollback
  context: {                     // Rich context for debugging
    attemptedUpdates: object,
    rollbackUpdates: object,
    previousDisplayName: string,
    previousPhotoURL: string,
    userEmail: string,
    authProfileState: object,
    firestoreErrorMessage: string,
    rollbackErrorMessage: string
  },
  severity: 'critical',
  timestamp: FirestoreTimestamp, // Server timestamp
  createdAt: Date,              // Client timestamp
  needsReconciliation: true,
  resolved: false
}
```

### Querying Audit Logs

```typescript
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Get unresolved rollback failures
const q = query(
  collection(db, 'audit_logs'),
  where('needsReconciliation', '==', true),
  where('resolved', '==', false),
  where('operation', '==', 'profile_update_rollback_failed'),
  orderBy('timestamp', 'desc'),
  limit(50)
)

const snapshot = await getDocs(q)
snapshot.forEach(doc => {
  console.log('Rollback failure:', doc.data())
})
```

### Security Rules

Add to your Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow system/admin to write audit logs
    match /audit_logs/{logId} {
      allow read: if request.auth != null && 
                    (request.auth.token.admin == true || 
                     request.auth.uid == resource.data.userId);
      allow write: if false; // Only backend should write
    }
  }
}
```

## Enabling in Development

By default, audit logs are not persisted in development. To enable:

```env
NEXT_PUBLIC_ENABLE_AUDIT_LOGS=true
```

## Alerting Configuration

### Setting Up Alerts

1. **Sentry Alerts**:
   - Go to Sentry → Alerts → Create Alert
   - Condition: Error tagged with `operation:profile_update_rollback_failed`
   - Action: Send to Slack/PagerDuty/Email

2. **Datadog Monitors**:
   - Go to Monitors → New Monitor
   - Metric: `critical_error_count`
   - Filter: `operation:profile_update_rollback_failed`
   - Alert threshold: > 0 in last 5 minutes

3. **Firestore-based Alerts** (using Cloud Functions):
   ```typescript
   import * as functions from 'firebase-functions'
   
   export const alertOnRollbackFailure = functions.firestore
     .document('audit_logs/{logId}')
     .onCreate(async (snap, context) => {
       const data = snap.data()
       
       if (data.operation === 'profile_update_rollback_failed') {
         // Send alert to Slack/PagerDuty/etc.
         await sendSlackAlert({
           text: `🚨 Critical: Profile update rollback failed for user ${data.userId}`,
           details: data
         })
       }
     })
   ```

## Manual Reconciliation Process

When a rollback failure occurs:

1. **Review the audit log** to understand what went wrong
2. **Check user's current state** in both Auth and Firestore
3. **Manually correct any inconsistencies**:
   ```typescript
   // Example reconciliation script
   async function reconcileUserProfile(userId: string) {
     const user = auth.currentUser
     const userDoc = await getDoc(doc(db, 'users', userId))
     
     if (user && userDoc.exists()) {
       // Compare and fix discrepancies
       const firestoreData = userDoc.data()
       if (user.displayName !== firestoreData.displayName) {
         // Decide which is correct and update the other
       }
     }
   }
   ```
4. **Mark the audit log as resolved**:
   ```typescript
   await updateDoc(doc(db, 'audit_logs', logId), {
     resolved: true,
     resolvedAt: serverTimestamp(),
     resolvedBy: 'admin_user_id',
     resolution: 'Manually synced profile data'
   })
   ```

## Testing the System

### Test Rollback Failure Scenario

```typescript
// In a test or development environment
import { reportCriticalError } from '@/lib/errorUtils'

// Simulate a rollback failure
await reportCriticalError(
  new Error('Test rollback failure'),
  {
    userId: 'test-user-123',
    originalError: new Error('Original Firestore error'),
    operation: 'profile_update_rollback_failed',
    timestamp: new Date(),
    context: {
      attemptedUpdates: { displayName: 'New Name' },
      rollbackUpdates: { displayName: 'Old Name' },
      userEmail: 'test@example.com'
    }
  }
)
```

### Verify:
1. Check console logs in development
2. Check Sentry/Datadog dashboard
3. Query Firestore `audit_logs` collection

## Benefits

✅ **Complete Visibility**: Never lose track of critical rollback failures  
✅ **Fast Response**: Real-time alerts when data inconsistencies occur  
✅ **Historical Record**: Durable audit logs for post-mortem analysis  
✅ **Manual Recovery**: All context needed to manually fix data issues  
✅ **Proper Error Flow**: Original errors still propagate correctly  

## Next Steps

1. Choose and integrate your monitoring service (Sentry recommended)
2. Set up Firestore security rules for `audit_logs` collection
3. Create alerts for `profile_update_rollback_failed` events
4. Set up a manual reconciliation process/dashboard
5. Test the system in a staging environment

