'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaceCritique } from '@/hooks/useFaceCritique'
import { generateHTMLForPDF } from '@/lib/generatePDFHTML'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/contexts/AuthContext'

function PreviewPDFContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [html, setHtml] = useState<string>('')
  const [editedHtml, setEditedHtml] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    // Récupérer les données depuis localStorage ou URL params
    const critiqueId = searchParams.get('critiqueId')
    
    // Essayer de récupérer depuis localStorage
    const savedCritique = localStorage.getItem('currentCritique')
    const savedImageUrl = localStorage.getItem('currentImageUrl')
    
    if (savedCritique) {
      try {
        const critique: FaceCritique = JSON.parse(savedCritique)
        const imgUrl = savedImageUrl || null
        setImageUrl(imgUrl)
        
        // Générer le HTML initial avec toutes les améliorations
        const generatedHtml = generateHTMLForPDF(critique, imgUrl)
        setHtml(generatedHtml)
        setEditedHtml(generatedHtml)
      } catch (error) {
        console.error('Error parsing critique:', error)
        // En cas d'erreur, utiliser l'exemple
        loadExampleCritique()
      }
    } else {
      loadExampleCritique()
    }
  }, [searchParams])
  
  const loadExampleCritique = () => {
    // Créer un exemple de critique pour le développement avec toutes les catégories
      const exampleCritique: FaceCritique = {
        id: 'example',
        userId: 'example-user',
        imageUrl: '',
      score: 85,
        verdict: 'Pas moche',
        categoryScores: {
        cheveux: 78,
          yeux: 85,
        nez: 75,
          bouche: 80,
        machoire: 82,
          peau: 85,
        symetrie: 85,
        potentiel: 88
        },
      improvements: [
        'Envisager une coupe de cheveux plus structurée pour mettre en valeur les traits du visage.',
        'Hydrater la peau quotidiennement pour améliorer sa texture.',
        'Maintenir une routine de soin régulière pour préserver votre apparence.',
        'Protéger votre peau du soleil avec une crème SPF 30+ tous les jours.'
      ],
        createdAt: new Date()
      }
      
      const generatedHtml = generateHTMLForPDF(exampleCritique, null)
      setHtml(generatedHtml)
      setEditedHtml(generatedHtml)
    }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setHtml(editedHtml)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHtml(html)
    setIsEditing(false)
  }

  const handleDownloadPDF = async () => {
    // Utiliser le HTML modifié pour générer le PDF
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: editedHtml, // Passer le HTML modifié
        critique: JSON.parse(localStorage.getItem('currentCritique') || '{}'),
        imageUrl: imageUrl,
        userId: user?.uid
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || 'Erreur lors de la génération du PDF'
      if (errorMessage.includes('already generated') || errorMessage.includes('You can only generate one PDF')) {
        alert('Vous avez déjà généré un PDF. Vous ne pouvez en générer qu\'un seul.')
      } else {
        alert(errorMessage)
      }
      return
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analyse-faciale-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Toolbar - Mobile optimized */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">Prévisualisation PDF</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg active:bg-blue-700 transition min-h-[48px] touch-manipulation text-sm sm:text-base"
                  >
                    Modifier le HTML
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg active:bg-green-700 transition min-h-[48px] touch-manipulation text-sm sm:text-base"
                  >
                    Télécharger PDF
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg active:bg-green-700 transition min-h-[48px] touch-manipulation text-sm sm:text-base"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-3 sm:py-2 bg-gray-600 text-white rounded-lg active:bg-gray-700 transition min-h-[48px] touch-manipulation text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Preview - Mode plein écran si pas d'édition */}
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isEditing ? '' : 'lg:col-span-2'}`}>
              <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                <h2 className="font-semibold text-gray-700">Aperçu en Temps Réel</h2>
                <span className="text-xs text-gray-500">Mise à jour automatique</span>
              </div>
              <div className="p-4 overflow-auto bg-gray-50" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="bg-white shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <iframe
                  srcDoc={editedHtml}
                  className="w-full border-0"
                    style={{ minHeight: '1000px', width: '100%' }}
                  title="PDF Preview"
                    key={editedHtml.substring(0, 100)} // Force le re-render si HTML change
                />
                </div>
              </div>
            </div>

            {/* Editor - Seulement visible en mode édition */}
            {isEditing && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <h2 className="font-semibold text-gray-700">Code HTML</h2>
              </div>
              <div className="p-4">
                <textarea
                  value={editedHtml}
                  onChange={(e) => setEditedHtml(e.target.value)}
                  className="w-full h-full font-mono text-sm border border-gray-300 rounded p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function PreviewPDFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <PreviewPDFContent />
    </Suspense>
  )
}

