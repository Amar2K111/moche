import { NextRequest, NextResponse } from 'next/server'
import { FaceCritique } from '@/hooks/useFaceCritique'
import { generateHTMLForPDF } from '@/lib/generatePDFHTML'
import { adminDb, adminStorage } from '@/lib/firebase-admin'
import { Timestamp, FieldValue } from 'firebase-admin/firestore'

// Configuration Vercel pour les fonctions serverless
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 secondes (par défaut 10s sur Vercel)

export async function POST(request: NextRequest) {
  console.log('=== PDF GENERATION REQUEST RECEIVED ===')
  try {
    const body = await request.json()
    console.log('Request body received, has critique:', !!body.critique, 'has html:', !!body.html)
    
    const { critique, imageUrl, html: providedHtml, userId, regenerate } = body as { 
      critique?: FaceCritique; 
      imageUrl?: string | null;
      html?: string;
      userId?: string;
      regenerate?: boolean;
    }

    // Si HTML est fourni directement (pour la prévisualisation), l'utiliser
    // Sinon, générer le HTML à partir du template
    const html = providedHtml || (critique ? generateHTMLForPDF(critique, imageUrl || null) : '')
    console.log('HTML generated, length:', html.length)
    
    if (!html) {
      console.error('No HTML generated, returning 400')
      return NextResponse.json(
        { error: 'No HTML or critique data provided' },
        { status: 400 }
      )
    }
    
    // Convertir HTML en PDF avec une API externe (solution fiable pour Vercel)
    let pdfBuffer: Buffer
    
    try {
      const isVercel = process.env.VERCEL === '1'
      const isDev = process.env.NODE_ENV === 'development' && !isVercel
      
      console.log('[PDF] Starting PDF generation...')
      console.log('[PDF] Is Vercel:', isVercel)
      console.log('[PDF] Node env:', process.env.NODE_ENV)
      
      if (isVercel) {
        // Sur Vercel, utiliser html2pdf.fly.dev (gratuit, sans clé API)
        console.log('[PDF] Using html2pdf.fly.dev (free, no API key needed)...')
        
        // html2pdf.fly.dev est un service gratuit qui convertit HTML en PDF
        // Pas besoin de clé API, fonctionne directement
        const apiUrl = 'https://html2pdf.fly.dev/api/generate'
        
        console.log('[PDF] API URL:', apiUrl)
        console.log('[PDF] HTML length:', html.length)
        
        try {
          console.log('[PDF] Making fetch request to html2pdf.fly.dev...')
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 secondes timeout
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              html: html,
              format: 'A4',
              margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
              },
              printBackground: true,
            }),
            signal: controller.signal,
          })
          
          clearTimeout(timeoutId)
          
          console.log('[PDF] html2pdf.fly.dev Response status:', response.status)
          console.log('[PDF] html2pdf.fly.dev Response statusText:', response.statusText)
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('[PDF] ❌ html2pdf.fly.dev API Error response:', errorText)
            throw new Error(`html2pdf.fly.dev API error: ${response.status} - ${errorText}`)
          }
          
          const contentType = response.headers.get('content-type')
          console.log('[PDF] Response content-type:', contentType)
          
          // html2pdf.fly.dev retourne directement le PDF en binaire
          const arrayBuffer = await response.arrayBuffer()
          pdfBuffer = Buffer.from(arrayBuffer)
          
          console.log('[PDF] ✅ PDF received from html2pdf.fly.dev, size:', pdfBuffer.length, 'bytes')
        } catch (apiError: any) {
          console.error('[PDF] ❌ html2pdf.fly.dev API call failed')
          console.error('[PDF] ❌ Error name:', apiError.name)
          console.error('[PDF] ❌ Error message:', apiError.message)
          console.error('[PDF] ❌ Error stack:', apiError.stack)
          
          if (apiError.name === 'AbortError') {
            throw new Error('html2pdf.fly.dev API request timeout (30s)')
          } else if (apiError.message.includes('fetch failed')) {
            throw new Error('Network error: Could not reach html2pdf.fly.dev. Check your internet connection.')
          }
          
          throw apiError
        }
      } else {
        // En local, utiliser Puppeteer avec Chrome installé
        console.log('[PDF] Using Puppeteer for local development...')
        let browser
        // En développement local, utiliser Chrome installé localement
        console.log('Importing puppeteer-core for local development...')
        const puppeteer = await import('puppeteer-core')
        browser = await puppeteer.launch({
          channel: 'chrome',
          headless: true,
        })
        console.log('[PDF] Browser launched successfully (local)')
        
        const page = await browser.newPage()
        console.log('[PDF] Page created')
        
        await page.setContent(html, { waitUntil: 'networkidle0' })
        console.log('[PDF] HTML content loaded')
        
        // Attendre que l'image soit chargée si elle existe
        if (imageUrl) {
          try {
            await page.waitForSelector('img.profile-image', { timeout: 15000 }).catch(() => {
              console.warn('[PDF] Image selector not found, continuing anyway')
            })
            await new Promise(resolve => setTimeout(resolve, 500))
          } catch (imageError) {
            console.warn('[PDF] Error waiting for image:', imageError)
          }
        }
        
        pdfBuffer = (await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
          }
        })) as Buffer
        console.log('[PDF] ✅ PDF generated successfully (local), size:', pdfBuffer.length, 'bytes')
        
        await browser.close()
      }
    } catch (puppeteerError: any) {
      // Si Puppeteer n'est pas disponible, on peut fallback sur une autre méthode
      const errorMessage = puppeteerError?.message || 'Unknown error'
      const errorStack = puppeteerError?.stack || 'No stack trace'
      
      // Log détaillé pour Vercel
      console.error('=== PDF GENERATION ERROR ===')
      console.error('Error message:', errorMessage)
      console.error('Error name:', puppeteerError?.name || 'Unknown')
      console.error('Error stack:', errorStack)
      console.error('Is Vercel:', process.env.VERCEL)
      console.error('Node env:', process.env.NODE_ENV)
      console.error('============================')
      
      return NextResponse.json(
        { 
          error: 'Échec de la génération du PDF. Erreur: ' + errorMessage,
          details: errorMessage,
          stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
        },
        { status: 500 }
      )
    }

    // Stocker le PDF dans Firebase Storage et enregistrer l'URL dans Firestore
    let pdfUrl: string | null = null
    if (userId && adminStorage && adminDb && critique) {
      try {
        // Créer toujours une nouvelle entrée dans la galerie pour chaque PDF généré
        // Cela permet d'avoir plusieurs PDFs différents pour la même image
        let critiqueId = critique.id
        let isNewCritique = false
        
        // Si l'ID est temporaire ou si on veut créer une nouvelle entrée, générer un nouvel ID
        if (!critiqueId || critiqueId.startsWith('temp-') || critiqueId.startsWith('temp-reuse-')) {
          // Toujours créer une nouvelle entrée dans la galerie pour chaque PDF
          critiqueId = adminDb.collection('users').doc(userId).collection('critiques').doc().id
          isNewCritique = true
        } else {
          // Si l'ID existe déjà, vérifier si la critique existe
          const existingDoc = await adminDb.collection('users').doc(userId).collection('critiques').doc(critiqueId).get()
          if (!existingDoc.exists) {
            isNewCritique = true
          }
        }
        
        const fileName = `pdfs/${userId}/${critiqueId}.pdf`
        
        // Uploader le PDF dans Firebase Storage (écrase l'ancien si existe)
        const bucket = adminStorage.bucket()
        const file = bucket.file(fileName)
        
        await file.save(pdfBuffer, {
          metadata: {
            contentType: 'application/pdf',
            metadata: {
              userId,
              critiqueId,
              generatedAt: new Date().toISOString(),
              regenerated: regenerate || false
            }
          }
        })

        // Rendre le fichier accessible publiquement (ou utiliser signed URL pour plus de sécurité)
        await file.makePublic()
        pdfUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

        // Enregistrer l'URL du PDF dans le document critique
        const critiqueDocRef = adminDb.collection('users').doc(userId).collection('critiques').doc(critiqueId)
        
        // Toujours sauvegarder la critique complète dans la galerie pour chaque PDF généré
        // Cela permet d'avoir plusieurs entrées séparées même pour la même image
        if (critique) {
          // Convertir createdAt en Timestamp Firestore si c'est une Date
          let createdAtTimestamp
          if (critique.createdAt instanceof Date) {
            createdAtTimestamp = Timestamp.fromDate(critique.createdAt)
          } else if (critique.createdAt) {
            createdAtTimestamp = Timestamp.fromDate(new Date(critique.createdAt))
          } else {
            createdAtTimestamp = FieldValue.serverTimestamp()
          }
          
          const critiqueData = {
            userId: critique.userId || userId,
            imageUrl: critique.imageUrl,
            score: critique.score,
            verdict: critique.verdict,
            critique: critique.critique,
            strengths: critique.strengths,
            improvements: critique.improvements,
            categoryScores: {
              cheveux: 0,
              yeux: 0,
              nez: 0,
              bouche: 0,
              machoire: 0,
              peau: 0,
              symetrie: 0,
              potentiel: 0
            },
            pdfUrl: pdfUrl,
            createdAt: createdAtTimestamp
          }
          
          // Utiliser set() pour créer une nouvelle entrée ou écraser l'ancienne si l'ID existe
          await critiqueDocRef.set(critiqueData)
        }
      } catch (storageError: any) {
        console.error('Error uploading PDF to Firebase Storage:', storageError)
        // Ne pas bloquer la génération du PDF si le stockage échoue
      }
    }
    
    // Convertir Buffer en Uint8Array pour NextResponse
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="analyse-faciale.pdf"'
      }
    })
  } catch (error: any) {
    console.error('=== TOP LEVEL ERROR IN PDF GENERATION ===')
    console.error('Error message:', error?.message || 'Unknown error')
    console.error('Error name:', error?.name || 'Unknown')
    console.error('Error stack:', error?.stack || 'No stack trace')
    console.error('==========================================')
    return NextResponse.json(
      { error: 'Failed to generate PDF: ' + (error?.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
