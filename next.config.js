/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Fix for chunk loading issues in Next.js 15.x
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Exclure Puppeteer et Playwright du bundling côté client (ne fonctionne que côté serveur)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        playwright: false,
        'playwright-core': false,
        '@playwright/browser-chromium': false,
        puppeteer: false,
        'puppeteer-core': false,
        '@sparticuz/chromium': false,
      }
    }
    
    // Optimize chunk loading
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    }
    
    return config
  },
  // Disable static optimization for app directory to prevent chunk issues
  experimental: {
    optimizePackageImports: ['firebase', '@google/generative-ai'],
  },
  // Turbopack configuration (empty to use webpack for now)
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.firebaseapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.storage.googleapis.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  // Suppress React DevTools warning in development
  env: {
    REACT_APP_SUPPRESS_DEVTOOLS_WARNING: process.env.NODE_ENV === 'development' ? 'true' : 'false',
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
}

module.exports = nextConfig
