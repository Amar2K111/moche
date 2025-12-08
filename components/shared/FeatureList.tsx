'use client'

import React from 'react'

export const FeatureList: React.FC = () => {
  
  const features = [
    {
      icon: "💀",
      title: 'No Sugarcoating',
      description: 'Get brutally honest feedback that tells you exactly what you need to hear'
    },
    {
      icon: "🔥",
      title: 'Expert Feedback',
      description: 'AI-powered analysis with professional-level insights and recommendations'
    },
    {
      icon: "📊",
      title: 'Score Out of 100',
      description: 'Get a precise numerical rating that shows exactly where you stand'
    },
    {
      icon: "👑",
      title: 'Final Verdict',
      description: 'Clear, direct assessment that cuts through the noise'
    }
  ]

  return (
    <div className="grid w-full snap-x snap-mandatory auto-cols-max grid-flow-col overflow-x-auto p-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-2 lg:gap-8 lg:overflow-visible lg:p-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="h-[400px] w-[80vw] max-w-[600px] snap-start pl-8 lg:h-[500px] lg:w-full lg:max-w-none lg:pl-0"
        >
          <div className="card-gradient relative flex h-full w-full flex-col justify-end rounded-4xl text-foreground lg:h-[500px] lg:w-auto">
            <div className="relative flex flex-col gap-3 px-8 pb-8">
              <div className="text-4xl mb-2">{feature.icon}</div>
              <h3 className="text-2xl leading-[28.5px] font-semibold tracking-[-0.4px] text-foreground">
                {feature.title}
              </h3>
              <p className="text-lg leading-[24.75px] text-gray-50 font-medium">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
