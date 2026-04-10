import React from 'react'
import * as m from '../../paraglide/messages'
import { getLocale } from '#/paraglide/runtime'

export type LocalizedString = {
  es: string
  en: string
}

export type Experience = {
  slug: string
  empresa: string
  location: string
  dateStart: LocalizedString
  dateEnd: LocalizedString
  title: LocalizedString
  tag1: LocalizedString
  tag2: LocalizedString
  tag3: LocalizedString
  content: LocalizedString
}

export default function Experiencia({
  experience,
}: {
  experience: Experience[]
}) {
  const currentLang = getLocale()
  const exp = experience

  return (
    <div>
      <span className="font-body text-on-surface title-medium">
        {m.about_experience_title()}
      </span>
      <div className="flex flex-col gap-15 items-start mt-5">
        {exp.map((e, id) => (
          <div key={e.slug} className="w-full flex flex-row">
            <div className="w-2 h-2 bg-secondary rounded-full shrink-0 -mx-1 mt-3"></div>
            <div className="w-1/6 shrink-0 mt-1 ml-5">
              <p className="text-on-surface-variant label-medium uppercase">
                {e.dateStart[currentLang]} - {e.dateEnd[currentLang]}
              </p>
              <p className="text-on-surface-variant font-mono label-small  mt-1">
                {e.location}
              </p>
            </div>

            <div className="w-5/6">
              <div>
                <div>
                  <div className="flex flex-row gap-4">
                    <h2 className="text-on-surface font-display title-medium">
                      {e.title[currentLang]}
                    </h2>
                    <div className="flex items-start gap-2  ">
                      <span className="bg-surface-container-highest text-on-surface label-small font-mono uppercase px-2 py-1 ">
                        {e.tag1[currentLang]}
                      </span>
                      <span className="bg-surface-container-highest text-on-surface label-small font-mono uppercase px-2 py-1 ">
                        {e.tag2[currentLang]}
                      </span>
                      <span className="bg-surface-container-highest text-on-surface label-small font-mono uppercase px-2 py-1 ">
                        {e.tag3[currentLang]}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-on-surface-variant body-large ">
                    {e.empresa}
                  </h3>
                </div>
              </div>

              <p className="text-on-surface-variant body-medium whitespace-pre-line">
                {e.content[currentLang]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
