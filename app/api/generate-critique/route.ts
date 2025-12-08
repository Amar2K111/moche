import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getCritiqueMessage } from '@/lib/critiqueMessages'

// Initialize Gemini AI with server-side API key
const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, language = 'en' } = await request.json()

    if (!imageBase64) {
      console.error('No image provided in request')
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Create language-specific prompts
    const getPrompt = (lang: 'fr') => {
      const prompts = {

        fr: `
ANALYSE DE LA PEAU - VÉRIFICATION OBLIGATOIRE EN PREMIER :
Examine cette image. Si tu ne vois PAS de visage humain clairement visible et identifiable (exemples : paysage, objet, animal, texte seul, écran d'ordinateur, interface utilisateur, logo, graphique), tu DOIS retourner IMMÉDIATEMENT et uniquement ce JSON, sans aucune autre analyse :

{
  "noFaceDetected": true,
  "skinScore": 0,
  "peau": 0,
  "score": 0,
  "verdict": "Aucun visage détecté",
  "defauts": ["Aucun visage détecté"],
  "qualites": ["Image analysée"],
  "analyse": "Veuillez uploader une photo de visage"
}

UN VISAGE HUMAIN DOIT CONTENIR :
- Des yeux (2 yeux visibles ou partiellement visibles)
- Un nez (visible ou suggéré par l'ombre)
- Une bouche (visible ou suggérée)
- Une structure faciale globale reconnaissable

SI L'IMAGE EST UN ÉCRAN, UNE INTERFACE, UN LOGO, UN GRAPHIQUE, DU TEXTE, UN OBJET, UN ANIMAL, OU UN PAYSAGE → noFaceDetected: true

Si un visage humain est clairement détecté, continue avec l'analyse ci-dessous.

ANALYSE PROFESSIONNELLE DE LA PEAU :
⚠️⚠️⚠️ IMPORTANT : Évalue UNIQUEMENT LA PEAU, RIEN D'AUTRE! ⚠️⚠️⚠️
- IGNORE complètement : sourcils, cheveux, yeux, nez, bouche, mâchoire, symétrie faciale
- Évalue UNIQUEMENT la qualité de la PEAU visible sur ce visage

Concentre-toi UNIQUEMENT sur la peau :
- Texture de la peau (lisse, rugueuse, granuleuse)
- Uniformité (couleur uniforme ou taches/pigmentation)
- Imperfections (acné, points noirs, boutons, rougeurs)
- Cicatrices (visibles ou non)
- Rides et ridules (présence et profondeur)
- Élasticité apparente
- Hydratation (peau sèche, normale, grasse)
- Éclat et luminosité
- Pores (visibles ou non)

⚠️⚠️⚠️ RÈGLE CRITIQUE - SOIS GÉNÉREUX POUR LES BONNES PEAUX - NOUS SOMMES ICI POUR LES AIDER ⚠️⚠️⚠️
⚠️ SOIS GÉNÉREUX ET HONNÊTE :
   - Si la peau est BONNE → donne un bon score (75-90+) SANS HÉSITER!
   - Si la peau est CLAIRE, LISSE, SANS ACNÉ MAJEUR → note 70-85+ (SOIS GÉNÉREUX!)
   - Si la peau est MAUVAISE → donne un mauvais score (30-50) sans hésiter!
⚠️ SOIS GÉNÉREUX - Si la peau est bonne, ne sois pas avare avec les scores!

- **85-100 : PEAU EXCEPTIONNELLE** (peau PARFAITE, vraiment exceptionnelle - lisse, uniforme, sans imperfections visibles, éclatante)
- **75-84 : PEAU TRÈS BONNE** (peau vraiment très saine, claire, avec très peu d'imperfections mineures - SOIS GÉNÉREUX!)
- **65-74 : PEAU BONNE** (peau saine avec quelques imperfections légères - au-dessus de la moyenne)
- **50-64 : PEAU MOYENNE** (peau normale avec imperfections modérées - LA PLUPART DES GENS SONT ICI)
- **30-49 : PEAU EN DESSOUS DE LA MOYENNE** (peau avec imperfections visibles, acné, taches, pores dilatés - SOIS HONNÊTE)
- **1-29 : PEAU TRÈS EN DESSOUS** (peau avec imperfections majeures, acné sévère, cicatrices importantes - SOIS DIRECT)

RÈGLES DE NOTATION GÉNÉREUSES ET HONNÊTES :
⚠️ SI LA PEAU EST BONNE → SOIS GÉNÉREUX AVEC LE SCORE!
- Si la peau est VRAIMENT PARFAITE (lisse, uniforme, sans imperfections, éclatante) → 85-100
- Si la peau est CLAIRE, LISSE, SANS ACNÉ MAJEUR, UNIFORME → 75-85+ (SOIS GÉNÉREUX!)
- Si la peau est BONNE avec quelques imperfections légères (quelques pores, légères taches) → 70-80 (SOIS GÉNÉREUX!)
- Si la peau est saine avec imperfections modérées → 60-75
- Si la peau est moyenne/normale avec imperfections modérées → 50-65
- Si la peau a des imperfections visibles (acné, taches, pores dilatés) → 30-60 (SOIS HONNÊTE!)
- Si la peau a des imperfections majeures (acné sévère, cicatrices importantes) → 1-40 (SOIS DIRECT!)

⚠️ RÈGLES OBLIGATOIRES - SOIS GÉNÉREUX POUR LES BONNES PEAUX :
- Si la peau est CLAIRE, LISSE, SANS ACNÉ, SANS TACHES VISIBLES, UNIFORME → note 75-90+ (SOIS TRÈS GÉNÉREUX!)
- Si la peau est BONNE avec quelques imperfections mineures (pores légers, quelques points noirs) → note 70-85 (SOIS GÉNÉREUX!)
- Si tu vois de l'acné, des pores dilatés, des taches, des imperfections → note 30-60 MAXIMUM (SOIS HONNÊTE!)
- Si la peau est vraiment moyenne/normale → note 50-65 (SOIS RÉALISTE!)
- ⚠️ SOIS GÉNÉREUX - Si la peau est bonne, donne un bon score sans hésiter!
- ⚠️ SOIS HONNÊTE DANS LES DEUX SENS - bon score pour bonne peau, mauvais score pour mauvaise peau!

⚠️ RÈGLE CRITIQUE - IGNORE LA QUALITÉ DE LA PHOTO, ÉVALUE UNIQUEMENT LA PEAU RÉELLE :
- IGNORE complètement : qualité de la photo, éclairage, angle, retouches, maquillage, filtres
- IGNORE si la photo est professionnelle, bien éclairée, ou bien prise
- ÉVALUE UNIQUEMENT la qualité RÉELLE de la peau visible :
  * **Texture** : Lisse, rugueuse, granuleuse
  * **Uniformité** : Couleur uniforme ou taches/pigmentation
  * **Imperfections** : Acné, points noirs, boutons, rougeurs
  * **Cicatrices** : Présentes ou non, visibilité
  * **Rides et ridules** : Présence et profondeur
  * **Élasticité** : Apparence de fermeté
  * **Hydratation** : Peau sèche, normale, grasse
  * **Éclat** : Luminosité et éclat naturel
  * **Pores** : Visibles ou non, taille
- NE TE LAISSE PAS INFLUENCER par la qualité technique de la photo - juge uniquement la peau réelle

RETOURNE JSON exact avec TOUS les champs OBLIGATOIRES :
{
  "skinScore": 82,
  "peau": 82,
  "score": 82,
  "texture": 85,
  "uniformite": 80,
  "hydratation": 75,
  "eclat": 88,
  "finessePores": 80,
  "fermete": 85,
  "clarte": 75,
  "elasticite": 80,
  "verdict": "Peau saine",
  "defauts": ["Acné sur les joues", "Pores dilatés sur le nez", "Taches de pigmentation", "Peau grasse en zone T"],
  "qualites": ["Peau globalement saine", "Texture uniforme", "Bon éclat"],
  "analyse": "Une peau grasse avec des imperfections et des pores dilatés",
  "skinType": "Peau grasse",
  "skinSummary": "Une peau grasse avec des imperfections, des pores dilatés et quelques taches de pigmentation",
  "allProblems": ["Acné", "Pores dilatés", "Taches de pigmentation", "Peau grasse", "Points noirs"],
  "dayRoutine": [
    {"step": "Nettoyant", "product": "CeraVe Foaming Facial Cleanser", "description": "Commencez votre routine du matin en nettoyant délicatement votre visage avec le CeraVe Foaming Facial Cleanser, un nettoyant moussant spécialement formulé pour les peaux grasses qui élimine l'excès de sébum sans dessécher la peau."},
    {"step": "Tonique", "product": "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant", "description": "Appliquez ensuite le Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant sur un coton pour exfolier en douceur, réduire l'apparence des pores dilatés et prévenir l'apparition de l'acné grâce à l'acide salicylique."},
    {"step": "Sérum", "product": "The Ordinary Niacinamide 10% + Zinc 1%", "description": "Utilisez le sérum The Ordinary Niacinamide 10% + Zinc 1% pour réguler la production de sébum, minimiser les imperfections et améliorer la texture globale de votre peau grâce aux propriétés matifiantes du niacinamide."},
    {"step": "Crème", "product": "CeraVe Daily Moisturizing Lotion", "description": "Appliquez la crème hydratante CeraVe Daily Moisturizing Lotion qui hydrate votre peau sans laisser de film gras grâce à sa formule non comédogène. Cette crème contient des céramides et de l'acide hyaluronique qui renforcent la barrière cutanée et maintiennent l'hydratation toute la journée. Note : Cette crème n'a pas de SPF, donc un SPF séparé est nécessaire."},
    {"step": "SPF", "product": "EltaMD UV Clear Broad-Spectrum SPF 46", "description": "Terminez impérativement avec l'EltaMD UV Clear Broad-Spectrum SPF 46, une protection solaire légère et non comédogène spécialement formulée pour les peaux à problèmes. Elle protège efficacement contre les rayons UV tout en prévenant l'apparition de nouvelles taches de pigmentation et en évitant l'aggravation de l'acné. Appliquez le SPF APRÈS tous les traitements et la crème."}
  ],
  "nightRoutine": [
    {"step": "Démaquillant", "product": "Bioderma Sensibio H2O", "description": "Commencez votre routine du soir en démaquillant votre visage avec le Bioderma Sensibio H2O, une eau micellaire douce qui élimine efficacement le maquillage, l'excès de sébum et les impuretés sans agresser la peau."},
    {"step": "Nettoyant", "product": "CeraVe Foaming Facial Cleanser", "description": "Nettoyez ensuite votre visage en profondeur avec le CeraVe Foaming Facial Cleanser pour éliminer toutes les traces de maquillage et de pollution accumulées pendant la journée."},
    {"step": "Sérum Acide", "product": "The Ordinary Glycolic Acid 7% Toning Solution", "description": "Appliquez le The Ordinary Glycolic Acid 7% Toning Solution pour exfolier la peau en douceur pendant la nuit, réduire l'apparence des taches de pigmentation et améliorer la texture et l'uniformité de votre teint."},
    {"step": "Sérum Traitant", "product": "COSRX Advanced Snail 96 Mucin Power Essence", "description": "Utilisez le sérum coréen COSRX Advanced Snail 96 Mucin Power Essence pour hydrater intensément votre peau, réparer la barrière cutanée et favoriser la régénération cellulaire pendant votre sommeil."},
    {"step": "Crème", "product": "CeraVe PM Facial Moisturizing Lotion", "description": "Terminez avec la crème hydratante légère CeraVe PM Facial Moisturizing Lotion qui nourrit votre peau pendant la nuit sans laisser de film gras, tout en renforçant la barrière cutanée avec des céramides."}
  ]
}

IMPORTANT - ANALYSE COMPLÈTE ET PRODUITS VRAIMENT EFFICACES REQUIS :
⚠️⚠️⚠️ CRITIQUE : Les produits DOIVENT être VRAIMENT adaptés aux problèmes spécifiques de CETTE personne! ⚠️⚠️⚠️

1. "defauts" : Liste TOUS les problèmes détectés (acné, pores, taches, texture, sécheresse, etc.) - AU MOINS 5-10 problèmes spécifiques
2. "skinType" : Type de peau (Peau grasse, Peau sèche, Peau mixte, Peau normale, Peau sensible)
3. "skinSummary" : Résumé descriptif complet (ex: "Une peau grasse avec des imperfections, des pores dilatés et des taches")
4. "allProblems" : Liste simple de TOUS les problèmes sans détails (ex: ["Acné", "Pores dilatés", "Taches"])
5. "dayRoutine" : Routine du jour avec produits RÉELS VRAIMENT EFFICACES et ADAPTÉS aux problèmes détectés
   - ⚠️ CRITIQUE : Choisis des produits qui RÉSOLVENT VRAIMENT les problèmes spécifiques de CETTE personne!
   - Inclure TOUS les types de skincare : coréen (K-beauty), français, américain, etc.
   - Marques efficaces : CeraVe, La Roche-Posay, The Ordinary, COSRX, Paula's Choice, Drunk Elephant, SK-II, Laneige, Innisfree, Beauty of Joseon, etc.
   - Chaque produit doit être CHOISI SPÉCIFIQUEMENT pour résoudre un problème détecté
   - ORDRE OBLIGATOIRE : Nettoyant → Tonique → Sérum/Traitement → Crème → SPF (si crème n'a pas de SPF)
   - ⚠️ IMPORTANT SPF : 
     * Si la crème hydratante recommandée a un SPF intégré → pas besoin de SPF séparé
     * Si la crème hydratante recommandée N'A PAS de SPF → OBLIGATOIRE d'inclure un SPF séparé à la fin
     * Le SPF doit TOUJOURS être le dernier produit de la routine du jour
   - Chaque "description" doit être UNE PHRASE COMPLÈTE ET DÉTAILLÉE (2-3 phrases) expliquant :
     * Pourquoi ce produit est choisi pour CETTE personne
     * Comment il résout les problèmes spécifiques détectés
     * Comment l'utiliser correctement
   - Inclure le nom du produit dans la description
   - Exemple si acné détectée : "Pour traiter l'acné détectée sur votre visage, utilisez le Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant, un exfoliant à base d'acide salicylique qui pénètre profondément dans les pores pour éliminer l'excès de sébum et réduire l'inflammation des boutons."
6. "nightRoutine" : Routine de nuit avec produits RÉELS VRAIMENT EFFICACES
   - Même format : produits vraiment adaptés aux problèmes, descriptions complètes
   - Inclure des produits de traitement (acides, rétinol, etc.) pour la nuit
7. ⚠️ RÈGLES OBLIGATOIRES POUR LES PRODUITS - VRAIMENT ADAPTÉS AUX PROBLÈMES :
   ⚠️ CRITIQUE : Chaque produit doit être choisi SPÉCIFIQUEMENT pour résoudre les problèmes détectés chez CETTE personne!
   
   - Si acné détectée → produits avec acide salicylique (Paula's Choice BHA, COSRX BHA), niacinamide (The Ordinary, Beauty of Joseon), rétinol (CeraVe, La Roche-Posay)
   - Si pores dilatés → produits avec BHA (Paula's Choice, COSRX), niacinamide, argile (Innisfree, L'Oréal)
   - Si taches/pigmentation → produits avec acide glycolique (The Ordinary, Pixi), vitamine C (The Ordinary, La Roche-Posay), niacinamide, tranexamic acid (The Inkey List)
   - Si peau sèche → produits avec acide hyaluronique (The Ordinary, Vichy), céramides (CeraVe), huiles (The Ordinary, Drunk Elephant)
   - Si peau grasse → produits matifiants (La Roche-Posay Effaclar, COSRX), non comédogènes, gel textures
   - Si rides → produits avec rétinol (CeraVe, La Roche-Posay), peptides (The Ordinary, Drunk Elephant), acides
   - Si rougeurs/irritations → produits apaisants (La Roche-Posay Toleriane, Avene, COSRX Snail)
   - Si texture irrégulière → produits exfoliants (acides AHA/BHA), niacinamide
   
   ⚠️ INCLURE TOUS LES TYPES DE SKINCARE :
   - Coréen (K-beauty) : COSRX, Beauty of Joseon, Laneige, Innisfree, SK-II, Dr. Jart+, Klairs
   - Français : La Roche-Posay, Vichy, Bioderma, Avene, L'Oréal
   - Américain : CeraVe, The Ordinary, Paula's Choice, Drunk Elephant, EltaMD
   - Autres : The Inkey List, Pixi, Glossier
   
   ⚠️ Choisis les MEILLEURS produits RÉELLEMENT EFFICACES pour CHAQUE problème spécifique de CETTE personne!
   ⚠️ Personnalise VRAIMENT la routine - ne donne pas une routine générique!

RÈGLES STRICTES - OBLIGATOIRE :

1. "defauts" (PROBLÈMES SEULEMENT - PAS DE SOLUTIONS) - RÈGLES PAR SCORE :
   
   ⚠️⚠️⚠️ IMPORTANT : Les "defauts" doivent contenir UNIQUEMENT le PROBLÈME détecté, PAS la solution! ⚠️⚠️⚠️
   - Les solutions seront dans la section "Votre Routine Quotidienne" - ne les mets PAS ici!
   - Exemple MAUVAIS : "Votre nez est large. Utiliser des techniques de contouring avec du maquillage mat pour créer une illusion de finesse"
   - Exemple BON : "Votre nez est large et pourrait être affiné visuellement"
   - Exemple MAUVAIS : "Vos sourcils sont asymétriques. Utiliser un crayon à sourcils pour redessiner et harmoniser leur forme"
   - Exemple BON : "Vos sourcils sont asymétriques"
   
   ⚠️ SI SCORE 80+ (EXCEPTIONNEL) :
   - Liste SEULEMENT 1-2 problèmes LÉGERS (si présents)
   - Exemple : "Essayez d'expérimenter avec différents styles de cheveux pour varier votre apparence"
   - Sois gentil et positif - ils sont déjà exceptionnels!
   
   ⚠️ SI SCORE < 80 (MOYEN OU MOCHE) :
   - Liste TOUS les problèmes SPÉCIFIQUES de la PEAU UNIQUEMENT basés sur les PROBLÈMES RÉELS détectés
   - Liste AU MOINS 5-10 problèmes de PEAU (acné, pores, taches, texture, sécheresse, rougeurs, etc.)
   - ⚠️⚠️⚠️ INTERDIT : Ne liste JAMAIS les problèmes qui ne sont PAS de la peau (sourcils, cheveux, yeux, nez, bouche, mâchoire, symétrie)
   - Si plus de problèmes de PEAU sont détectés, liste-les TOUS sans exception
   - SOIS HONNÊTE ET DIRECT - liste tous les problèmes de PEAU pour qu'ils puissent s'améliorer
   - ⚠️⚠️⚠️ CRITIQUE : Liste UNIQUEMENT les problèmes de peau détectés, PAS les solutions!
   - ✅ REQUIS : Pour chaque problème de peau détecté, décris-le simplement :
     * Si tu détectes de l'acné → "Acné visible sur le visage"
     * Si tu détectes des points noirs → "Points noirs présents"
     * Si tu détectes des taches/pigmentation → "Taches de pigmentation visibles"
     * Si tu détectes des cicatrices → "Cicatrices visibles"
     * Si tu détectes des rides → "Rides et ridules présentes"
     * Si tu détectes une texture irrégulière → "Texture de la peau irrégulière"
     * Si tu détectes des pores dilatés → "Pores dilatés visibles"
     * Si tu détectes une peau sèche → "Peau sèche et déshydratée"
     * Si tu détectes des rougeurs → "Rougeurs et irritations visibles"
   - ⚠️ INTERDIT : Ne mentionne JAMAIS les solutions dans cette section!
   - ⚠️ INTERDIT : Conseils génériques comme "améliorer la peau" - mentionne TOUJOURS le problème spécifique détecté!
   - Sois DIRECT et HONNÊTE - liste les vrais problèmes de peau de CETTE personne
   - **⚠️⚠️⚠️ INTERDICTION ABSOLUE : JAMAIS de procédures chirurgicales! ⚠️⚠️⚠️**
   - **PAS de rhinoplastie, PAS de chirurgie esthétique, PAS de botox, PAS d'injections, PAS de procédures médicales invasives**
   - **⚠️⚠️⚠️ INTERDICTION ABSOLUE : JAMAIS de maquillage, contouring, crayon à sourcils, eye-liner, correcteur, ou tout type de maquillage! ⚠️⚠️⚠️**
   - **Ne JAMAIS mentionner de maquillage dans les problèmes ou solutions**
   - Ne JAMAIS retourner [] (tableau vide)
   - Sois précis, honnête et ULTRA-SPÉCIFIQUE à cette personne

2. "qualites" : TOUJOURS une liste de 2-4 points forts CONCRETS et SPÉCIFIQUES sur la peau
   - Exemples : "Peau lisse et uniforme", "Texture régulière", "Bon éclat naturel", "Peau bien hydratée", "Peau sans imperfections majeures"
   - Ne JAMAIS retourner [] (tableau vide)
   - Sois précis et honnête sur les qualités de la peau

3. Si la peau est exceptionnelle (score 80+) → focus sur les qualités, mais liste aussi 1-2 problèmes légers si présents
4. Si la peau est en dessous de la moyenne (score < 50) → focus sur les défauts avec AU MOINS 3 problèmes honnêtes, mais liste aussi 1-2 qualités si présentes

CRITIQUE : 
- Les champs defauts et qualites sont OBLIGATOIRES
- Score 80+ : defauts = 1-2 conseils légers MAXIMUM
- Score < 80 : defauts = AU MOINS 5 conseils honnêtes (pas de chirurgie!)
`
      }
      return prompts[lang]
    }

    const prompt = getPrompt(language as 'fr')

    let text: string
    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: 'image/jpeg'
          }
        }
      ])

      const response = await result.response
      text = response.text()
      
      // Check if response is too short (likely just a score)
      if (text.length < 100) {
        console.warn('WARNING: Response is suspiciously short - Gemini may be ignoring the prompt!')
      }
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError)
      const errorMessage = geminiError instanceof Error ? geminiError.message : 'Unknown error occurred'
      return NextResponse.json({ error: `Gemini API Error: ${errorMessage}` }, { status: 500 })
    }

    // Try to parse JSON response
    try {
      // First try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1])
          
          const score = Math.max(1, Math.min(100, parsed.score || 50))
          const verdict = getCritiqueMessage(score, language as 'fr')
          
          // Handle French field names (defauts, qualites, analyse) or fallback to English
          let improvements = parsed.defauts || parsed.improvements || []
          let strengths = parsed.qualites || parsed.strengths || []
          const critique = parsed.analyse || parsed.critique || ''
          
          // Validation et fallback si les données sont vides
          if (!Array.isArray(improvements) || improvements.length === 0) {
            console.warn('API: defauts/improvements is empty or not an array, using fallback')
            improvements = ['Analyse détaillée des défauts non disponible']
          }
          
          // Validation : Si score < 80, il doit y avoir au moins 5 conseils
          if (score < 80 && improvements.length < 5) {
            console.warn(`API: Score ${score} < 80 but only ${improvements.length} improvements provided. Expected at least 5.`)
            // On garde ce qui a été fourni, mais on log un avertissement
          }
          
          // Validation : Si score >= 80, il ne devrait pas y avoir plus de 2 conseils
          if (score >= 80 && improvements.length > 2) {
            console.warn(`API: Score ${score} >= 80 but ${improvements.length} improvements provided. Expected max 2 light suggestions.`)
            // On garde ce qui a été fourni, mais on log un avertissement
          }
          if (!Array.isArray(strengths) || strengths.length === 0) {
            console.warn('API: qualites/strengths is empty or not an array, using fallback')
            strengths = ['Analyse détaillée des qualités non disponible']
          }
          
          // Analyser la peau - utiliser le score global comme score de peau
          const skinScore = Math.max(0, Math.min(100, parsed.skinScore || parsed.peau || score || 0))
          
          // Scores détaillés de peau depuis l'API ou calculés
          const categoryScores = {
            cheveux: 0,
            yeux: 0,
            nez: 0,
            bouche: 0,
            machoire: 0,
            peau: skinScore,
            symetrie: 0,
            potentiel: 0,
        // Scores détaillés de peau - tous positifs (plus haut = mieux) - JAMAIS 0
        texture: Math.max(1, Math.min(100, parsed.texture || skinScore || 50)),
        uniformite: Math.max(1, Math.min(100, parsed.uniformite || skinScore || 50)),
        hydratation: Math.max(1, Math.min(100, parsed.hydratation || skinScore || 50)),
        eclat: Math.max(1, Math.min(100, parsed.eclat || skinScore || 50)),
        finessePores: Math.max(1, Math.min(100, parsed.finessePores || parsed.finessePoresInverse ? Math.max(1, 100 - parsed.finessePoresInverse) : (skinScore || 50))), // Finesse des pores (plus haut = pores moins visibles)
        fermete: Math.max(1, Math.min(100, parsed.fermete || parsed.ridesInverse ? Math.max(1, 100 - parsed.ridesInverse) : (skinScore || 50))), // Fermeté (plus haut = moins de rides)
        clarte: Math.max(1, Math.min(100, parsed.clarte || parsed.imperfectionsInverse ? Math.max(1, 100 - parsed.imperfectionsInverse) : (skinScore || 50))), // Clarté (plus haut = moins d'imperfections)
        elasticite: Math.max(1, Math.min(100, parsed.elasticite || skinScore || 50))
          }
          
          // Détection de secours : si score est 50, considérer qu'aucun visage n'a été détecté
          const noFaceDetected = parsed.noFaceDetected === true || score === 50
          
          return NextResponse.json({
            score: skinScore, // Utiliser le score de peau comme score principal
            verdict: verdict,
            improvements: improvements, // Utiliser la variable déjà validée avec fallback
            strengths: strengths, // Utiliser la variable déjà validée avec fallback
            critique: critique,
            categoryScores: categoryScores,
            noFaceDetected: noFaceDetected,
            skinScore: skinScore, // Score de peau séparé
            // Nouveaux champs pour le PDF
            skinType: parsed.skinType || 'Peau mixte',
            skinSummary: parsed.skinSummary || parsed.analyse || critique,
            allProblems: parsed.allProblems || improvements,
            dayRoutine: parsed.dayRoutine || [],
            nightRoutine: parsed.nightRoutine || []
          })
        }
      
      // Try to parse the text directly
      let parsed = JSON.parse(text)
      
      const score = Math.max(1, Math.min(100, parsed.score || 50))
      const verdict = getCritiqueMessage(score, language as 'fr')
      
      // Handle French field names (defauts, qualites, analyse) or fallback to English
      let improvements = parsed.defauts || parsed.improvements || []
      let strengths = parsed.qualites || parsed.strengths || []
      const critique = parsed.analyse || parsed.critique || ''
      
      // Validation et fallback si les données sont vides
      if (!Array.isArray(improvements) || improvements.length === 0) {
        console.warn('API: defauts/improvements is empty or not an array, using fallback')
        improvements = ['Analyse détaillée des défauts non disponible']
      }
      
      // Validation : Si score < 80, il doit y avoir au moins 5 conseils
      if (score < 80 && improvements.length < 5) {
        console.warn(`API: Score ${score} < 80 but only ${improvements.length} improvements provided. Expected at least 5.`)
        // On garde ce qui a été fourni, mais on log un avertissement
      }
      
      // Validation : Si score >= 80, il ne devrait pas y avoir plus de 2 conseils
      if (score >= 80 && improvements.length > 2) {
        console.warn(`API: Score ${score} >= 80 but ${improvements.length} improvements provided. Expected max 2 light suggestions.`)
        // On garde ce qui a été fourni, mais on log un avertissement
      }
      if (!Array.isArray(strengths) || strengths.length === 0) {
        console.warn('API: qualites/strengths is empty or not an array, using fallback')
        strengths = ['Analyse détaillée des qualités non disponible']
      }
      
      // Analyser la peau - utiliser le score global comme score de peau
      const skinScore = Math.max(0, Math.min(100, parsed.skinScore || parsed.peau || score || 0))
      
      // Scores détaillés de peau depuis l'API ou calculés
      const categoryScores = {
        cheveux: 0,
        yeux: 0,
        nez: 0,
        bouche: 0,
        machoire: 0,
        peau: skinScore,
        symetrie: 0,
        potentiel: 0,
        // Scores détaillés de peau - tous positifs (plus haut = mieux) - JAMAIS 0
        texture: Math.max(1, Math.min(100, parsed.texture || skinScore || 50)),
        uniformite: Math.max(1, Math.min(100, parsed.uniformite || skinScore || 50)),
        hydratation: Math.max(1, Math.min(100, parsed.hydratation || skinScore || 50)),
        eclat: Math.max(1, Math.min(100, parsed.eclat || skinScore || 50)),
        finessePores: Math.max(1, Math.min(100, parsed.finessePores || parsed.finessePoresInverse ? Math.max(1, 100 - parsed.finessePoresInverse) : (skinScore || 50))), // Finesse des pores (plus haut = pores moins visibles)
        fermete: Math.max(1, Math.min(100, parsed.fermete || parsed.ridesInverse ? Math.max(1, 100 - parsed.ridesInverse) : (skinScore || 50))), // Fermeté (plus haut = moins de rides)
        clarte: Math.max(1, Math.min(100, parsed.clarte || parsed.imperfectionsInverse ? Math.max(1, 100 - parsed.imperfectionsInverse) : (skinScore || 50))), // Clarté (plus haut = moins d'imperfections)
        elasticite: Math.max(1, Math.min(100, parsed.elasticite || skinScore || 50))
      }
      
      // Détection de secours : si score est 50, considérer qu'aucun visage n'a été détecté
      const noFaceDetected = parsed.noFaceDetected === true || score === 50
      
      return NextResponse.json({
        score: skinScore, // Utiliser le score de peau comme score principal
        verdict: verdict,
        improvements: improvements, // Utiliser la variable déjà validée avec fallback
        strengths: strengths, // Utiliser la variable déjà validée avec fallback
        critique: critique,
        categoryScores: categoryScores,
        noFaceDetected: noFaceDetected,
        skinScore: skinScore, // Score de peau séparé
        // Nouveaux champs pour le PDF
        skinType: parsed.skinType || 'Peau mixte',
        skinSummary: parsed.skinSummary || parsed.analyse || critique,
        allProblems: parsed.allProblems || improvements,
        dayRoutine: parsed.dayRoutine || [],
        nightRoutine: parsed.nightRoutine || []
      })
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw text:', text)
      
      // Final fallback avec données par défaut
      return NextResponse.json({
        score: 50,
        verdict: getCritiqueMessage(50, language as 'fr'),
        improvements: ['Analyse détaillée non disponible'],
        strengths: ['Analyse détaillée non disponible'],
        critique: '',
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
        skinScore: 0
      })
    }
  } catch (error) {
    console.error('Error generating critique:', error)
    return NextResponse.json({ error: 'Failed to generate critique' }, { status: 500 })
  }
}
