import React from 'react'
import * as m from '../paraglide/messages'
import { TextLoop } from '../../components/motion-primitives/text-loop'

export const Intro = () => {
  return (
    <div>
      <h1 className="display-xlarge font-display text-on-surface">
        Fernando Gajardo
      </h1>
      <div className="body-large">
        {m.intro_title()}{' '}
        <TextLoop
          className="overflow-y-clip"
          transition={{
            type: 'spring',
            stiffness: 900,
            damping: 80,
            mass: 10,
          }}
          variants={{
            initial: {
              y: 20,
              rotateX: 90,
              opacity: 0,
              filter: 'blur(4px)',
            },
            animate: {
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: 'blur(0px)',
            },
            exit: {
              y: -20,
              rotateX: -90,
              opacity: 0,
              filter: 'blur(4px)',
            },
          }}
        >
          <span>{m.intro_title_options()}</span>
          <span>{m.intro_title_options_1()}</span>
          <span>{m.intro_title_options_2()}</span>
        </TextLoop>
      </div>
      <div className="mt-8 grid grid-cols-6">
        <div className="col-start-3 col-end-7 font-body body-medium">
          <span>{m.intro_aboutme()}</span>
        </div>
      </div>
    </div>
  )
}
