import React from 'react'
import Link from 'next/link'

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8 px-2">Mentions Légales</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Informations sur l'entreprise</h2>
              <div className="space-y-2">
                <p><strong className="text-black">Site web :</strong> pasmoche.com</p>
                <p><strong className="text-black">Hébergement :</strong> Vercel Inc.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">Directeur de publication</h2>
              <p>Le directeur de publication est le propriétaire du site web pasmoche.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">Hébergeur</h2>
              <p>
                Ce site web est hébergé par Vercel Inc. Pour toute question concernant l'hébergement, 
                veuillez contacter directement Vercel Inc.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">Propriété intellectuelle</h2>
              <p>
                Tout le contenu de ce site web, y compris mais sans s'y limiter, les textes, graphiques, logos, 
                images et logiciels, est la propriété de pasmoche.com ou de ses fournisseurs de contenu 
                et est protégé par les lois internationales sur le droit d'auteur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">Contact</h2>
              <p>
                Pour toute question concernant ces mentions légales, veuillez nous contacter via notre site web.
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

