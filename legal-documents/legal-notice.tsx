import React from 'react'
import Link from 'next/link'

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8">Legal Notice</h1>
          
          <div className="space-y-6 text-gray-200">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Company Information</h2>
              <div className="space-y-2">
                <p><strong className="text-white">Website:</strong> pasmoche.com</p>
                <p><strong className="text-white">Email:</strong> materiaprobtp@gmail.com</p>
                <p><strong className="text-white">Hosting:</strong> Vercel Inc.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Publication Director</h2>
              <p>The publication director is the owner of the website pasmoche.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Hosting Provider</h2>
              <p>
                This website is hosted by Vercel Inc. For any questions regarding hosting, 
                please contact Vercel Inc. directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Intellectual Property</h2>
              <p>
                All content on this website, including but not limited to text, graphics, logos, 
                images, and software, is the property of pasmoche.com or its content suppliers 
                and is protected by international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p>
                For any questions regarding this legal notice, please contact us at: 
                <a href="mailto:materiaprobtp@gmail.com" className="text-emerald-400 hover:text-emerald-300 underline ml-1">
                  materiaprobtp@gmail.com
                </a>
              </p>
            </section>

            <div className="pt-6 border-t border-gray-600">
              <Link 
                href="/" 
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

