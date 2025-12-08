'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '../ui/Card'

// Configuration des PDFs pour chaque carte
const pdfPages = {
  35: [
    "Capture d'écran 2025-11-30 134804.png",
    "Capture d'écran 2025-11-30 134816.png",
    "Capture d'écran 2025-11-30 134829.png",
    "Capture d'écran 2025-11-30 134837.png",
    "Capture d'écran 2025-11-30 134845.png"
  ],
  85: [
    "Capture d'écran 2025-11-30 134554.png",
    "Capture d'écran 2025-11-30 134619.png",
    "Capture d'écran 2025-11-30 134642.png"
  ]
}

export const ExampleGallery: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
        <h2 className="inline-block w-fit text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.25] font-semibold tracking-[-1.28px] mb-3 sm:mb-4">
          Regarde ce qui t'attend 👀
        </h2>
        <p className="text-base sm:text-lg text-gray-600 font-medium px-2">
          De vrais exemples de nos critiques
        </p>
      </div>

      {/* Cards with PDF pages below - Mobile optimized */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 sm:gap-10 lg:gap-16 py-4 sm:py-6 md:py-8 px-4">
        {/* Card 35 with PDF pages */}
        <div className="flex flex-col items-center w-full">
          {/* Card */}
          <div className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[325px] overflow-hidden mb-4 sm:mb-6" style={{ clipPath: 'inset(0 0 4px 0)' }}>
          <img 
            src={encodeURI("/images/Capture d'écran 2025-11-30 134745.png")} 
              alt="Exemple de critique d'apparence - score 35" 
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* PDF Pages - Horizontal line - Mobile optimized */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto max-w-full pb-2 scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {pdfPages[35].map((page, index) => (
              <img
                key={index}
                src={encodeURI(`/35/${page}`)}
                alt={`Page ${index + 1} du PDF - Score 35`}
                className="h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px] w-auto object-contain rounded-sm shadow-md flex-shrink-0"
            loading="lazy"
          />
            ))}
          </div>
        </div>

        {/* Card 85 with PDF pages */}
        <div className="flex flex-col items-center w-full">
          {/* Card */}
          <img 
            src={encodeURI("/images/Capture d'écran 2025-11-30 134519.png")} 
            alt="Exemple de critique d'apparence - score 85" 
            className="w-full max-w-[300px] sm:max-w-[320px] md:max-w-[360px] h-auto object-contain mb-4 sm:mb-6"
            loading="lazy"
          />

          {/* PDF Pages - Horizontal line - Mobile optimized */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto max-w-full pb-2 scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {pdfPages[85].map((page, index) => (
              <img
                key={index}
                src={encodeURI(`/85/${page}`)}
                alt={`Page ${index + 1} du PDF - Score 85`}
                className="h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px] w-auto object-contain rounded-sm shadow-md flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Text and CTA below images - Mobile optimized */}
      <div className="flex flex-col items-center mt-8 sm:mt-10 md:mt-12 px-4">
        <h3 className="text-lg sm:text-xl md:text-2xl leading-tight font-semibold -tracking-[0.04em] text-gray-900 text-center mb-4 sm:mb-5 px-2">
          Obtenez une critique honnête de votre apparence.
        </h3>
        <Link href="/auth/signup" className="w-full sm:w-auto">
          <button className="blue-gradient-button rounded-[10px] flex items-center justify-center gap-[6px] w-full sm:w-fit text-white font-semibold text-base sm:text-lg md:text-xl tracking-[-0.13px] px-8 sm:px-12 md:px-14 py-4 sm:py-5 md:py-6 min-h-[48px] relative overflow-hidden shadow-[0_4px_20px_rgba(73,126,233,0.5)]">
            <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden="true">
              <span className="blurred-border absolute -top-px -left-px z-20 h-full w-full"></span>
            </span>
            <span className="relative z-10">Commencer maintenant</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
