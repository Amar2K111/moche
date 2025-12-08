'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-black mb-4">
          Une erreur s'est produite
        </h1>
        <p className="text-gray-600 mb-6">
          {error.message || 'Une erreur inattendue s\'est produite'}
        </p>
        <Button onClick={reset} className="w-full sm:w-auto">
          Réessayer
        </Button>
      </div>
    </div>
  )
}

