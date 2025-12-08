'use client'

import React, { useState, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CritiqueResults } from '@/components/ui/CritiqueResults'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useFaceCritique, FaceCritique } from '@/hooks/useFaceCritique'
import { useToast } from '@/components/ui/Toast'
import { calculatePercentile } from '@/lib/percentile'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [critique, setCritique] = useState<FaceCritique | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const { uploadAndAnalyze } = useFaceCritique()
  const { addToast } = useToast()

  // Force white background on body and html
  React.useEffect(() => {
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  // Note: Real-time Firebase listener in useUploads hook handles automatic updates
  // No need for periodic refresh anymore

  const handleUploadClick = () => {
    // Use the same file input for both mobile and desktop
    // On mobile, this will show native options (camera, gallery, files)
    // On desktop, this will show file picker
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    // Open camera directly on mobile devices
    // The capture="environment" attribute forces camera to open instead of gallery
    if (cameraInputRef.current) {
      cameraInputRef.current.setAttribute('capture', 'environment')
      cameraInputRef.current.click()
    }
  }


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.')
      return
    }

    setSelectedFile(file)
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    // Automatically show split layout after file selection
    setIsUploaded(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleGenerateResults = async () => {
    if (!selectedFile) {
      alert('Please select a file first.')
      return
    }

    // Photo rating is now FREE - no credit check needed
    setIsGenerating(true)
    try {
      const result = await uploadAndAnalyze(selectedFile)
      setCritique(result)
      // Save to localStorage so it persists on refresh
      // Ensure date is properly serialized
      const serializedResult = {
        ...result,
        createdAt: result.createdAt.toISOString() // Convert Date to string for JSON serialization
      }
      
      // Note: Critiques are now stored in Firebase, no need for localStorage
      // localStorage has size limits and base64 images are too large
      
      // Photo rating is free, no need to refetch uploads data
    } catch (error) {
      console.error('Error generating results:', error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          alert('Please sign in to continue.')
        } else {
          alert('Failed to generate critique. Please try again.')
        }
      } else {
        alert('Failed to generate critique. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setIsUploaded(false)
    setCritique(null)
    // Note: No need to clear localStorage as we're not using it anymore
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        <Header />
        
        <main className={`flex-1 relative z-10 pt-16 sm:pt-20 ${isUploaded && !critique ? 'py-4 sm:py-6' : 'py-6 sm:py-8'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Page Header - Enhanced - Mobile optimized */}
            {!isUploaded && (
              <div className={`text-center ${isUploaded ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8 md:mb-12'}`}>
                <h1 className={`${isUploaded ? 'text-xl sm:text-2xl md:text-3xl' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'} font-medium text-black tracking-tight ${isUploaded ? 'mb-2' : 'mb-3 sm:mb-4'} px-2`}>
                  Analyse complète de ta peau
                </h1>
                {!isUploaded && (
                  <>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed font-medium">
                      Découvre ton score peau sur 100 et reçois une routine skincare 100% personnalisée avec les meilleurs produits adaptés à tes besoins.
                    </p>
                    <div className="mt-3 sm:mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-black px-2 sm:px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
                        <span>IA Puissante</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-40 rounded-full"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
                        <span>Résultats Instantanés</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-40 rounded-full"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
                        <span>100% Honnête</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Upload Section */}
            {isUploaded ? (
              critique ? (
                /* Show Results - In Container - Mobile-like width */
                <div className="mb-8 card-gradient rounded-3xl p-6 lg:p-8 shadow-lg max-w-md mx-auto">
                  <CritiqueResults 
                    critique={critique} 
                    onRetry={handleRemoveFile}
                    imageUrl={previewUrl}
                  />
                </div>
              ) : (
                /* Centered Layout - After Upload - Compact Desktop Layout (Mobile-like) */
                <div className="mb-8 card-gradient rounded-3xl p-6 lg:p-8 shadow-lg max-w-md mx-auto relative">
                  {/* X button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    className="absolute top-3 left-3 text-black hover:text-gray-700 transition-all duration-300 text-xl hover:scale-110 z-20 cursor-pointer bg-transparent border-none p-0"
                    style={{ pointerEvents: 'auto', background: 'transparent', boxShadow: 'none' }}
                  >
                    ×
                  </button>
                  <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-5">
                    {/* Centered Image - Smaller on desktop */}
                    <div className="relative w-full max-w-sm lg:max-w-xs group">
                      <img 
                        src={previewUrl || ''} 
                        alt="Uploaded" 
                        className="relative w-full h-auto object-contain rounded-2xl border border-gray-200 bg-white shadow-lg"
                      />
                    </div>
                    
                    {/* Generate Button Below Image - Compact */}
                    <div className="flex flex-col items-center space-y-3 lg:space-y-3">
                      <p className="text-black text-base lg:text-lg font-medium">
                        Prêt à découvrir l'analyse complète de ta peau ?
                      </p>
                      <Button
                        onClick={handleGenerateResults}
                        disabled={isGenerating}
                        size="lg"
                        className="blue-gradient-button rounded-[10px] flex items-center justify-center gap-[6px] w-full sm:w-fit text-white font-semibold text-base sm:text-lg tracking-[-0.13px] px-8 sm:px-12 py-4 min-h-[52px] relative overflow-hidden shadow-[0_4px_20px_rgba(73,126,233,0.5)] touch-manipulation"
                      >
                        {isGenerating ? (
                          <span className="relative z-10 flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Analyse en cours...</span>
                          </span>
                        ) : (
                          <span className="relative z-10">Générer les résultats</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* Modern Upload Layout */
              <div className="mb-8 p-8 lg:p-12">
                <div className="text-center space-y-8">
                  {/* Hero Section */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight">
                        Prêt à découvrir la vérité ?
                      </h2>
                      <p className="text-black text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        Poste ta photo et découvre l'analyse complète de ta peau.
                      </p>
                    </div>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="camera-input"
                  />

                  {/* Photo Upload Area - Modern Design */}
                  <div className="w-full max-w-2xl mx-auto relative">
                    {/* X button only shows when no critique has been generated yet */}
                    {!critique && previewUrl && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemoveFile()
                        }}
                        className="absolute top-3 left-3 text-black hover:text-gray-700 transition-all duration-300 text-xl hover:scale-110 z-20 cursor-pointer bg-transparent border-none p-0"
                        style={{ pointerEvents: 'auto', background: 'transparent', boxShadow: 'none' }}
                      >
                        ×
                      </button>
                    )}
                    {previewUrl ? (
                      <div className="relative group">
                        <img 
                          src={previewUrl || ''} 
                          alt="Preview" 
                          className="relative w-full h-48 sm:h-64 object-cover rounded-2xl border border-gray-200 bg-white shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div 
                          className={`relative w-full h-48 sm:h-64 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 touch-manipulation group ${
                            isDragOver 
                              ? 'border-primary-blue bg-primary-blue/10 scale-105' 
                              : 'border-gray-300 bg-white hover:border-primary-blue hover:bg-primary-blue/5 hover:scale-102'
                          }`}
                          onClick={handleUploadClick}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="absolute inset-0 bg-primary-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative text-center px-4">
                            <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                              {isDragOver ? '🎯' : '📷'}
                            </div>
                            <p className="text-black text-lg font-semibold mb-2">
                              {isDragOver 
                                ? 'Dépose ta photo ici'
                                : 'Clique pour importer'
                              }
                            </p>
                            <p className="text-black text-sm">
                              {isDragOver 
                                ? 'Relâche pour importer' 
                                : 'ou glisse-dépose'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Upload Photo Button - Mobile optimized */}
                        <div className="flex justify-center w-full">
                          <Button
                            onClick={handleUploadClick}
                            size="lg"
                            className="blue-gradient-button rounded-[10px] flex items-center justify-center gap-2 w-full sm:w-fit text-white font-semibold text-base sm:text-lg tracking-[-0.13px] px-6 sm:px-12 py-4 min-h-[52px] relative overflow-hidden shadow-[0_4px_20px_rgba(73,126,233,0.5)] touch-manipulation"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <span className="text-lg sm:text-xl">📁</span>
                              <span>Importer une photo</span>
                            </span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Take Picture Button - Only show on mobile */}
                  <div className="flex justify-center md:hidden mt-4 w-full">
                    <Button
                      onClick={handleCameraClick}
                      variant="secondary"
                      size="lg"
                      className="text-base sm:text-lg py-4 px-6 sm:px-8 flex items-center justify-center gap-3 touch-manipulation border-2 border-primary-blue bg-white text-black hover:bg-blue-50 active:bg-blue-100 transition-all duration-300 rounded-[10px] w-full min-h-[52px] font-semibold shadow-sm"
                    >
                      <span className="text-xl">📸</span>
                      <span>Prendre une photo</span>
                    </Button>
                  </div>

                </div>
              </div>
            )}



          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
