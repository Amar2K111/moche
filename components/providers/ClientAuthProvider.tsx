'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

interface ClientAuthProviderProps {
  children: React.ReactNode
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return (
    <AuthProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </AuthProvider>
  )
}
