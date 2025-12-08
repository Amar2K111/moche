'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUploads } from '@/hooks/useUploads'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const { user, logout, loading, updateProfile } = useAuth()
  const { t } = useLanguage()
  const { premiumData, refetchUploadsData, canGeneratePDF, loading: uploadsLoading } = useUploads()
  const { addToast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  })

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || ''
      })
    }
  }, [user])

  // Early return if user is not available
  if (!user) {
    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Trim display name for validation
      const trimmedName = formData.displayName.trim()
      
      // Validate display name - empty check
      if (!formData.displayName || trimmedName === '') {
        addToast(t('profile.error_empty_name') || 'Display name cannot be empty', 'error')
        setIsLoading(false)
        return
      }

      // Validate display name - maximum length check
      if (trimmedName.length > 50) {
        addToast(t('profile.error_name_too_long') || 'Display name cannot exceed 50 characters', 'error')
        setIsLoading(false)
        return
      }

      // Validate display name - special characters check
      // Allow letters (including accented), numbers, spaces, hyphens, and apostrophes
      if (!/^[a-zA-Z0-9\u00C0-\u017F\s'-]+$/.test(trimmedName)) {
        addToast(t('profile.error_invalid_chars') || 'Display name contains invalid characters', 'error')
        setIsLoading(false)
        return
      }

      // Check if there are any changes
      if (trimmedName === user?.displayName) {
        addToast(t('profile.no_changes') || 'No changes to save', 'info')
        setIsEditing(false)
        setIsLoading(false)
        return
      }

      // Update profile using AuthContext
      await updateProfile({
        displayName: trimmedName
      })

      // Show success message
      addToast(t('profile.update_success') || 'Profile updated successfully!', 'success')
      setIsEditing(false)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      const errorMessage = error?.message || t('profile.update_error') || 'Failed to update profile. Please try again.'
      addToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
      
      <main className="flex-1 py-6 sm:py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header with Back Button - Mobile optimized */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2 min-h-[44px] touch-manipulation"
              >
                ← <span className="hidden sm:inline">{t('profile.back_dashboard')}</span>
              </Button>
              <div className="flex-1"></div>
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                {t('profile.title')}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
                {t('profile.subtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-4 md:p-6 text-center">
                {/* Profile Avatar */}
                <div className="mb-6">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-neon-blue rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {user.email}
                  </p>
                  {user.provider && (
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                    </span>
                  )}
                </div>
              </Card>
            </div>

            {/* Settings Section */}
            <div className="lg:col-span-2">
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('profile.account_info')}
                  </h3>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="secondary"
                      size="sm"
                    >
                      {t('profile.edit_profile')}
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label={t('profile.display_name')}
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder={t('profile.displayNamePlaceholder')}
                    />
                    <Input
                      label={t('profile.email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('profile.emailPlaceholder')}
                      type="email"
                      disabled
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? t('profile.saving') : t('profile.save_changes')}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="secondary"
                        className="flex-1"
                      >
                        {t('profile.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.display_name')}
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.displayName || t('profile.not_set')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.email')}
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.account_type')}
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.provider === 'google' ? t('profile.google_account') : t('profile.email_password')}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Uploads Section */}
              <Card className="p-4 md:p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('profile.upload_credits')}
                  </h3>
                  <Button
                    onClick={refetchUploadsData}
                    variant="secondary"
                    size="sm"
                    className="text-sm"
                  >
                    {t('profile.refresh')}
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">PDF Génération</h4>
                      <p className="text-sm text-gray-600">Accès illimité aux PDF personnalisés</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${canGeneratePDF() ? 'text-green-600' : 'text-red-600'}`}>
                        {uploadsLoading ? '...' : (canGeneratePDF() ? 'Activé' : 'Non activé')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{t('profile.total_uploads')}</h4>
                      <p className="text-sm text-gray-600">{t('profile.total_uploads_subtitle')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {loading ? '...' : user?.totalUploads || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
