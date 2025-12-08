'use client'

import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { useLanguage } from '@/contexts/LanguageContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="space-y-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {t('settings.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        {/* Additional Settings Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('settings.account_settings')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">{t('settings.notifications')}</span>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">{t('settings.email_updates')}</span>
              <div className="w-12 h-6 bg-neon-blue rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 right-0.5 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            {t('settings.done')}
          </button>
        </div>
        </div>
      </div>
    </Modal>
  )
}

export default SettingsModal
