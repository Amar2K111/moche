import React from 'react'
import Link from 'next/link'

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8">Terms of Use</h1>
          
          <div className="space-y-6 text-gray-200">
            <section>
              <p className="text-sm text-gray-400 mb-6">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using pasmoche.com (the "Website"), you accept and agree to be 
                bound by the terms and provision of this agreement. If you do not agree to abide by the 
                above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
              <p>
                pasmoche.com provides honest and detailed analysis of your appearance. 
                The service allows users to upload photos for analysis and receive detailed 
                critiques on their appearance.
              </p>
              <p className="mt-3">
                <strong className="text-white">Important:</strong> The photos you upload are not stored on our servers. 
                They are processed only to generate your critique and are immediately deleted after processing. 
                We do not keep any copies of your photos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Account</h2>
              <p>To use certain features of the Website, you may be required to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Create an account with accurate and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Use the service for any illegal purpose or in violation of any laws</li>
                <li>Upload content that is offensive, harmful, or violates the rights of others</li>
                <li>Attempt to gain unauthorized access to the Website or its related systems</li>
                <li>Interfere with or disrupt the Website or servers connected to the Website</li>
                <li>Reproduce, duplicate, copy, sell, or exploit any portion of the service without express written permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h2>
              <p>
                All content on the Website, including but not limited to text, graphics, logos, images, 
                audio clips, digital downloads, and software, is the property of pasmoche.com or 
                its content suppliers and is protected by international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Payment Terms</h2>
              <p>
                If you purchase credits or services through the Website, you agree to pay all charges 
                associated with your purchase. All prices are in the currency specified on the Website 
                and are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Disclaimer of Warranties</h2>
              <p>
                The Website and its services are provided "as is" and "as available" without warranties 
                of any kind, either express or implied. We do not guarantee that the service will be 
                uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, pasmoche.com shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, or any loss of 
                profits or revenues, whether incurred directly or indirectly, or any loss of data, 
                use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless pasmoche.com, its owner, employees, 
                and agents from any claims, damages, losses, liabilities, and expenses (including legal 
                fees) arising out of or relating to your use of the Website or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account and access to the service 
                immediately, without prior notice or liability, for any reason, including if you 
                breach the Terms of Use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Governing Law</h2>
              <p>
                These Terms of Use shall be governed by and construed in accordance with the laws of 
                France, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Use at any time. We will notify users 
                of any changes by posting the new Terms of Use on this page and updating the "Last 
                updated" date. Your continued use of the service after any changes constitutes 
                acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">13. Contact Information</h2>
              <div className="space-y-2">
                <p><strong className="text-white">Website:</strong> pasmoche.com</p>
                <p>
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:materiaprobtp@gmail.com" className="text-emerald-400 hover:text-emerald-300 underline">
                    materiaprobtp@gmail.com
                  </a>
                </p>
              </div>
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

