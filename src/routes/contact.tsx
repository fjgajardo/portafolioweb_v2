import { createFileRoute } from '@tanstack/react-router'
import { InView } from '../../components/motion-primitives/in-view'
import ContactForm from '#/components/contact/ContactForm'
import { ContactInfo } from '#/components/contact/ContactInfo'
import * as m from '../paraglide/messages'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex flex-row py-24 align-center mx-50 gap-10 ">
      <div className="fixed top-0 bottom-0 right-1/3 border-l border-dashed border-outline-variant -z-10"></div>
      <div className="fixed top-0 bottom-0 right-1/5 border-l border-dashed border-outline-variant -z-10"></div>
      <div className="fixed top-0 bottom-0 right-1/6 border-l border-dashed border-outline-variant -z-10"></div>
      <div className="flex flex-col gap-15 w-3/7 ">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px -200px 0px' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <p className="display-large font-display text-on-surface">
            {m.contact_title()}
          </p>
          <p className="body-large font-body text-on-surface-variant">
            {m.contact_lead()}
          </p>
        </InView>
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px 0px 0px' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <ContactInfo />
        </InView>
      </div>

      <div className="w-4/7">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px -200px 0px' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <ContactForm />
        </InView>
      </div>
    </main>
  )
}
