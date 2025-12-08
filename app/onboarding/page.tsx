'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import OnboardingBackButton from '@/components/onboarding/OnboardingBackButton';
import OnboardingTitle from '@/components/onboarding/OnboardingTitle';
import OnboardingQuestions from '@/components/onboarding/OnboardingQuestions';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface OnboardingData {
  dreamInterest: string;
  obstacles: string[];
  validation: string;
  opportunity: string;
  urgency: string;
  selfImage: string;
  socialMedia: string;
  confidence: string;
  comparison: string;
  feedback: string;
  expectations: string;
  fears: string;
  motivation: string;
  skinImprovement: string;
  futureConfidence: string;
  lifeChange: string;
  productHope: string;
  readyToChange: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    dreamInterest: '',
    obstacles: [],
    validation: '',
    opportunity: '',
    urgency: '',
    selfImage: '',
    socialMedia: '',
    confidence: '',
    comparison: '',
    feedback: '',
    expectations: '',
    fears: '',
    motivation: '',
    skinImprovement: '',
    futureConfidence: '',
    lifeChange: '',
    productHope: '',
    readyToChange: ''
  });
  const { user, isNewUser, markOnboardingCompleted, saveOnboardingProgress, onboardingData: cloudOnboardingData, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isNewUser) {
      router.push('/dashboard');
    }
  }, [user, isNewUser, router]);

  // Restore onboarding progress from cloud database
  useEffect(() => {
    if (cloudOnboardingData) {
      try {
        setOnboardingData(cloudOnboardingData);
        // Only set step on initial load if we're on step 1
        if (currentStep === 1) {
          const step = getCurrentStepFromData(cloudOnboardingData);
          setCurrentStep(step);
        }
      } catch (error) {
        console.error('Error restoring onboarding data:', error);
      }
    }
  }, [cloudOnboardingData]);

  // Helper function to determine current step based on answered questions
  const getCurrentStepFromData = (data: OnboardingData): number => {
    if (!data.dreamInterest) return 1;
    if (data.obstacles.length === 0) return 2;
    if (!data.validation) return 3;
    if (!data.opportunity) return 4;
    if (!data.urgency) return 5;
    if (!data.selfImage) return 6;
    if (!data.socialMedia) return 7;
    if (!data.confidence) return 8;
    if (!data.comparison) return 9;
    if (!data.feedback) return 10;
    if (!data.expectations) return 11;
    if (!data.fears) return 12;
    if (!data.motivation) return 13;
    if (!data.skinImprovement) return 14;
    if (!data.futureConfidence) return 15;
    if (!data.lifeChange) return 16;
    if (!data.productHope) return 17;
    if (!data.readyToChange) return 18;
    return 18; // All questions answered, ready to submit
  };

  const handleNext = () => {
    if (currentStep < 18) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  // Calculate completion percentage based on current step and answered questions
  const getCompletionPercentage = () => {
    // For steps 1-17, show progress based on current step
    // For step 18, show progress based on actual answers
    if (currentStep < 18) {
      return Math.round(((currentStep - 1) / 18) * 100);
    } else {
      let answeredCount = 0;
      if (onboardingData.dreamInterest) answeredCount++;
      if (onboardingData.obstacles.length > 0) answeredCount++;
      if (onboardingData.validation) answeredCount++;
      if (onboardingData.opportunity) answeredCount++;
      if (onboardingData.urgency) answeredCount++;
      if (onboardingData.selfImage) answeredCount++;
      if (onboardingData.socialMedia) answeredCount++;
      if (onboardingData.confidence) answeredCount++;
      if (onboardingData.comparison) answeredCount++;
      if (onboardingData.feedback) answeredCount++;
      if (onboardingData.expectations) answeredCount++;
      if (onboardingData.fears) answeredCount++;
      if (onboardingData.motivation) answeredCount++;
      if (onboardingData.skinImprovement) answeredCount++;
      if (onboardingData.futureConfidence) answeredCount++;
      if (onboardingData.lifeChange) answeredCount++;
      if (onboardingData.productHope) answeredCount++;
      if (onboardingData.readyToChange) answeredCount++;
      return Math.round((answeredCount / 18) * 100);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <OnboardingTitle title="Tu te regardes dans le miroir et tu vois quoi exactement sur ta peau ?" />
            <OnboardingQuestions 
              questions={[
                "Des boutons partout, de l'acné qui ne part jamais, je déteste ma peau",
                "Des pores énormes, des points noirs, ma peau est vraiment dégueulasse",
                "Des taches, des cicatrices, des imperfections que je cache avec du maquillage",
                "Une peau grasse et brillante, je me sens sale et repoussant(e)",
                "Je ne peux même pas me regarder, ma peau me dégoûte complètement"
              ]}
              onSelect={(dreamInterest) => {
                const newData = { ...onboardingData, dreamInterest };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Combien de fois par jour tu te regardes dans le miroir pour vérifier tes boutons et tes imperfections ?" />
            <OnboardingQuestions 
              questions={[
                "Constamment, je ne peux pas m'arrêter, je suis obsédé(e) par ma peau",
                "Plusieurs fois par jour, je vérifie si mes boutons ont grossi ou si de nouveaux sont apparus",
                "À chaque fois que je passe devant un miroir, je scrute chaque imperfection",
                "Je me cache pour me regarder, j'ai honte de ma peau et je ne veux pas que les autres voient",
                "Je ne compte même plus, ma peau est ma pire ennemie"
              ]}
              onSelect={(obstacle) => {
                const newData = { 
                  ...onboardingData, 
                  obstacles: [...onboardingData.obstacles, obstacle] 
                };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Quand tu vois des gens avec une peau parfaite, tu ressens quoi exactement ?" />
            <OnboardingQuestions 
              questions={[
                "Une jalousie maladive, je les déteste et je me déteste encore plus",
                "Un sentiment d'infériorité écrasant, je ne serai jamais comme eux",
                "De la honte, je me sens sale et repoussant(e) à côté d'eux",
                "Un désespoir profond, je sais que je ne pourrai jamais avoir une belle peau",
                "Une envie de me cacher, je ne mérite pas d'être vu(e) avec ma peau"
              ]}
              onSelect={(validation) => {
                const newData = { ...onboardingData, validation };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Tu as déjà essayé combien de produits skincare qui n'ont rien changé ?" />
            <OnboardingQuestions 
              questions={[
                "Des dizaines, j'ai tout essayé et rien ne fonctionne, je suis désespéré(e)",
                "Trop pour compter, j'ai dépensé une fortune pour rien, ma peau est toujours horrible",
                "Je suis devenu(e) accro aux produits, j'en achète constamment mais ça empire",
                "Tous les produits promettent des miracles mais ma peau reste dégueulasse",
                "Je me sens arnaqué(e), personne ne peut m'aider, ma peau est fichue"
              ]}
              onSelect={(opportunity) => {
                const newData = { ...onboardingData, opportunity };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Ta peau t'empêche de faire quoi dans ta vie ?" />
            <OnboardingQuestions 
              questions={[
                "De sortir, de rencontrer des gens, je me cache à cause de ma peau",
                "D'être en couple, personne ne voudrait de moi avec cette peau",
                "D'être heureux(se), ma peau ruine ma vie et ma confiance",
                "De prendre des photos, je refuse qu'on me photographie",
                "De vivre normalement, ma peau contrôle toute ma vie"
              ]}
              onSelect={(urgency) => {
                const newData = { ...onboardingData, urgency };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Quand quelqu'un te regarde, tu penses qu'il voit quoi en premier ?" />
            <OnboardingQuestions 
              questions={[
                "Mes boutons et mon acné, c'est impossible de ne pas les voir",
                "Mes pores énormes et ma peau grasse, je suis repoussant(e)",
                "Mes taches et mes cicatrices, je suis marqué(e) à vie",
                "Toutes mes imperfections, je suis un désastre",
                "À quel point ma peau est horrible, je ne mérite pas d'être regardé(e)"
              ]}
              onSelect={(selfImage) => {
                const newData = { ...onboardingData, selfImage };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Tu utilises combien de filtres et de retouches sur tes photos pour cacher ta peau ?" />
            <OnboardingQuestions 
              questions={[
                "Je ne poste jamais de photos sans filtres, ma vraie peau est honteuse",
                "Je passe des heures à retoucher chaque photo pour effacer mes imperfections",
                "Je ne peux pas me montrer sans maquillage, ma peau nue est intolérable",
                "Je supprime toutes les photos où ma peau est visible, je suis trop honteux(se)",
                "Je ne prends même plus de photos, ma peau me dégoûte trop"
              ]}
              onSelect={(socialMedia) => {
                const newData = { ...onboardingData, socialMedia };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );


      case 8:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Ta peau détruit-elle ta confiance en toi au point de t'empêcher de vivre ?" />
            <OnboardingQuestions 
              questions={[
                "Oui, complètement, je ne sors plus à cause de ma peau, je suis prisonnier(ère)",
                "Ma peau me fait détester mon reflet, je ne peux plus me regarder",
                "Je refuse les rendez-vous, les sorties, tout à cause de ma peau horrible",
                "Ma confiance est à zéro, ma peau me fait me sentir indigne de tout",
                "Je suis devenu(e) invisible, je me cache constamment à cause de ma peau"
              ]}
              onSelect={(confidence) => {
                const newData = { ...onboardingData, confidence };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Tu compares ta peau à celle des autres et tu te sens comment ?" />
            <OnboardingQuestions 
              questions={[
                "Inférieur(e) et dégoûté(e), leur peau parfaite me rappelle à quel point la mienne est horrible",
                "Désespéré(e), je sais que je n'aurai jamais une peau aussi belle",
                "Honteux(se), je me sens sale et repoussant(e) à côté d'eux",
                "En colère, pourquoi eux ont une belle peau et pas moi ?",
                "Détruit(e), chaque comparaison me rappelle que ma peau est un échec total"
              ]}
              onSelect={(comparison) => {
                const newData = { ...onboardingData, comparison };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Quand quelqu'un te dit que ta peau a l'air bien, tu penses quoi ?" />
            <OnboardingQuestions 
              questions={[
                "Ils mentent, ils ne peuvent pas vraiment penser ça avec ma peau horrible",
                "Ils sont juste polis, ils voient bien mes boutons et mes imperfections",
                "Ils se moquent de moi, personne ne peut trouver ma peau belle",
                "Ils n'ont pas regardé attentivement, sinon ils verraient à quel point c'est dégueulasse",
                "Je ne les crois jamais, ma peau est un désastre et tout le monde le voit"
              ]}
              onSelect={(feedback) => {
                const newData = { ...onboardingData, feedback };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );


      case 11:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Tu penses que ta peau mérite quelle note sur 100 ?" />
            <OnboardingQuestions 
              questions={[
                "Sous les 20, ma peau est un désastre total, je suis désespéré(e)",
                "Entre 20 et 40, ma peau est vraiment mauvaise et je le sais",
                "Autour de 50, ma peau est moyenne mais pleine d'imperfections",
                "Je n'ose même pas imaginer, j'ai peur que ce soit encore pire que je pense",
                "Je refuse de penser à ça, ma peau me fait trop honte"
              ]}
              onSelect={(expectations) => {
                const newData = { ...onboardingData, expectations };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 12:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Qu'est-ce qui te terrifie le plus dans cette analyse de ta peau ?" />
            <OnboardingQuestions 
              questions={[
                "Découvrir que ma peau est encore pire que je pensais, que je suis vraiment fichu(e)",
                "Avoir une note si basse que ça confirme que ma peau est un désastre total",
                "Apprendre que tous mes problèmes de peau sont irréversibles et que je suis condamné(e)",
                "Découvrir que tout le monde voit à quel point ma peau est horrible",
                "Savoir que même avec tous les produits du monde, ma peau ne s'améliorera jamais"
              ]}
              onSelect={(fears) => {
                const newData = { ...onboardingData, fears };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 13:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Dernière question : pourquoi tu veux vraiment cette analyse de ta peau ?" />
            <OnboardingQuestions 
              questions={[
                "Pour enfin savoir la vérité sur ma peau, même si ça fait mal, je dois savoir",
                "Pour avoir une routine qui fonctionne vraiment, je suis désespéré(e)",
                "Pour comprendre tous mes problèmes de peau et comment les résoudre",
                "Pour arrêter de dépenser de l'argent dans des produits qui ne marchent pas",
                "Parce que ma peau ruine ma vie et j'ai besoin d'aide maintenant"
              ]}
              onSelect={(motivation) => {
                const newData = { ...onboardingData, motivation };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 14:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Si ta peau s'améliorait vraiment, comment te sentirais-tu ?" />
            <OnboardingQuestions 
              questions={[
                "Libéré(e), enfin je pourrais vivre sans me cacher constamment",
                "Confiant(e), je pourrais enfin sortir et rencontrer des gens sans honte",
                "Heureux(se), ma vie changerait complètement, je serais une nouvelle personne",
                "Apaisé(e), enfin je pourrais me regarder dans le miroir sans dégoût",
                "Renaissant(e), ce serait comme renaître avec une peau normale"
              ]}
              onSelect={(skinImprovement) => {
                const newData = { ...onboardingData, skinImprovement };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 15:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Avec une peau améliorée, ta confiance en toi changerait comment ?" />
            <OnboardingQuestions 
              questions={[
                "Je serais invincible, je pourrais enfin être moi-même sans honte",
                "Ma confiance exploserait, je me sentirais enfin digne d'être vu(e)",
                "Je pourrais enfin sortir, rencontrer des gens, vivre ma vie normalement",
                "Je ne me cacherais plus, je serais fier(e) de mon apparence",
                "Ce serait un nouveau départ, je pourrais enfin être heureux(se)"
              ]}
              onSelect={(futureConfidence) => {
                const newData = { ...onboardingData, futureConfidence };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 16:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Si ta peau s'améliorait, qu'est-ce que tu ferais que tu ne fais pas maintenant ?" />
            <OnboardingQuestions 
              questions={[
                "Je sortirais enfin, je rencontrerais des gens, je vivrais ma vie",
                "Je prendrais des photos sans filtres, je serais fier(e) de moi",
                "Je ne me cacherais plus, je porterais ce que je veux sans honte",
                "Je serais en couple, je me sentirais enfin digne d'être aimé(e)",
                "Je serais heureux(se), ma peau ne contrôlerait plus ma vie"
              ]}
              onSelect={(lifeChange) => {
                const newData = { ...onboardingData, lifeChange };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 17:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Dernière question : comment te sentirais-tu si tu avais enfin une routine qui fonctionne vraiment ?" />
            <OnboardingQuestions 
              questions={[
                "Enfin libéré(e), je pourrais enfin vivre sans me soucier de ma peau",
                "Rassuré(e), enfin je saurais que je suis sur la bonne voie",
                "Reconnaissant(e), enfin quelqu'un qui comprend mes problèmes et m'aide vraiment",
                "Motivé(e), je serais prêt(e) à tout pour avoir une belle peau",
                "Apaisé(e), enfin je pourrais arrêter de stresser et me concentrer sur ma vie"
              ]}
              onSelect={(productHope) => {
                const newData = { ...onboardingData, productHope };
                setOnboardingData(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 18:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Es-tu prêt(e) à changer ta vie et enfin avoir une peau dont tu es fier(e) ?" />
            <OnboardingQuestions 
              questions={[
                "Oui, je suis prêt(e) ! Je veux enfin changer ma vie et avoir une belle peau",
                "Oui, absolument ! Je suis prêt(e) à tout pour enfin être heureux(se) avec ma peau"
              ]}
              onSelect={async (readyToChange) => {
                const newData = { ...onboardingData, readyToChange };
                setOnboardingData(newData);
                
                // Validate all required fields using concise array-based approach
                const requiredFields: (keyof OnboardingData)[] = [
                  'dreamInterest', 'validation', 'opportunity', 'urgency', 
                  'selfImage', 'socialMedia', 'confidence', 'comparison',
                  'feedback', 'expectations', 'fears', 'motivation',
                  'skinImprovement', 'futureConfidence', 'lifeChange', 'productHope', 'readyToChange'
                ];
                
                const allAnswered = requiredFields.every(field => 
                  field === 'obstacles' ? newData.obstacles.length > 0 : Boolean(newData[field])
                );
                
                // Save to Firestore and complete onboarding
                if (!allAnswered) {
                  console.warn('[Onboarding] Data corruption detected: reached final step with incomplete data. This should never happen.', {
                    missingFields: requiredFields.filter(field => 
                      field === 'obstacles' ? newData.obstacles.length === 0 : !newData[field]
                    )
                  });
                }
                
                try {
                  await saveOnboardingProgress(newData);
                  await markOnboardingCompleted();
                  router.push('/dashboard');
                } catch (error) {
                  console.error('[Onboarding] Failed to save onboarding data:', error);
                  alert('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
                }
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
        <Header />
        
        <div className="flex-1 py-4 sm:py-6 md:py-8 lg:py-12 px-4 relative z-10">
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight mb-2 sm:mb-3 md:mb-4 px-2">
              Analyse complète de ta peau
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black font-medium px-4">
              Analyse complète de ta peau. Routine personnalisée et produits adaptés.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between mb-2 text-xs sm:text-sm">
              <span className="text-black">Étape {currentStep} sur 18</span>
              <span className="text-black">{getCompletionPercentage()}% Terminé</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>

          <OnboardingContainer>
            {renderStep()}
          </OnboardingContainer>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
