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
    <main className="w-full min-h-screen flex flex-col py-24">
      <section className="h-3/7 flex items-end mx-50 px-10">
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
      </section>

      <section className="mt-20 flex gap-10 mx-50 px-10">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px 0px 0px' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="h-full w-2/4"
        >
          <ContactInfo />
        </InView>

        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px 0px 0px' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="h-full w-2/4"
        >
          <ContactForm />
        </InView>
      </section>
    </main>
  )
}
