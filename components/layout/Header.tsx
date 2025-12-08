'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { SettingsModal } from '@/components/ui/SettingsModal'

export const Header: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isAuthPage = pathname.startsWith('/auth/')
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/critique')
  const isOnboardingPage = pathname.startsWith('/onboarding')
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Show header on homepage, auth pages, dashboard-related pages, and onboarding
  if (!isHomePage && !isAuthPage && !isDashboardPage && !isOnboardingPage) {
    return null
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setShowDropdown(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <header className="absolute top-0 z-50 flex w-full pt-2 sm:pt-3 md:pt-2.5">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-b-lg px-3 sm:px-4 md:pr-5 lg:pr-8 text-white">
          <div className="flex items-center justify-center gap-1 rounded-2xl px-1 sm:px-2 md:px-3 py-1 lg:gap-7">
            {/* PasMoche logo is hidden on homepage, auth pages, and dashboard pages */}
          </div>
          <div className="fixed top-3 sm:top-2.5 right-3 sm:right-2.5 flex h-fit items-center justify-center gap-2 transition-opacity duration-300 opacity-100">
              
            {isHomePage ? (
              // Homepage navigation - show sign in button
              user ? (
                // If user is logged in, redirect to dashboard
                <Link href="/dashboard">
                  <button className="blue-gradient-button rounded-[10px] flex items-center gap-[6px] w-fit text-white font-medium text-[16px] tracking-[-0.13px] p-[10px_20px] relative overflow-hidden">
                    <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden="true">
                      <span className="blurred-border absolute -top-px -left-px z-20 h-full w-full"></span>
                    </span>
                    <span className="relative z-10">Dashboard</span>
                  </button>
                </Link>
              ) : (
                // Auth Buttons for non-logged in users - Mobile optimized
                <div className="flex items-center space-x-2">
                  <Link href="/auth/signin">
                    <button className="flex items-center justify-center px-3 sm:px-3.5 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-white hover:text-white/80 transition-colors duration-200 min-h-[44px]">
                      <span className="hidden sm:inline">Connexion</span>
                      <span className="sm:hidden">Connex.</span>
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="blue-gradient-button rounded-[10px] flex items-center gap-[6px] w-fit text-white font-medium text-sm sm:text-base tracking-[-0.13px] px-4 sm:px-5 py-2.5 sm:py-2.5 min-h-[44px] relative overflow-hidden">
                      <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden="true">
                        <span className="blurred-border absolute -top-px -left-px z-20 h-full w-full"></span>
                      </span>
                      <span className="relative z-10">Inscription</span>
                    </button>
                  </Link>
                </div>
              )
            ) : isAuthPage ? (
                // Auth page navigation - show back to home link
                <Link href="/">
                  <button className="flex items-center justify-center px-3.5 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors duration-200">
                    ← <span className="hidden sm:inline">Retour</span>
                  </button>
                </Link>
              ) : isDashboardPage ? (
                // Dashboard pages - show profile button with full dropdown on both desktop and mobile
                <>
                  {user && (
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-8 h-8 bg-gradient-to-r from-[#497EE9] to-[#749CFF] rounded-full flex items-center justify-center hover:from-[#3d6dd8] hover:to-[#5a8aff] transition-all duration-300 text-white font-medium shadow-lg hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-64 sm:w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200/50 backdrop-blur-sm">
                          {/* User Info Section */}
                          <div className="px-4 py-3 border-b border-gray-200/50 bg-gray-50/50">
                            <div className="text-base sm:text-sm font-medium text-gray-900">
                              {user.displayName || 'User'}
                            </div>
                            <div className="text-sm sm:text-xs text-gray-500 mt-1 break-all">
                              {user.email}
                            </div>
                          </div>
                          
                          {/* Menu Items - Mobile optimized */}
                          <div className="py-1">
                            <Link 
                              href="/dashboard" 
                              className="block w-full text-left px-4 py-3 sm:py-2.5 text-base sm:text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200 min-h-[48px] sm:min-h-[44px] flex items-center touch-manipulation"
                              onClick={() => setShowDropdown(false)}
                            >
                              🏠 {t('profile.dashboard')}
                            </Link>
                            <Link 
                              href="/profile" 
                              className="block w-full text-left px-4 py-3 sm:py-2.5 text-base sm:text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200 min-h-[48px] sm:min-h-[44px] flex items-center touch-manipulation"
                              onClick={() => setShowDropdown(false)}
                            >
                              👤 {t('profile.profile')}
                            </Link>
                            <button
                              onClick={() => {
                                setShowSettings(true)
                                setShowDropdown(false)
                              }}
                              className="block w-full text-left px-4 py-3 sm:py-2.5 text-base sm:text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200 min-h-[48px] sm:min-h-[44px] flex items-center touch-manipulation"
                            >
                              ⚙️ {t('profile.settings')}
                            </button>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-3 sm:py-2.5 text-base sm:text-sm text-red-600 hover:bg-red-50 active:bg-red-50 transition-colors duration-200 min-h-[48px] sm:min-h-[44px] flex items-center touch-manipulation"
                            >
                              🚪 {t('profile.logout')}
                            </button>
                          </div>
                          
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : isOnboardingPage ? (
                // Onboarding pages - show profile button with logout-only dropdown
                <>
                  {user && (
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-[#497EE9] to-[#749CFF] rounded-full flex items-center justify-center hover:from-[#3d6dd8] hover:to-[#5a8aff] transition-all duration-300 text-white font-medium shadow-lg active:scale-95 touch-manipulation"
                        aria-label="Menu utilisateur"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-64 sm:w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200/50 backdrop-blur-sm">
                          {/* User Info Section */}
                          <div className="px-4 py-3 border-b border-gray-200/50 bg-gray-50/50">
                            <div className="text-base sm:text-sm font-medium text-gray-900">
                              {user.displayName || 'User'}
                            </div>
                            <div className="text-sm sm:text-xs text-gray-500 mt-1 break-all">
                              {user.email}
                            </div>
                          </div>
                          
                          {/* Logout Only - Mobile optimized */}
                          <div className="py-1">
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-3 sm:py-2.5 text-base sm:text-sm text-red-600 hover:bg-red-50 active:bg-red-50 transition-colors duration-200 min-h-[48px] sm:min-h-[44px] flex items-center touch-manipulation"
                            >
                              🚪 Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
      </header>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  )
}
