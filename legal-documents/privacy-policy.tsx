import React from 'react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-200">
            <section>
              <p className="text-sm text-gray-400 mb-6">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                This Privacy Policy describes how pasmoche.com ("we", "our", or "us") collects, 
                uses, and protects your personal information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Data Controller</h2>
              <div className="space-y-2">
                <p><strong className="text-white">Website:</strong> pasmoche.com</p>
                <p><strong className="text-white">Email:</strong> materiaprobtp@gmail.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Data Collected</h2>
              <p>We collect the following types of data:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li><strong className="text-white">Email address:</strong> Only if you voluntarily submit it when creating an account or contacting us</li>
                <li><strong className="text-white">Analytics data:</strong> We use analytics tools to understand how visitors interact with our website, including page views, time spent on pages, and navigation patterns</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">Important:</strong> The photos you upload for analysis are not stored on our servers. 
                They are processed only to generate your critique and are immediately deleted after processing. 
                We do not keep any copies of your photos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. How We Use Your Data</h2>
              <p>We use the collected data for the following purposes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>To provide and improve our services</li>
                <li>To communicate with you regarding your account or inquiries</li>
                <li>To analyze website usage and improve user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Data Storage and Security</h2>
              <p>
                Your data is stored securely on servers provided by our hosting provider, Vercel Inc. 
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="mt-3">
                <strong className="text-white">Photos:</strong> As mentioned above, the photos you upload are not stored. 
                They are processed temporarily only to generate your analysis and are automatically deleted 
                after processing, without being kept on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
              <p>Under applicable data protection laws, you have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, please contact us at: 
                <a href="mailto:materiaprobtp@gmail.com" className="text-emerald-400 hover:text-emerald-300 underline ml-1">
                  materiaprobtp@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website 
                and hold certain information. You can instruct your browser to refuse all cookies 
                or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Third-Party Services</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for 
                the privacy practices of these external sites. We encourage you to review their 
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last updated" 
                date at the top of this document.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at: 
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

