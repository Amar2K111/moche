/**
 * Utility functions for handling popup authentication with proper COOP error handling
 */

export interface PopupAuthResult {
  success: boolean
  error?: string
  user?: any
}

/**
 * Enhanced popup authentication that handles COOP policy issues
 */
export const handlePopupAuth = async (
  authFunction: () => Promise<any>
): Promise<PopupAuthResult> => {
  try {
    const result = await authFunction()
    return {
      success: true,
      user: result.user
    }
  } catch (error: any) {
    // Handle specific popup-related errors
    if (error.code === 'auth/popup-closed-by-user') {
      return {
        success: false,
        error: 'Sign-in was cancelled by user'
      }
    } else if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: 'Pop-up was blocked. Please allow pop-ups for this site.'
      }
    } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
      return {
        success: false,
        error: 'Authentication popup blocked by browser security policy. Please try again or use email/password sign-in.'
      }
    } else if (error.message?.includes('window.closed') || error.message?.includes('window.close')) {
      // Handle COOP-related window.close errors
      console.warn('COOP policy blocked window.close, but authentication may still succeed')
      return {
        success: false,
        error: 'Browser security policy blocked popup. Please try again or use email/password sign-in.'
      }
    } else {
      return {
        success: false,
        error: error.message || 'Authentication failed. Please try again.'
      }
    }
  }
}

/**
 * Check if the current environment supports popup authentication
 */
export const isPopupAuthSupported = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for COOP policy restrictions
  const hasCOOPRestrictions = 
    window.location.protocol === 'https:' && 
    (window as any).crossOriginIsolated === false
  
  return !hasCOOPRestrictions
}

/**
 * Get user-friendly error message for popup authentication issues
 */
export const getPopupAuthErrorMessage = (error: any): string => {
  if (error.code === 'auth/popup-closed-by-user') {
    return 'Sign-in was cancelled. Please try again.'
  } else if (error.code === 'auth/popup-blocked') {
    return 'Pop-up was blocked. Please allow pop-ups for this site and try again.'
  } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
    return 'Browser security settings are blocking the sign-in popup. Please try using email/password sign-in instead.'
  } else if (error.message?.includes('window.closed') || error.message?.includes('window.close')) {
    return 'Browser security policy blocked the sign-in popup. Please try again or use email/password sign-in.'
  } else {
    return 'Sign-in failed. Please try again.'
  }
}
