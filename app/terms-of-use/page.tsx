import React from 'react'
import Link from 'next/link'

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8 px-2">Conditions d'Utilisation</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <p className="text-sm text-gray-500 mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">1. Acceptation des conditions</h2>
              <p>
                En accédant et en utilisant pasmoche.com (le « Site web »), vous acceptez et convenez d'être lié par 
                les termes et dispositions de cet accord. Si vous n'acceptez pas de respecter ce qui précède, veuillez ne pas utiliser ce service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">2. Description du service</h2>
              <p>
                pasmoche.com fournit une analyse honnête et détaillée de votre apparence. 
                Le service permet aux utilisateurs de télécharger des photos pour analyse et de recevoir des critiques détaillées 
                sur leur apparence.
              </p>
              <p className="mt-3">
                <strong className="text-black">Important :</strong> Les photos que vous téléchargez ne sont pas stockées sur nos serveurs. 
                Elles sont traitées uniquement pour générer votre critique et sont supprimées immédiatement après le traitement. 
                Nous ne conservons aucune copie de vos photos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">3. Compte utilisateur</h2>
              <p>Pour utiliser certaines fonctionnalités du Site web, vous pouvez être tenu de :</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Créer un compte avec des informations exactes et complètes</li>
                <li>Maintenir et mettre à jour les informations de votre compte</li>
                <li>Maintenir la sécurité de vos identifiants de compte</li>
                <li>Accepter la responsabilité de toutes les activités qui se produisent sous votre compte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">4. Conduite de l'utilisateur</h2>
              <p>Vous acceptez de ne pas :</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Utiliser le service à des fins illégales ou en violation de toute loi</li>
                <li>Télécharger du contenu offensant, nuisible ou violant les droits d'autrui</li>
                <li>Tenter d'obtenir un accès non autorisé au Site web ou à ses systèmes associés</li>
                <li>Interférer avec ou perturber le Site web ou les serveurs connectés au Site web</li>
                <li>Reproduire, dupliquer, copier, vendre ou exploiter toute partie du service sans autorisation écrite expresse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">5. Propriété intellectuelle</h2>
              <p>
                Tout le contenu du Site web, y compris mais sans s'y limiter, les textes, graphiques, logos, images, 
                clips audio, téléchargements numériques et logiciels, est la propriété de pasmoche.com ou de 
                ses fournisseurs de contenu et est protégé par les lois internationales sur le droit d'auteur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">6. Conditions de paiement</h2>
              <p>
                Si vous achetez des crédits ou des services via le Site web, vous acceptez de payer tous les frais 
                associés à votre achat. Tous les prix sont dans la devise spécifiée sur le Site web et peuvent être modifiés sans préavis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">7. Avertissement concernant les garanties</h2>
              <p>
                Le Site web et ses services sont fournis « en l'état » et « tels quels » sans garanties d'aucune sorte, 
                expresse ou implicite. Nous ne garantissons pas que le service sera ininterrompu, sécurisé ou sans erreur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">8. Limitation de responsabilité</h2>
              <p>
                Dans toute la mesure permise par la loi, pasmoche.com ne sera pas responsable de tout dommage indirect, 
                accessoire, spécial, consécutif ou punitif, ou de toute perte de profits ou de revenus, qu'elle soit subie 
                directement ou indirectement, ou de toute perte de données, d'utilisation, de goodwill ou d'autres pertes intangibles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">9. Indemnisation</h2>
              <p>
                Vous acceptez d'indemniser et de dégager de toute responsabilité pasmoche.com, son propriétaire, ses employés, 
                et ses agents de toute réclamation, dommage, perte, responsabilité et dépense (y compris les frais juridiques) 
                découlant ou liés à votre utilisation du Site web ou à la violation de ces Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">10. Résiliation</h2>
              <p>
                Nous nous réservons le droit de résilier ou de suspendre votre compte et l'accès au service immédiatement, 
                sans préavis ni responsabilité, pour quelque raison que ce soit, y compris si vous violez les Conditions d'Utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">11. Loi applicable</h2>
              <p>
                Ces Conditions d'Utilisation sont régies par et interprétées conformément aux lois de la France, 
                sans égard à ses dispositions relatives aux conflits de lois.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">12. Modifications des conditions</h2>
              <p>
                Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Nous informerons les utilisateurs 
                de toute modification en publiant les nouvelles Conditions d'Utilisation sur cette page et en mettant à jour la date 
                « Dernière mise à jour ». Votre utilisation continue du service après toute modification constitue l'acceptation des nouvelles Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">13. Informations de contact</h2>
              <div className="space-y-2">
                <p><strong className="text-black">Site web :</strong> pasmoche.com</p>
              </div>
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

