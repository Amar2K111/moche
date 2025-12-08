import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientAuthProvider from '@/components/providers/ClientAuthProvider'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pas Moche - Analyse complète de ta peau',
  description: 'Analyse complète de votre peau avec IA. Recevez un score détaillé, une routine skincare personnalisée et des recommandations de produits adaptés à vos besoins spécifiques.',
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/images/selin-wanner-wU4iORvrGmA-unsplash.jpg" />
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Suppress React DevTools warning in development
                if (typeof window !== 'undefined') {
                  const originalConsoleWarn = console.warn;
                  console.warn = function(...args) {
                    if (args[0] && typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
                      return;
                    }
                    originalConsoleWarn.apply(console, args);
                  };
                }
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} bg-light-bg text-text-dark min-h-screen`} suppressHydrationWarning={true}>
        <ClientAuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ClientAuthProvider>
      </body>
    </html>
  )
}
