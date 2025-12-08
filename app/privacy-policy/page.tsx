import React from 'react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8 px-2">Politique de Confidentialité</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <p className="text-sm text-gray-500 mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">1. Introduction</h2>
              <p>
                Cette Politique de Confidentialité décrit comment pasmoche.com (« nous », « notre » ou « nos ») collecte, 
                utilise et protège vos informations personnelles lorsque vous utilisez notre site web et nos services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">2. Responsable du traitement des données</h2>
              <div className="space-y-2">
                <p><strong className="text-white">Site web :</strong> pasmoche.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">3. Données collectées</h2>
              <p>Nous collectons les types de données suivants :</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li><strong className="text-black">Adresse email :</strong> Uniquement si vous la soumettez volontairement lors de la création d'un compte ou en nous contactant</li>
                <li><strong className="text-black">Données d'analyse :</strong> Nous utilisons des outils d'analyse pour comprendre comment les visiteurs interagissent avec notre site web, y compris les pages vues, le temps passé sur les pages et les modèles de navigation</li>
              </ul>
              <p className="mt-4">
                <strong className="text-black">Important :</strong> Les photos que vous téléchargez pour analyse ne sont pas stockées sur nos serveurs. 
                Elles sont traitées uniquement pour générer votre critique et sont ensuite supprimées immédiatement après le traitement. 
                Nous ne conservons aucune copie de vos photos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">4. Utilisation de vos données</h2>
              <p>Nous utilisons les données collectées aux fins suivantes :</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Pour fournir et améliorer nos services</li>
                <li>Pour communiquer avec vous concernant votre compte ou vos demandes</li>
                <li>Pour analyser l'utilisation du site web et améliorer l'expérience utilisateur</li>
                <li>Pour respecter les obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">5. Stockage et sécurité des données</h2>
              <p>
                Vos données sont stockées en toute sécurité sur des serveurs fournis par notre hébergeur, Vercel Inc. 
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations 
                personnelles contre l'accès non autorisé, l'altération, la divulgation ou la destruction.
              </p>
              <p className="mt-3">
                <strong className="text-black">Photos :</strong> Comme mentionné précédemment, les photos que vous téléchargez ne sont pas stockées. 
                Elles sont traitées de manière temporaire uniquement pour générer votre analyse et sont automatiquement supprimées 
                après le traitement, sans être conservées sur nos serveurs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">6. Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles uniquement aussi longtemps que nécessaire pour remplir les objectifs 
                décrits dans cette Politique de Confidentialité, sauf si une période de conservation plus longue est requise par la loi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">7. Vos droits</h2>
              <p>Conformément aux lois applicables sur la protection des données, vous avez le droit de :</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier les données inexactes</li>
                <li>Demander la suppression de vos données</li>
                <li>Vous opposer au traitement de vos données</li>
                <li>Demander la portabilité de vos données</li>
                <li>Retirer votre consentement à tout moment</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, veuillez nous contacter via notre site web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">8. Cookies et technologies de suivi</h2>
              <p>
                Nous utilisons des cookies et des technologies de suivi similaires pour suivre l'activité sur notre site web 
                et conserver certaines informations. Vous pouvez demander à votre navigateur de refuser tous les cookies 
                ou d'indiquer quand un cookie est envoyé.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">9. Services tiers</h2>
              <p>
                Notre site web peut contenir des liens vers des sites web tiers. Nous ne sommes pas responsables des 
                pratiques de confidentialité de ces sites externes. Nous vous encourageons à consulter leurs 
                politiques de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">10. Modifications de cette Politique de Confidentialité</h2>
              <p>
                Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous informerons de toute 
                modification en publiant la nouvelle Politique de Confidentialité sur cette page et en mettant à jour la date 
                « Dernière mise à jour » en haut de ce document.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">11. Nous contacter</h2>
              <p>
                Si vous avez des questions concernant cette Politique de Confidentialité, veuillez nous contacter via notre site web.
              </p>
            </section>

            <div className="pt-6 border-t border-gray-200">
              <Link 
                href="/" 
                className="text-primary-blue hover:text-primary-blue/80 active:text-primary-blue/70 underline min-h-[44px] inline-flex items-center touch-manipulation"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

