/**
 * Error sanitization and monitoring utilities
 * Maps technical error messages to user-friendly i18n keys
 * Provides comprehensive error tracking for critical failures
 */

import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Module-level regex constants to avoid recompilation
const PERMISSION_ERROR_PATTERN = /\b(permission denied|no permission|not permitted|missing or insufficient permissions)\b/

/**
 * Metadata for critical error reporting
 */
interface ErrorMetadata {
  userId?: string
  originalError?: unknown
  operation: string
  timestamp: Date
  context?: Record<string, any>
}

/**
 * Critical error event for monitoring systems
 */
interface CriticalErrorEvent {
  type: 'critical_error'
  category: string
  error: string
  errorStack?: string
  metadata: ErrorMetadata
  severity: 'high' | 'critical'
}

/**
 * Report critical errors to monitoring/alerting systems
 * Captures comprehensive context for debugging and alerting
 * 
 * @param error - The error that occurred
 * @param metadata - Rich metadata about the error context
 * @returns Promise that resolves when reporting is complete
 */
export async function reportCriticalError(
  error: unknown,
  metadata: ErrorMetadata
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  // Create structured error event
  const errorEvent: CriticalErrorEvent = {
    type: 'critical_error',
    category: metadata.operation,
    error: errorMessage,
    errorStack,
    metadata: {
      ...metadata,
      timestamp: metadata.timestamp || new Date()
    },
    severity: 'critical'
  }

  // Execute all reporting operations in parallel for better performance
  const reportingPromises: Promise<void>[] = []

  // 1. Send to error tracking API (e.g., Sentry, Datadog)
  reportingPromises.push(
    sendToErrorTrackingAPI(error, errorEvent).catch(err => {
      console.error('Failed to send error to tracking API:', err)
    })
  )

  // 2. Emit tagged metric/event for alerting
  reportingPromises.push(
    emitMetricEvent(errorEvent).catch(err => {
      console.error('Failed to emit metric event:', err)
    })
  )

  // 3. Persist audit log to durable store
  reportingPromises.push(
    persistAuditLog(errorEvent).catch(err => {
      console.error('Failed to persist audit log:', err)
    })
  )

  // Wait for all reporting operations to complete (with error tolerance)
  await Promise.allSettled(reportingPromises)

  // Log to console as fallback
  console.error('[CRITICAL ERROR]', {
    operation: metadata.operation,
    error: errorMessage,
    metadata
  })
}

/**
 * Send error to external error tracking service (Sentry/Datadog/etc.)
 * This is a stub that can be configured with your actual error tracking service
 */
async function sendToErrorTrackingAPI(
  error: unknown,
  event: CriticalErrorEvent
): Promise<void> {
  // TODO: Configure your error tracking service here
  // Example for Sentry:
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(error, {
  //     tags: {
  //       operation: event.category,
  //       severity: event.severity
  //     },
  //     extra: event.metadata
  //   })
  // }
  
  // Example for Datadog:
  // if (typeof window !== 'undefined' && window.DD_RUM) {
  //   window.DD_RUM.addError(error, {
  //     operation: event.category,
  //     ...event.metadata
  //   })
  // }

  // For now, prepare data for future integration
}

/**
 * Emit tagged metric/event for monitoring dashboards and alerting
 */
async function emitMetricEvent(event: CriticalErrorEvent): Promise<void> {
  // TODO: Configure your metrics/events service here
  // Example for Datadog:
  // if (typeof window !== 'undefined' && window.DD_RUM) {
  //   window.DD_RUM.addAction('critical_error', {
  //     category: event.category,
  //     severity: event.severity,
  //     ...event.metadata
  //   })
  // }

  // Example for custom metrics endpoint:
  // await fetch('/api/metrics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     metric: 'critical_error',
  //     tags: [`operation:${event.category}`, `severity:${event.severity}`],
  //     value: 1,
  //     timestamp: event.metadata.timestamp.toISOString()
  //   })
  // })
}

/**
 * Persist audit/log entry to Firestore for manual reconciliation
 */
async function persistAuditLog(event: CriticalErrorEvent): Promise<void> {
  try {
    // Only persist in non-development environments or if explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_AUDIT_LOGS) {
      return
    }

    await addDoc(collection(db, 'audit_logs'), {
      type: event.type,
      category: event.category,
      error: event.error,
      errorStack: event.errorStack,
      userId: event.metadata.userId,
      operation: event.metadata.operation,
      originalError: event.metadata.originalError instanceof Error 
        ? { message: event.metadata.originalError.message, stack: event.metadata.originalError.stack }
        : String(event.metadata.originalError),
      context: event.metadata.context,
      severity: event.severity,
      timestamp: serverTimestamp(),
      createdAt: event.metadata.timestamp,
      // Add fields for easy querying and alerting
      needsReconciliation: true,
      resolved: false
    })
  } catch (error) {
    // If Firestore fails, we still want to continue with other reporting
    console.error('Failed to persist audit log to Firestore:', error)
    throw error
  }
}

/**
 * Sanitize error messages for user display
 * Maps known error types to localized message keys
 * @param error - The error to sanitize (Error object, string, or unknown)
 * @returns A safe i18n key for translation
 */
export function sanitizeError(error: unknown): string {
  // Log the actual error for debugging in development only
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Details]:', error)
  }
  // …rest of implementation unchanged…  
  let errorMessage = ''
  
  // Extract error message safely
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    try {
      errorMessage = JSON.stringify(error) || String(error)
    } catch {
      errorMessage = String(error)
    }
  }  
  const lowerErrorMsg = errorMessage.toLowerCase()
  
  // Map known error patterns to i18n keys
  if (lowerErrorMsg.includes('failed to load critiques')) {
    return 'errors.failed_to_load'
  }
  
  if (lowerErrorMsg.includes('failed to refresh critiques')) {
    return 'errors.failed_to_refresh'
  }
  
  // Firebase/Firestore errors
  if (PERMISSION_ERROR_PATTERN.test(lowerErrorMsg)) {
    return 'errors.permission_denied'
  }
  
  if (lowerErrorMsg.includes('network') || lowerErrorMsg.includes('offline')) {
    return 'errors.network_error'
  }
  
  if (lowerErrorMsg.includes('timeout')) {
    return 'errors.timeout'
  }
  
  if (lowerErrorMsg.includes('not found') || lowerErrorMsg.includes('404')) {
    return 'errors.not_found'
  }
  
  if (lowerErrorMsg.includes('unauthenticated') || lowerErrorMsg.includes('unauthorized')) {
    return 'errors.auth_required'
  }
  
  if (lowerErrorMsg.includes('quota') || lowerErrorMsg.includes('limit')) {
    return 'errors.quota_exceeded'
  }
  
  // Generic fallback for any unknown errors
  return 'errors.generic'
}

