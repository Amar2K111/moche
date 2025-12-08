export interface Critique {
  score: number
  roast: string
  tips: string[]
  verdict: string
}

export const DUMMY_CRITIQUES: Critique[] = [
  {
    score: 37,
    roast: "Your nails are crying for help. Did you file them with a cheese grater?",
    tips: [
      "Invest in a proper nail file",
      "Moisturize daily",
      "Consider professional manicure"
    ],
    verdict: "Don't quit your day job"
  },
  {
    score: 52,
    roast: "At least you have hands. That's... something.",
    tips: [
      "Work on hand positioning",
      "Improve lighting for photos",
      "Practice better angles"
    ],
    verdict: "Maybe with practice"
  },
  {
    score: 68,
    roast: "Not terrible, but definitely not hand model material.",
    tips: [
      "Focus on nail care",
      "Improve skin texture",
      "Better hand posture"
    ],
    verdict: "Keep practicing"
  },
  {
    score: 81,
    roast: "Actually... not bad. I'm mildly impressed.",
    tips: [
      "Minor nail shape improvements",
      "Better photo composition",
      "Consider professional photos"
    ],
    verdict: "Potential hand model"
  },
  {
    score: 92,
    roast: "Okay, these hands could actually work. Color me surprised.",
    tips: [
      "Maintain current care routine",
      "Perfect your angles",
      "Build a portfolio"
    ],
    verdict: "Hand Model Material"
  },
  {
    score: 97,
    roast: "Holy moly, these hands are actually perfect. How dare you.",
    tips: [
      "You're already perfect",
      "Start modeling immediately",
      "Teach us your ways"
    ],
    verdict: "Elite Hand Model"
  }
]

export const getRandomCritique = (): Critique => {
  const randomIndex = Math.floor(Math.random() * DUMMY_CRITIQUES.length)
  return DUMMY_CRITIQUES[randomIndex]
}

export const getCritiqueByScore = (score: number): Critique => {
  if (score >= 90) return DUMMY_CRITIQUES[5]
  if (score >= 80) return DUMMY_CRITIQUES[4]
  if (score >= 70) return DUMMY_CRITIQUES[3]
  if (score >= 60) return DUMMY_CRITIQUES[2]
  if (score >= 50) return DUMMY_CRITIQUES[1]
  return DUMMY_CRITIQUES[0]
}

