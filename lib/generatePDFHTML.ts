import { FaceCritique } from '@/hooks/useFaceCritique'

// Fonction pour échapper les caractères HTML spéciaux
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// Fonction pour obtenir la couleur du score
const getScoreColor = (score: number): string => {
  if (score >= 85) return '#16a34a' // Dark green
  if (score >= 76) return '#4ade80' // Light green
  if (score >= 60) return '#eab308' // Yellow
  if (score >= 40) return '#f97316' // Orange
  return '#ef4444' // Red
}

// Fonction pour générer des alternatives de produits adaptées
const getAlternatives = (step: string, product: string, critique?: FaceCritique): string => {
  const alternativesMap: { [key: string]: string[] } = {
    'Nettoyant': [
      'La Roche-Posay Toleriane Purifying Foaming Cleanser',
      'Neutrogena Ultra Gentle Daily Cleanser',
      'Cetaphil Daily Facial Cleanser',
      'COSRX Low pH Good Morning Gel Cleanser',
      'Beauty of Joseon Green Plum Refreshing Cleanser'
    ],
    'Tonique': [
      'Thayers Witch Hazel Toner',
      'Pixi Glow Tonic',
      'The Ordinary Glycolic Acid 7% Toning Solution',
      'COSRX AHA/BHA Clarifying Treatment Toner',
      'Paula\'s Choice Skin Perfecting 2% BHA Liquid'
    ],
    'Sérum': [
      'The Ordinary Niacinamide 10% + Zinc 1%',
      'COSRX Advanced Snail 96 Mucin Power Essence',
      'Paula\'s Choice 10% Niacinamide Booster',
      'Beauty of Joseon Glow Deep Serum',
      'The Inkey List Niacinamide'
    ],
    'Crème': [
      'CeraVe Daily Moisturizing Lotion',
      'Neutrogena Hydro Boost Water Gel',
      'La Roche-Posay Toleriane Double Repair Moisturizer',
      'COSRX Advanced Snail 92 All in One Cream',
      'Laneige Water Bank Hyaluronic Cream'
    ],
    'SPF': [
      'Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 50',
      'EltaMD UV Clear Broad-Spectrum SPF 46',
      'La Roche-Posay Anthelios Ultra Light SPF 60',
      'Beauty of Joseon Relief Sun SPF 50+',
      'COSRX Aloe Soothing Sun Cream SPF 50'
    ],
    'Démaquillant': [
      'Garnier Micellar Cleansing Water',
      'Bioderma Sensibio H2O',
      'Simple Kind to Skin Micellar Water',
      'COSRX Low pH Good Morning Gel Cleanser',
      'Beauty of Joseon Green Plum Refreshing Cleanser'
    ],
    'Sérum Acide': [
      'The Ordinary Glycolic Acid 7% Toning Solution',
      'Paula\'s Choice Skin Perfecting 2% BHA Liquid',
      'COSRX AHA/BHA Clarifying Treatment Toner',
      'The Ordinary Lactic Acid 10% + HA',
      'Pixi Glow Tonic'
    ],
    'Sérum Traitant': [
      'The Ordinary Hyaluronic Acid 2% + B5',
      'COSRX Advanced Snail 96 Mucin Power Essence',
      'The Ordinary Buffet',
      'Beauty of Joseon Glow Deep Serum',
      'Laneige Water Bank Hyaluronic Serum'
    ],
    'Crème Nuit': [
      'CeraVe PM Facial Moisturizing Lotion',
      'Neutrogena Hydro Boost Night Pressed Serum',
      'La Roche-Posay Toleriane Ultra Night Moisturizer',
      'COSRX Advanced Snail 92 All in One Cream',
      'Laneige Water Sleeping Mask'
    ]
  }
  
  // Trouver des alternatives basées sur le type de step
  const stepLower = step.toLowerCase()
  for (const [key, alternatives] of Object.entries(alternativesMap)) {
    if (stepLower.includes(key.toLowerCase()) || stepLower.includes('nettoyant') || stepLower.includes('cleanser') || stepLower.includes('démaquillant')) {
      // Retourner 2-3 alternatives, en excluant le produit actuel
      const filtered = alternatives.filter(alt => alt !== product)
      return filtered.slice(0, 3).join(', ')
    }
  }
  
  // Alternatives génériques si pas de correspondance
  return 'La Roche-Posay, CeraVe, The Ordinary, COSRX'
}

// Template HTML pour le PDF - Design similaire au PDF de référence
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Routine Skincare 100% Personnalisée</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background: #ffffff;
            color: #1a1a1a;
            line-height: 1.6;
            padding: 40px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
        .header {
            margin-bottom: 40px;
        }
        .main-title {
            font-size: 28px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 10px;
        }
        .date {
            font-size: 12px;
            color: #666666;
            margin-bottom: 30px;
        }
        .score-section {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        .score-label {
            font-size: 14px;
            font-weight: 600;
            color: #666666;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
        .score-value {
            font-size: 72px;
            font-weight: 700;
            color: {{SCORE_COLOR}};
            line-height: 1;
        }
        .stats-recap {
            display: none;
        }
        .stats-recap-item {
            display: none;
        }
        .skin-summary {
            margin-bottom: 40px;
        }
        .skin-summary-text {
            font-size: 14px;
            color: #1a1a1a;
            line-height: 1.7;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .problems-section {
            margin-bottom: 40px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #000000;
        }
        .problems-list {
            list-style: none;
            padding: 0;
        }
        .problem-item {
            padding: 10px 0;
            font-size: 14px;
            color: #1a1a1a;
            display: flex;
            align-items: flex-start;
        }
        .problem-item::before {
            content: "✓";
            margin-right: 10px;
            color: #000000;
            font-weight: bold;
        }
        .routines-container {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .routine-section {
            margin-bottom: 25px;
        }
        .routine-section:first-of-type {
            margin-bottom: 20px;
        }
        .routine-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #000000;
            page-break-after: avoid;
        }
        .routine-step {
            margin-bottom: 10px;
            padding: 10px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            page-break-inside: avoid;
        }
        .step-header {
            margin-bottom: 6px;
        }
        .step-name {
            font-size: 13px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 3px;
        }
        .step-product {
            font-size: 12px;
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 3px;
        }
        .step-alternatives {
            font-size: 9px;
            color: #2563eb;
            font-weight: 400;
            margin-top: 4px;
            line-height: 1.3;
        }
        .step-description {
            font-size: 11px;
            color: #000000;
            line-height: 1.5;
        }
        @media print {
            body {
                padding: 15px;
            }
            .routines-container {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 class="main-title">Routine Skincare 100% Personnalisée</h1>
            <div class="date">{{DATE}}</div>
        </div>

        <!-- Score Section - En haut comme dans le PDF de référence -->
        <div class="score-section">
            <div class="score-label">SCORE GLOBAL</div>
            <div class="score-value" style="color: {{SCORE_COLOR}}">{{SCORE}}</div>
            <div class="stats-recap">
                {{STATS_RECAP}}
                </div>
                </div>
            
        <!-- Skin Summary -->
        <div class="skin-summary">
            <div class="skin-summary-text">{{SKIN_SUMMARY}}</div>
                </div>
            
        <!-- Problems List -->
        <div class="problems-section">
                <h2 class="section-title">Points à Améliorer</h2>
            <ul class="problems-list">
                {{PROBLEMS_LIST}}
                </ul>
        </div>

        <!-- Routines Container -->
        <div class="routines-container">
            <!-- Day Routine -->
            <div class="routine-section">
                <h2 class="routine-title">Routine du Jour</h2>
                {{DAY_ROUTINE}}
            </div>

            <!-- Night Routine -->
            <div class="routine-section">
                <h2 class="routine-title">Routine de la Nuit</h2>
                {{NIGHT_ROUTINE}}
            </div>
        </div>
    </div>
</body>
</html>`

// Générer le HTML avec les données
const generateHTML = (critique: FaceCritique, imageUrl: string | null): string => {
  let html = HTML_TEMPLATE
  
  const skinScore = critique.categoryScores?.peau || critique.score || 0
  const scoreColor = getScoreColor(skinScore)
  
  // Date
  const date = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
  
  // Stats recap - format similaire au PDF de référence
  const statsRecap = []
  if (critique.categoryScores?.texture) statsRecap.push(`LISSE ${critique.categoryScores.texture}`)
  if (critique.categoryScores?.uniformite) statsRecap.push(`TEINT ${critique.categoryScores.uniformite}`)
  if (critique.categoryScores?.hydratation) statsRecap.push(`HYDRATATION ${critique.categoryScores.hydratation}`)
  if (critique.categoryScores?.eclat) statsRecap.push(`BRILLANT ${critique.categoryScores.eclat}`)
  if (critique.categoryScores?.finessePores) statsRecap.push(`PORES FINS ${critique.categoryScores.finessePores}`)
  if (critique.categoryScores?.elasticite) statsRecap.push(`SOUPLE ${critique.categoryScores.elasticite}`)
  
  const statsRecapHtml = statsRecap.length > 0 
    ? statsRecap.map(stat => `<span class="stats-recap-item">${escapeHtml(stat)}</span>`).join('')
    : ''
  
  // Skin summary
  const skinSummary = critique.skinSummary || critique.critique || 'Analyse de votre peau'
  
  // Problems list
  const allProblems = critique.allProblems || critique.improvements || []
  const problemsListHtml = allProblems.length > 0
    ? allProblems.map(problem => `<li class="problem-item">${escapeHtml(problem)}</li>`).join('')
    : '<li class="problem-item">Aucun problème détecté</li>'
  
  // Day routine - produits en bleu dans la description, alternatives à l'ancien emplacement
  const dayRoutine = critique.dayRoutine || []
  const dayRoutineHtml = dayRoutine.length > 0
    ? dayRoutine.map(step => {
        // Produit en bleu dans la description (remplacer le nom du produit par une version en bleu)
        let descriptionWithProduct = step.description
        // Chercher le produit dans la description et le mettre en bleu
        if (step.description.includes(step.product)) {
          descriptionWithProduct = step.description.replace(
            step.product, 
            `<span style="color: #2563eb; font-weight: 600;">${escapeHtml(step.product)}</span>`
          )
        } else {
          // Si le produit n'est pas dans la description, l'ajouter en bleu au début
          descriptionWithProduct = `<span style="color: #2563eb; font-weight: 600;">${escapeHtml(step.product)}</span> - ${escapeHtml(step.description)}`
        }
        // Alternatives (générer quelques alternatives basées sur le type de produit)
        const alternatives = getAlternatives(step.step, step.product, critique)
        return `
        <div class="routine-step">
            <div class="step-header">
                <div class="step-name">${escapeHtml(step.step)}</div>
            </div>
            <div class="step-description">${descriptionWithProduct}</div>
            ${alternatives ? `<div class="step-alternatives">Alternatives: ${alternatives}</div>` : ''}
        </div>
    `
      }).join('')
    : '<div class="routine-step"><div class="step-description">Routine du jour non disponible</div></div>'
  
  // Night routine - produits en bleu dans la description, alternatives à l'ancien emplacement
  const nightRoutine = critique.nightRoutine || []
  const nightRoutineHtml = nightRoutine.length > 0
    ? nightRoutine.map(step => {
        // Produit en bleu dans la description (remplacer le nom du produit par une version en bleu)
        let descriptionWithProduct = step.description
        // Chercher le produit dans la description et le mettre en bleu
        if (step.description.includes(step.product)) {
          descriptionWithProduct = step.description.replace(
            step.product, 
            `<span style="color: #2563eb; font-weight: 600;">${escapeHtml(step.product)}</span>`
          )
        } else {
          // Si le produit n'est pas dans la description, l'ajouter en bleu au début
          descriptionWithProduct = `<span style="color: #2563eb; font-weight: 600;">${escapeHtml(step.product)}</span> - ${escapeHtml(step.description)}`
        }
        // Alternatives (générer quelques alternatives basées sur le type de produit)
        const alternatives = getAlternatives(step.step, step.product, critique)
        return `
        <div class="routine-step">
            <div class="step-header">
                <div class="step-name">${escapeHtml(step.step)}</div>
            </div>
            <div class="step-description">${descriptionWithProduct}</div>
            ${alternatives ? `<div class="step-alternatives">Alternatives: ${alternatives}</div>` : ''}
        </div>
    `
      }).join('')
    : '<div class="routine-step"><div class="step-description">Routine de nuit non disponible</div></div>'
  
  // Remplacer les placeholders
  html = html.replace('{{DATE}}', date)
  html = html.replace('{{STATS_RECAP}}', statsRecapHtml)
  html = html.replace(/{{SCORE}}/g, skinScore.toString())
  html = html.replace(/{{SCORE_COLOR}}/g, scoreColor)
  html = html.replace('{{SKIN_SUMMARY}}', escapeHtml(skinSummary))
  html = html.replace('{{PROBLEMS_LIST}}', problemsListHtml)
  html = html.replace('{{DAY_ROUTINE}}', dayRoutineHtml)
  html = html.replace('{{NIGHT_ROUTINE}}', nightRoutineHtml)
  
  return html
}

// Fonction principale pour générer le PDF (appelée côté client)
export const generatePDF = async (critique: FaceCritique, imageUrl: string | null, userId?: string, regenerate?: boolean): Promise<void> => {
  // Appeler l'API route pour générer le PDF côté serveur
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      critique,
      imageUrl,
      userId,
      regenerate: regenerate || false
    })
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to generate PDF')
  }
  
  // Si c'est une regénération et qu'on reçoit une URL JSON au lieu d'un blob
  const contentType = response.headers.get('content-type')
  
  if (contentType && contentType.includes('application/json')) {
    // Cas où on reçoit une URL JSON (regénération)
    const data = await response.json()
    if (data.pdfUrl) {
      // Télécharger le PDF depuis l'URL
      const pdfResponse = await fetch(data.pdfUrl)
      const blob = await pdfResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analyse-faciale.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      return
    }
  }
  
  // Cas normal : télécharger le blob directement
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analyse-faciale.pdf`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

// Fonction pour générer le HTML (utilisée par l'API)
export const generateHTMLForPDF = (critique: FaceCritique, imageUrl: string | null): string => {
  return generateHTML(critique, imageUrl)
}
