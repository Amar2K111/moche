'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export const Footer: React.FC = () => {
  const { t } = useLanguage()
  return (
    <footer className="relative bg-gradient-to-t from-black/25 to-white pt-8 sm:pt-10 pb-4 sm:pb-5">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-8">
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="">
            <span className="inline-flex rounded-md min-h-[44px] items-center">
              <span className="text-sm sm:text-base font-medium tracking-tight text-black">
              {t('app.name')}
            </span>
              <span className="sr-only">{t('app.name')}</span>
            </span>
          </div>
          <nav className="mt-6 sm:mt-8 grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8 md:mt-[50px] md:grid-cols-[repeat(4,fit-content(240px))] md:gap-11 lg:mt-0 lg:gap-[58px] xl:gap-[66px]">
            {/* Product Column */}
            <div className="flex flex-col">
              <h3 className="font-bold tracking-tight text-black mb-3">
                {t('footer.product')}
              </h3>
              <ul className="mt-3 flex flex-col gap-y-2">
                <li>
                  <Link 
                    href="/dashboard" 
                    className="inline-flex items-center gap-x-1.5 rounded tracking-tight [&_svg]:shrink-0 leading-snug font-normal text-black transition-colors duration-200 hover:text-primary-blue active:text-primary-blue min-h-[44px] touch-manipulation"
                  >
                    {t('footer.dashboard')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex flex-col">
              <h3 className="font-bold tracking-tight text-black mb-3">
                {t('footer.support')}
              </h3>
              <ul className="mt-3 flex flex-col gap-y-2">
                <li>
                  <span className="inline-flex items-center gap-x-1.5 rounded tracking-tight [&_svg]:shrink-0 leading-snug font-normal text-black">
                    {t('footer.help_center')}
                  </span>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col">
              <h3 className="font-bold tracking-tight text-black mb-3">
                {t('footer.legal')}
              </h3>
              <ul className="mt-3 flex flex-col gap-y-2">
                <li>
                  <span className="inline-flex items-center gap-x-1.5 rounded tracking-tight [&_svg]:shrink-0 leading-snug font-normal text-black">
                    {t('footer.legal_notice')}
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-x-1.5 rounded tracking-tight [&_svg]:shrink-0 leading-snug font-normal text-black">
                    {t('footer.privacy_policy')}
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-x-1.5 rounded tracking-tight [&_svg]:shrink-0 leading-snug font-normal text-black">
                    {t('footer.terms_of_use')}
                  </span>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col">
              <h3 className="font-bold tracking-tight text-black mb-3">
                {t('footer.resources')}
              </h3>
              <ul className="mt-3 flex flex-col gap-y-2">
                <li>
                  <span className="inline-flex items-center gap-x-1.5 rounded tracking-tight [&_svg]:shrink-0 leading-snug font-normal text-black">
                    {t('home.hero.title')}
                  </span>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="relative mt-[30px] flex flex-col pt-[30px] md:mt-5 md:flex-row md:items-center md:justify-between md:pt-5">
          <p className="order-2 mt-7 text-sm tracking-tight text-black md:order-1 md:mt-0">
            {t('footer.copyright', { year: new Date().getFullYear(), appName: t('app.name') })}
          </p>
        </div>
      </div>
    </footer>
  )
}
