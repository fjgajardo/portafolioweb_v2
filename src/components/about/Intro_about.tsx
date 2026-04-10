import React from 'react'
import * as m from '../../paraglide/messages'

export const Intro_about = () => {
  return (
    <div>
      <h1 className="font-display text-on-surface headline-medium">
        {m.about_title()}
      </h1>
      <span className="font-body text-on-surface-variant body-large">
        {m.about_intro()}
      </span>
    </div>
  )
}
