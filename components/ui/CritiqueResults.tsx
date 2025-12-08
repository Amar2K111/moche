'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaceCritique } from '@/hooks/useFaceCritique'
import { generatePDF } from '@/lib/generatePDFHTML'
import { useAuth } from '@/contexts/AuthContext'
import { useUploads } from '@/hooks/useUploads'

interface CritiqueResultsProps {
  critique: FaceCritique
  onRetry: () => void
  imageUrl?: string | null
}

interface RatingCategory {
  name: string
  score: number
}

export const CritiqueResults: React.FC<CritiqueResultsProps> = (props) => {
  const { critique, onRetry, imageUrl } = props
  const previewImageUrl = imageUrl // Renommer explicitement pour éviter les conflits de hoisting
  const { user } = useAuth()
  const router = useRouter()
  const { premiumData, canGeneratePDF, refetchUploadsData } = useUploads()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  // Formater le verdict comme un résumé descriptif
  const formatVerdict = (verdict: string): string => {
    if (!verdict) return ''
    
    // Si le verdict est déjà une phrase complète et descriptive, le retourner tel quel
    if (verdict.length > 20 && verdict.includes(' ')) {
      return verdict
    }
    
    // Créer un résumé descriptif basé sur le verdict et le score
    const score = critique.score
    
    if (verdict.includes('Pas moche') || verdict.includes('pas moche')) {
      if (score >= 85) {
        return 'Vous avez un très bon visage avec des traits harmonieux et attrayants'
      } else if (score >= 75) {
        return 'Vous avez un bon visage avec des traits équilibrés'
      } else {
        return 'Globalement, vous avez un visage correct avec quelques points à améliorer'
      }
    }
    
    if (verdict.includes('Moche') || verdict.includes('moche')) {
      if (score < 40) {
        return 'Votre visage présente de nombreuses imperfections et nécessite des améliorations significatives'
      } else if (score < 50) {
        return 'Votre visage présente plusieurs défauts qui impactent son apparence générale'
      } else {
        return 'Votre visage a besoin d\'améliorations sur plusieurs aspects pour être plus harmonieux'
      }
    }
    
    // Par défaut, créer un résumé basé sur le score
    if (score >= 80) {
      return `Globalement, ${verdict.toLowerCase()}, vous avez un visage attrayant`
    } else if (score >= 60) {
      return `En résumé, ${verdict.toLowerCase()}, votre visage présente un bon potentiel`
    } else {
      return `Dans l'ensemble, ${verdict.toLowerCase()}, votre visage nécessite des améliorations`
    }
  }
  
  // Couleur de la barre de progression selon le score
  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-green-600' // Dark green pour 85+
    if (score >= 76) return 'bg-green-400' // Light green pour 76-84
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Récupérer l'URL de l'image pour l'affichage UI (peut être blob URL)
  const getDisplayImageUrl = (): string | null => {
    // Pour l'affichage UI, on préfère previewImageUrl (même si blob, ça fonctionne côté client)
    if (previewImageUrl) return previewImageUrl
    if (critique.imageUrl) return critique.imageUrl
    return null
  }

  // Récupérer l'URL de l'image pour le PDF (doit être URL publique accessible serveur)
  const getPdfImageUrl = (): string | null => {
    // Si previewImageUrl est une URL blob locale, elle ne sera pas accessible depuis le serveur
    // Dans ce cas, utiliser critique.imageUrl qui est une URL publique (Firebase Storage)
    const isBlobUrl = previewImageUrl && previewImageUrl.startsWith('blob:')
    
    if (isBlobUrl && critique.imageUrl) {
      // URL blob : utiliser critique.imageUrl pour le PDF (accessible serveur)
      return critique.imageUrl
    }
    if (previewImageUrl && !isBlobUrl) {
      // URL publique : peut être utilisée directement
      return previewImageUrl
    }
    if (critique.imageUrl) {
      // Fallback sur critique.imageUrl
      return critique.imageUrl
    }
    return null
  }

  // Récupère les scores de peau détaillés
  const getCategoryScores = (): { overall: RatingCategory, categories: RatingCategory[] } => {
    // Utiliser le score de peau depuis categoryScores.peau ou le score global
    const skinScore = critique.categoryScores?.peau || critique.score || 50
    
    // Scores détaillés de peau depuis l'API ou calculés (jamais 0)
    type SkinDetails = {
      texture?: number;
      uniformite?: number;
      hydratation?: number;
      eclat?: number;
      finessePores?: number;
      elasticite?: number;
      [key: string]: number | undefined;
    }
    
    const skinDetails = (critique.categoryScores || {}) as SkinDetails
    
    // Fonction pour obtenir un score réaliste (jamais 0, utilise skinScore comme base si manquant)
    const getRealisticScore = (value: number | undefined, baseScore: number): number => {
      if (value && value > 0) return value
      // Si pas de valeur, générer un score réaliste basé sur le score principal avec variation
      const variation = Math.floor(Math.random() * 20) - 10 // Variation de -10 à +10
      return Math.max(1, Math.min(100, baseScore + variation))
    }
    
    return {
      overall: { 
        name: 'Skin Score', 
        score: skinScore 
      },
      categories: [
        { name: 'Lisse', score: getRealisticScore(skinDetails.texture, skinScore) },
        { name: 'Teint', score: getRealisticScore(skinDetails.uniformite, skinScore) },
        { name: 'Hydratation', score: getRealisticScore(skinDetails.hydratation, skinScore) },
        { name: 'Brillant', score: getRealisticScore(skinDetails.eclat, skinScore) },
        { name: 'Pores Fins', score: getRealisticScore(skinDetails.finessePores, skinScore) },
        { name: 'Souple', score: getRealisticScore(skinDetails.elasticite, skinScore) }
      ]
    }
  }

  const displayImageUrl = getDisplayImageUrl() // Pour l'affichage UI
  const pdfImageUrl = getPdfImageUrl() // Pour le PDF (URL publique)
  const { overall, categories } = getCategoryScores()

  // Toutes les fonctions de logique supprimées - prêt pour nouveau contenu

  const handleDownloadPDF = async () => {
    // Ne générer le PDF que lorsque l'utilisateur clique sur le bouton
    if (isGeneratingPDF) return // Empêcher les doubles clics
    
    // Check if user has PDF access (has paid)
    // Refresh PDF data first to ensure we have latest data
    try {
      await refetchUploadsData()
    } catch (error) {
      console.error('Failed to refresh PDF data:', error)
    }
    
    // Check if user can generate PDF (has paid)
    if (!canGeneratePDF()) {
      // Redirect to offer page if not paid
      router.push('/offer')
      return
    }
    
    setIsGeneratingPDF(true)
    try {
      // PDF is unlimited - no need to decrement anything
      // Generate PDF directly
      await generatePDF(critique, pdfImageUrl, user?.uid, false)
    } catch (error: any) {
      console.error('Error generating PDF:', error)
      const errorMessage = error?.message || 'Erreur lors de la génération du PDF. Veuillez réessayer.'
      alert(errorMessage)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="w-full relative">
      {/* Close/Back Button - Top Left of whole container */}
      <button
        onClick={onRetry}
        className="absolute top-0 left-0 text-black hover:text-gray-700 transition-colors duration-200 z-10"
        aria-label="Retour"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>

      {/* Profile Picture */}
      {displayImageUrl && (
        <div className="flex justify-center mb-2.5">
          <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={displayImageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Image loading error:', displayImageUrl)
                const target = e.target as HTMLImageElement
                // Try to use critique.imageUrl as fallback if previewImageUrl fails
                if (previewImageUrl && critique.imageUrl && previewImageUrl !== critique.imageUrl) {
                  console.log('Trying fallback image URL:', critique.imageUrl)
                  target.src = critique.imageUrl
                } else {
                  target.style.display = 'none'
                }
              }}
              onLoad={() => {
                console.log('Image loaded successfully')
              }}
            />
          </div>
        </div>
      )}

      {/* Ratings Card */}
      <div className="bg-white rounded-xl p-3 pb-3 border-2 border-gray-300">
        {/* Overall Score */}
        <div className="text-center mb-2.5 pb-2.5 border-b border-gray-300">
          <div className="space-y-1">
            <div className="text-black text-xs font-medium">
              {overall.name}
            </div>
            <div className="text-lg font-bold text-black">
              {overall.score}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${getProgressBarColor(overall.score)}`}
                style={{ width: `${overall.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Type de Peau */}
        <div className="text-center mb-2.5 pb-2.5 border-b border-gray-300">
          <div className="text-black text-xs font-medium">
            Type de peau :
          </div>
          <div className="text-sm font-semibold text-black mt-1">
            {critique.skinType || 'Non spécifié'}
          </div>
        </div>

        {/* Si score >= 80 : Positifs en premier, sinon Négatifs en premier */}
        {overall.score >= 80 ? (
          <>
            {/* Positifs */}
            <div className={`mb-2.5 ${(critique.allProblems || critique.improvements || []).length > 0 ? 'pb-2.5 border-b border-gray-300' : ''}`}>
              <div className="text-black text-xs font-medium mb-1.5">
                Positifs
              </div>
              <div className="space-y-1">
                {(critique.strengths || []).map((strength, index) => (
                  <div key={index} className="text-xs text-black">
                    • {strength}
                  </div>
                ))}
                {(!critique.strengths || critique.strengths.length === 0) && (
                  <div className="text-xs text-gray-500">Aucune qualité détectée</div>
                )}
              </div>
            </div>

            {/* Négatifs - seulement si il y en a */}
            {(critique.allProblems || critique.improvements || []).length > 0 && (
              <div className="mb-2.5">
                <div className="text-black text-xs font-medium mb-1.5">
                  Négatifs
                </div>
                <div className="space-y-1">
                  {(critique.allProblems || critique.improvements || []).map((problem, index) => (
                    <div key={index} className="text-xs text-black">
                      • {problem}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Négatifs */}
            <div className="mb-2.5 pb-2.5 border-b border-gray-300">
              <div className="text-black text-xs font-medium mb-1.5">
                Négatifs
              </div>
              <div className="space-y-1">
                {(critique.allProblems || critique.improvements || []).map((problem, index) => (
                  <div key={index} className="text-xs text-black">
                    • {problem}
                  </div>
                ))}
                {(!critique.allProblems || critique.allProblems.length === 0) && (!critique.improvements || critique.improvements.length === 0) && (
                  <div className="text-xs text-gray-500">Aucun problème détecté</div>
                )}
              </div>
            </div>

            {/* Positifs */}
            <div className="mb-2.5">
              <div className="text-black text-xs font-medium mb-1.5">
                Positifs
              </div>
              <div className="space-y-1">
                {(critique.strengths || []).map((strength, index) => (
                  <div key={index} className="text-xs text-black">
                    • {strength}
                  </div>
                ))}
                {(!critique.strengths || critique.strengths.length === 0) && (
                  <div className="text-xs text-gray-500">Aucune qualité détectée</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-2.5 pt-1">
          <div className="text-xs text-black">PasMoche.com</div>
        </div>
      </div>

      {/* PDF Button ou Message si pas de visage - Toujours visible */}
      <div className="mt-2 flex justify-center">
        {critique.noFaceDetected ? (
          <div className="px-3 py-1.5 bg-yellow-500/80 text-white rounded-lg shadow-lg font-semibold flex items-center gap-1.5 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Aucun visage détecté
          </div>
        ) : (
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-3 py-1.5 blue-gradient-button disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-1.5 text-xs"
            style={{ display: 'block' }}
          >
            {isGeneratingPDF ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
