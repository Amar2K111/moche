'use client'

import React, { createContext, useContext, useState } from 'react'

type Language = 'en' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation keys for all pages
const translations = {
  en: {
    // Sign In page
    'signin.title': 'Sign in to analyze your skin.',
    'signin.subtitle': 'Get your complete skin analysis and personalized routine.',
    'signin.email_label': 'Email',
    'signin.email_placeholder': 'your@email.com',
    'signin.password_label': 'Password',
    'signin.password_placeholder': '••••••••',
    'signin.submit_button': 'Sign In',
    'signin.submitting': 'Signing in...',
    'signin.divider': 'Or continue with',
    'signin.google_button': 'Sign in with Google',
    'signin.google_loading': 'Signing in...',
    'signin.no_account': 'Don\'t have an account?',
    'signin.signup_link': 'Sign up',
    'signin.tagline': 'Complete skin analysis',
    'signin.error_user_not_found': 'No account found with this email',
    'signin.error_wrong_password': 'Incorrect password',
    'signin.error_invalid_email': 'Invalid email address',
    'signin.error_google_failed': 'Google sign-in failed. Please try again.',
    'signin.error_general': 'An error occurred. Please try again.',
    
    // Sign Up page
    'signup.title': 'Complete skin analysis.',
    'signup.subtitle': 'Create your account to get your personalized skincare routine.',
    'signup.email_label': 'Email',
    'signup.email_placeholder': 'your@email.com',
    'signup.password_label': 'Password',
    'signup.password_placeholder': '••••••••',
    'signup.confirm_password_label': 'Confirm password',
    'signup.confirm_password_placeholder': '••••••••',
    'signup.submit_button': 'Create account',
    'signup.submitting': 'Creating account...',
    'signup.divider': 'Or continue with',
    'signup.google_button': 'Sign up with Google',
    'signup.google_loading': 'Creating account...',
    'signup.have_account': 'Already have an account?',
    'signup.signin_link': 'Sign in',
    'signup.error_password_mismatch': 'Passwords do not match',
    'signup.error_password_too_short': 'Password must be at least 6 characters',
    'signup.error_email_in_use': 'An account with this email already exists',
    'signup.error_invalid_email': 'Invalid email address',
    'signup.error_weak_password': 'Password is too weak',
    'signup.error_google_failed': 'Google sign-up failed. Please try again.',
    'signup.error_general': 'An error occurred. Please try again.',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.getCredits': 'Get Credits',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    
    // Profile dropdown
    'profile.dashboard': 'Dashboard',
    'profile.gallery': 'Gallery', 
    'profile.profile': 'Profile',
    'profile.settings': 'Settings',
    'profile.logout': 'Logout',
    
    // Gallery page
    'gallery.title': 'Your Gallery',
    'gallery.subtitle': 'View and manage your face rating portfolio',
    'gallery.loading': 'Loading Your Gallery...',
    'gallery.loading_subtitle': 'Getting your face critiques',
    'gallery.error': 'Error Loading Gallery',
    'gallery.try_again': '🔄 Try Again',
    'gallery.no_photos': 'No Photos Yet',
    'gallery.no_photos_subtitle': 'Start building your face rating portfolio',
    'gallery.upload_first': '🚀 Upload First Photo',
    
    // Profile page
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your account settings and view your upload history',
    'profile.back_dashboard': '← Back to Dashboard',
    'profile.view_gallery': 'View Gallery',
    'profile.account_info': 'Account Information',
    'profile.edit_profile': 'Edit Profile',
    'profile.display_name': 'Display Name',
    'profile.email': 'Email',
    'profile.account_type': 'Account Type',
    'profile.google_account': 'Google Account',
    'profile.email_password': 'Email & Password',
    'profile.not_set': 'Not set',
    'profile.saving': 'Saving...',
    'profile.save_changes': 'Save Changes',
    'profile.cancel': 'Cancel',
    'profile.upload_credits': 'Upload Credits',
    'profile.refresh': '🔄 Refresh',
    'profile.uploads_remaining': 'Uploads Remaining',
    'profile.uploads_remaining_subtitle': 'Number of face critiques you can still generate',
    'profile.total_uploads': 'Total Uploads',
    'profile.total_uploads_subtitle': 'Total number of face critiques you have generated',
    'profile.danger_zone': 'Danger Zone',
    'profile.delete_account': 'Delete Account',
    'profile.delete_account_subtitle': 'Permanently delete your account and all data',
    'profile.delete': 'Delete',
    'profile.sign_out': 'Sign Out',
    'profile.sign_out_subtitle': 'Sign out of your account on this device',
    'profile.displayNamePlaceholder': 'Enter your display name',
    'profile.emailPlaceholder': 'Enter your email',
    'profile.error_empty_name': 'Display name cannot be empty',
    'profile.error_name_too_long': 'Display name cannot exceed 50 characters',
    'profile.error_invalid_chars': 'Display name contains invalid characters',
    'profile.no_changes': 'No changes to save',
    'profile.update_success': 'Profile updated successfully!',
    'profile.update_error': 'Failed to update profile. Please try again.',
    
    // Credit counter
    'credit_counter.credits_left': 'Credits Left: {{credits}}',
    'credit_counter.credits_left_zero': 'Credits Left: 0',
    'credit_counter.ready_for_roast': 'Ready for your next hand roast!',
    'credit_counter.unlock_critiques': 'Unlock 50 critiques to continue',
    
    // Credit messages
    'credits.no_credits_remaining': 'No credits remaining! Redirecting to offer page.',
    'credits.no_credits_purchase': 'No credits remaining. Please purchase more credits to continue.',
    'credits.failed_verify': 'Failed to verify credits. Please try again.',
    
    // Offer page
    'offer.title': 'Discover your true potential',
    'offer.subtitle': 'Get an honest and detailed analysis of your appearance',
    'offer.limited_time': 'Limited Time:',
    'offer.critiques_for_price': '{{amount}} complete analyses for just €{{price}}',
    'offer.no_credits_warning': 'No Credits Remaining',
    'offer.no_credits_message': 'You need to purchase credits to get more face ratings',
    'offer.back_button': 'Back',
    'offer.one_time_payment': 'One-time payment',
    'offer.get_critiques': 'Get {{amount}} face critiques',
    'offer.what_you_get': 'What You Get',
    'offer.benefit_truth': 'Discover the truth about your appearance',
    'offer.benefit_improve': 'Improve your appearance with precise advice',
    'offer.benefit_confidence': 'Gain confidence by knowing your strengths',
    'offer.benefit_professional': 'Professional analysis based on global standards',
    'offer.benefit_forever': 'Lifetime access - view your results anytime',
    'offer.benefit_pdf': 'Personalized PDF guide to transform your appearance',
    'offer.results_title': 'Concrete results',
    'offer.results_desc': 'Discover exactly what works and what can be improved',
    'offer.trust_title': '100% secure and confidential',
    'offer.trust_secure': 'Secure payment via Stripe',
    'offer.trust_private': 'Your photos are never stored',
    'offer.trust_guarantee': 'Satisfied or refunded within 7 days',
    'offer.feature_brutal_honesty': 'Brutal honesty - no sugarcoating',
    'offer.feature_score_100': 'Score out of 100 with global standards',
    'offer.feature_ai_analysis': 'Expert AI analysis & feedback',
    'offer.feature_improvement_tips': 'Improvement tips & styling advice',
    'offer.feature_final_verdict': 'Final verdict & assessment',
    'offer.feature_access_forever': 'Access forever - no expiration',
    'offer.feature_pdf_improvement': 'PDF with exact tips on how to improve your appearance',
    'offer.processing': 'Processing...',
    'offer.get_critiques_now': 'Get {{amount}} Critiques Now',
    'offer.example_score_low': 'Example score: 35/100',
    'offer.example_score_high': 'Example score: 85/100',
    'offer.face_rating_example_brutal': 'Face rating example - brutally honest feedback',
    'offer.face_rating_example_expert': 'Face rating example - expert analysis',
    'offer.sign_in_to_purchase': 'Please sign in to purchase credits.',
    'offer.payment_failed': 'Payment failed. Please try again.',
    'offer.loading': 'Loading...',
    
    // Settings modal
    'settings.title': 'Settings',
    'settings.account_settings': 'Account Settings',
    'settings.notifications': 'Notifications',
    'settings.email_updates': 'Email Updates',
    'settings.done': 'Done',
    
    // App constants
    'app.name': 'Are You Chopped',
    'app.description': 'Find out how chopped you are! Get brutally honest AI ratings 👀',
    
    // Home page hero section
    'home.hero.title': 'Discover Your Estimated Beauty Score',
    'home.hero.description': 'Upload your photos to receive a score out of 100 and personalized friendly tips to improve your appearance.',
    'home.hero.cta': 'Discover Your Score →',
    'home.loading': 'Loading...',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.copyright': '© {{year}} {{appName}}. All rights reserved.',
    'footer.legal_notice': 'Legal Notice',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.terms_of_use': 'Terms of Use',
    'footer.product': 'Product',
    'footer.dashboard': 'Dashboard',
    'footer.gallery': 'Gallery',
    'footer.profile': 'Profile',
    'footer.get_credits': 'Get Credits',
    'footer.support': 'Support',
    'footer.help_center': 'Help Center',
    'footer.contact_us': 'Contact Us',
    'footer.legal': 'Legal',
    'footer.resources': 'Resources',
    
    // Error messages
    'errors.generic': 'Something went wrong. Please try again.',
    'errors.failed_to_load': 'Unable to load your gallery. Please try again.',
    'errors.failed_to_refresh': 'Unable to refresh your gallery. Please try again.',
    'errors.permission_denied': 'You don\'t have permission to access this content.',
    'errors.network_error': 'Network connection issue. Please check your internet and try again.',
    'errors.timeout': 'The request took too long. Please try again.',
    'errors.not_found': 'The requested content was not found.',
    'errors.auth_required': 'Please sign in to access this content.',
    'errors.quota_exceeded': 'You\'ve reached your usage limit. Please try again later.'
  },
  fr: {
    // Sign In page
    'signin.title': 'Connectez-vous pour analyser votre peau.',
    'signin.subtitle': 'Obtenez votre analyse de peau complète et votre routine personnalisée.',
    'signin.email_label': 'Email',
    'signin.email_placeholder': 'votre@email.com',
    'signin.password_label': 'Mot de passe',
    'signin.password_placeholder': '••••••••',
    'signin.submit_button': 'Se connecter',
    'signin.submitting': 'Connexion...',
    'signin.divider': 'Ou continuer avec',
    'signin.google_button': 'Se connecter avec Google',
    'signin.google_loading': 'Connexion...',
    'signin.no_account': 'Vous n\'avez pas de compte ?',
    'signin.signup_link': 'S\'inscrire',
    'signin.tagline': 'Analyse complète de votre peau',
    'signin.error_user_not_found': 'Aucun compte trouvé avec cet email',
    'signin.error_wrong_password': 'Mot de passe incorrect',
    'signin.error_invalid_email': 'Adresse email invalide',
    'signin.error_google_failed': 'Connexion Google échouée. Veuillez réessayer.',
    'signin.error_general': 'Une erreur s\'est produite. Veuillez réessayer.',
    
    // Sign Up page
    'signup.title': 'Analyse complète de votre peau.',
    'signup.subtitle': 'Créez votre compte pour recevoir votre routine skincare personnalisée.',
    'signup.email_label': 'Email',
    'signup.email_placeholder': 'votre@email.com',
    'signup.password_label': 'Mot de passe',
    'signup.password_placeholder': '••••••••',
    'signup.confirm_password_label': 'Confirmer le mot de passe',
    'signup.confirm_password_placeholder': '••••••••',
    'signup.submit_button': 'Créer un compte',
    'signup.submitting': 'Création du compte...',
    'signup.divider': 'Ou continuer avec',
    'signup.google_button': 'S\'inscrire avec Google',
    'signup.google_loading': 'Création du compte...',
    'signup.have_account': 'Vous avez déjà un compte ?',
    'signup.signin_link': 'Se connecter',
    'signup.error_password_mismatch': 'Les mots de passe ne correspondent pas',
    'signup.error_password_too_short': 'Le mot de passe doit contenir au moins 6 caractères',
    'signup.error_email_in_use': 'Un compte avec cet email existe déjà',
    'signup.error_invalid_email': 'Adresse email invalide',
    'signup.error_weak_password': 'Le mot de passe est trop faible',
    'signup.error_google_failed': 'Inscription Google échouée. Veuillez réessayer.',
    'signup.error_general': 'Une erreur s\'est produite. Veuillez réessayer.',
    
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.getCredits': 'Obtenir des crédits',
    'nav.signIn': 'Se connecter',
    'nav.signUp': 'S\'inscrire',
    
    // Profile dropdown
    'profile.dashboard': 'Tableau de bord',
    'profile.gallery': 'Galerie',
    'profile.profile': 'Profil', 
    'profile.settings': 'Paramètres',
    'profile.logout': 'Déconnexion',
    
    // Gallery page
    'gallery.title': 'Votre Galerie',
    'gallery.subtitle': 'Consultez et gérez votre portfolio d\'évaluations faciales',
    'gallery.loading': 'Chargement de votre galerie...',
    'gallery.loading_subtitle': 'Récupération de vos critiques faciales',
    'gallery.error': 'Erreur lors du chargement de la galerie',
    'gallery.try_again': '🔄 Réessayer',
    'gallery.no_photos': 'Aucune photo pour le moment',
    'gallery.no_photos_subtitle': 'Commencez à construire votre portfolio d\'évaluations faciales',
    'gallery.upload_first': '🚀 Télécharger la première photo',
    
    // Profile page
    'profile.title': 'Profil',
    'profile.subtitle': 'Gérez les paramètres de votre compte et consultez votre historique de téléchargements',
    'profile.back_dashboard': '← Retour au tableau de bord',
    'profile.view_gallery': 'Voir la galerie',
    'profile.account_info': 'Informations du compte',
    'profile.edit_profile': 'Modifier le profil',
    'profile.display_name': 'Nom d\'affichage',
    'profile.email': 'Email',
    'profile.account_type': 'Type de compte',
    'profile.google_account': 'Compte Google',
    'profile.email_password': 'Email et mot de passe',
    'profile.not_set': 'Non défini',
    'profile.saving': 'Sauvegarde...',
    'profile.save_changes': 'Sauvegarder les modifications',
    'profile.cancel': 'Annuler',
    'profile.upload_credits': 'Crédits de téléchargement',
    'profile.refresh': '🔄 Actualiser',
    'profile.uploads_remaining': 'Téléchargements restants',
    'profile.uploads_remaining_subtitle': 'Nombre de critiques faciales que vous pouvez encore générer',
    'profile.total_uploads': 'Total des téléchargements',
    'profile.total_uploads_subtitle': 'Nombre total de critiques faciales que vous avez générées',
    'profile.danger_zone': 'Zone de danger',
    'profile.delete_account': 'Supprimer le compte',
    'profile.delete_account_subtitle': 'Supprimer définitivement votre compte et toutes les données',
    'profile.delete': 'Supprimer',
    'profile.sign_out': 'Se déconnecter',
    'profile.sign_out_subtitle': 'Se déconnecter de votre compte sur cet appareil',
    'profile.displayNamePlaceholder': 'Entrez votre nom d\'affichage',
    'profile.emailPlaceholder': 'Entrez votre email',
    'profile.error_empty_name': 'Le nom d\'affichage ne peut pas être vide',
    'profile.error_name_too_long': 'Le nom d\'affichage ne peut pas dépasser 50 caractères',
    'profile.error_invalid_chars': 'Le nom d\'affichage contient des caractères invalides',
    'profile.no_changes': 'Aucune modification à enregistrer',
    'profile.update_success': 'Profil mis à jour avec succès !',
    'profile.update_error': 'Échec de la mise à jour du profil. Veuillez réessayer.',
    
    // Credit counter
    'credit_counter.credits_left': 'Crédits restants : {{credits}}',
    'credit_counter.credits_left_zero': 'Crédits restants : 0',
    'credit_counter.ready_for_roast': 'Prêt pour votre prochaine critique !',
    'credit_counter.unlock_critiques': 'Débloquez 50 critiques pour continuer',
    
    // Credit messages
    'credits.no_credits_remaining': 'Aucun crédit restant ! Redirection vers la page d\'offres.',
    'credits.no_credits_purchase': 'Aucun crédit restant. Veuillez acheter plus de crédits pour continuer.',
    'credits.failed_verify': 'Échec de la vérification des crédits. Veuillez réessayer.',
    
    // Offer page
    'offer.title': 'Découvre le vrai potentiel de ta peau',
    'offer.subtitle': 'Obtenez une analyse honnête et détaillée de votre peau',
    'offer.limited_time': 'Offre limitée :',
    'offer.critiques_for_price': '{{amount}} analyses complètes pour seulement €{{price}}',
    'offer.no_credits_warning': 'Aucun crédit restant',
    'offer.no_credits_message': 'Vous devez acheter des crédits pour obtenir plus d\'analyses de peau',
    'offer.back_button': 'Retour',
    'offer.one_time_payment': 'Paiement unique',
    'offer.get_critiques': 'Obtenez {{amount}} analyses de peau',
    'offer.what_you_get': 'Ce que vous obtenez',
    'offer.benefit_truth': 'Découvrez la vérité sur l\'état de votre peau',
    'offer.benefit_improve': 'Améliorez votre peau avec une routine personnalisée',
    'offer.benefit_confidence': 'Gagnez en confiance en connaissant les points forts de votre peau',
    'offer.benefit_professional': 'Analyse professionnelle de la peau basée sur les standards mondiaux',
    'offer.benefit_forever': 'Accès à vie - consultez vos résultats quand vous voulez',
    'offer.benefit_pdf': 'Guide PDF personnalisé avec routine skincare pour transformer votre peau',
    'offer.results_title': 'Résultats concrets',
    'offer.results_desc': 'Découvrez exactement ce qui fonctionne et ce qui peut être amélioré pour votre peau',
    'offer.trust_title': '100% sécurisé et confidentiel',
    'offer.trust_secure': 'Paiement sécurisé via Stripe',
    'offer.trust_private': 'Vos photos ne sont jamais stockées',
    'offer.trust_guarantee': 'Satisfait ou remboursé sous 7 jours',
    'offer.feature_brutal_honesty': 'Brutalement honnête sur l\'état de ta peau',
    'offer.feature_score_100': 'Score peau sur 100 selon les standards mondiaux',
    'offer.feature_ai_analysis': 'Analyse IA experte de la peau et retours détaillés',
    'offer.feature_improvement_tips': 'Routine skincare personnalisée et conseils produits',
    'offer.feature_final_verdict': 'Verdict final et évaluation complète de la peau',
    'offer.feature_access_forever': 'Accès à vie - pas d\'expiration',
    'offer.feature_pdf_improvement': 'PDF avec routine skincare complète pour améliorer ta peau',
    'offer.processing': 'Traitement en cours...',
    'offer.get_critiques_now': 'Obtenir {{amount}} photos à analyser maintenant',
    'offer.example_score_low': 'Exemple de score : 35/100',
    'offer.example_score_high': 'Exemple de score : 85/100',
    'offer.face_rating_example_brutal': 'Exemple d\'analyse de peau - retour brutalement honnête',
    'offer.face_rating_example_expert': 'Exemple d\'analyse de peau - analyse experte',
    'offer.sign_in_to_purchase': 'Veuillez vous connecter pour acheter des crédits.',
    'offer.payment_failed': 'Le paiement a échoué. Veuillez réessayer.',
    'offer.loading': 'Chargement...',
    
    // Settings modal
    'settings.title': 'Paramètres',
    'settings.account_settings': 'Paramètres du compte',
    'settings.notifications': 'Notifications',
    'settings.email_updates': 'Mises à jour par email',
    'settings.done': 'Terminé',
    
    // App constants
    'app.name': 'PasMoche.com',
    'app.description': 'Analyse complète de ta peau et routine skincare personnalisée',
    
    // Home page hero section
    'home.hero.title': 'Analyse complète de ta peau',
    'home.hero.description': 'Poste tes photos pour recevoir une analyse détaillée de ta peau, un score sur 100 et une routine skincare 100% personnalisée avec les meilleurs produits adaptés à tes besoins.',
    'home.hero.cta': 'Analyse ta peau →',
    'home.loading': 'Chargement...',
    
    // Footer
    'footer.rights': 'Tous droits réservés.',
    'footer.copyright': '© {{year}} {{appName}}. Tous droits réservés.',
    'footer.legal_notice': 'Mentions Légales',
    'footer.privacy_policy': 'Politique de Confidentialité',
    'footer.terms_of_use': 'Conditions d\'Utilisation',
    'footer.product': 'Produit',
    'footer.dashboard': 'Tableau de bord',
    'footer.gallery': 'Galerie',
    'footer.profile': 'Profil',
    'footer.get_credits': 'Obtenir des crédits',
    'footer.support': 'Support',
    'footer.help_center': 'Centre d\'aide',
    'footer.contact_us': 'Nous contacter',
    'footer.legal': 'Légal',
    'footer.resources': 'Ressources',
    
    // Error messages
    'errors.generic': 'Une erreur s\'est produite. Veuillez réessayer.',
    'errors.failed_to_load': 'Impossible de charger votre galerie. Veuillez réessayer.',
    'errors.failed_to_refresh': 'Impossible d\'actualiser votre galerie. Veuillez réessayer.',
    'errors.permission_denied': 'Vous n\'avez pas la permission d\'accéder à ce contenu.',
    'errors.network_error': 'Problème de connexion réseau. Veuillez vérifier votre connexion et réessayer.',
    'errors.timeout': 'La requête a pris trop de temps. Veuillez réessayer.',
    'errors.not_found': 'Le contenu demandé est introuvable.',
    'errors.auth_required': 'Veuillez vous connecter pour accéder à ce contenu.',
    'errors.quota_exceeded': 'Vous avez atteint votre limite d\'utilisation. Veuillez réessayer plus tard.'
  }
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr')
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key
    
    // Handle interpolation if params are provided
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const placeholder = `{{${paramKey}}}`;
        translation = translation.split(placeholder).join(String(params[paramKey]));
      });
    }
    
    return translation
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
