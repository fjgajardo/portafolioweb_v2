import React from 'react'
import * as m from '../../paraglide/messages'
import { getLocale } from '#/paraglide/runtime'

export type LocalizedString = {
  es: string
  en: string
}

export type Studies = {
  slug: string
  institution: string
  location: string
  date: LocalizedString
  degree: LocalizedString
}

export default function Education({ study }: { study: Studies[] }) {
  const currentLang = getLocale()

  return (
    <div>
      <span className="font-body text-on-surface title-medium">
        {m.about_education_title()}
      </span>
      {/* Reduced gap from gap-15 to gap-8 for a tighter, smaller section */}
      <div className="flex flex-col gap-8 items-start mt-5">
        {study.map((e) => (
          <div
            key={e.slug}
            className="w-full relative pl-5 border-l-2 border-surface-container-highest"
          >
            {/* A smaller, more subtle timeline dot attached to the border */}
            <div className="absolute w-1.5 h-1.5 bg-secondary rounded-full -left-[4px] top-2.5"></div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4">
              <h2 className="text-on-surface font-display title-medium">
                {e.degree[currentLang]}
              </h2>
              {/* Dates moved to the right side on desktop, stacked on mobile */}
              <p className="text-on-surface-variant label-medium uppercase shrink-0">
                {e.date[currentLang]}
              </p>
            </div>

            <div className="flex flex-col  gap-2">
              <h3 className="text-on-surface-variant dis">{e.institution}</h3>

              <p className="text-on-surface-variant font-mono label-small">
                {e.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
