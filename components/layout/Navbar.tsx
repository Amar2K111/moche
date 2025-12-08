'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <nav className="md:hidden bg-white border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl">👐</div>
                         <span className="text-xl font-bold text-text-dark">
               {t('app.name')}
             </span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text-gray hover:text-text-dark focus:outline-none focus:text-text-dark"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card-bg rounded-lg mt-2 border border-border-color shadow-lg">
                              <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-text-gray hover:text-neon-blue transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  href="/offer"
                  className="block px-3 py-2 text-text-gray hover:text-neon-blue transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.getCredits')}
                </Link>
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 text-text-gray hover:text-text-dark transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.signIn')}
                </Link>
              <Link
                href="/auth/signup"
                className="block px-3 py-2 bg-neon-blue hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.signUp')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
