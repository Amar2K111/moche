'use client'

import React from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-black mb-4">
              Une erreur critique s'est produite
            </h1>
            <p className="text-gray-600 mb-6">
              {error.message || 'Une erreur inattendue s\'est produite'}
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

