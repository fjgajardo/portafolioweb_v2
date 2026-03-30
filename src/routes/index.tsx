import { createFileRoute } from '@tanstack/react-router'
import { TextLoop } from '../../components/motion-primitives/text-loop';
import { getLastExperience } from '../../lib/post';
import * as m from "../paraglide/messages"


export const Route = createFileRoute('/')({
  loader: async () => {
    const lastestExperience = await getLastExperience()
    return { lastestExperience }
  }, 
  component: App })

function App() {
  const { lastestExperience } = Route.useLoaderData()

  return (
    <main className="page-wrap px-2 pb-8 pt-60">
      <section className="intro">
        <h1 className='display-xlarge font-display'>Fernando Gajardo</h1>
        <div className='body-large'>
          Diseñador {' '}
          <TextLoop
            className='overflow-y-clip'
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
            <span>Integral</span>
            <span>UX/UI</span>
            <span>Gamificación</span>
          </TextLoop> 
          
        </div>
        <p>Actualmente trabajando en: </p><span>{lastestExperience?.organization}</span> <span> como {lastestExperience?.jobTitle}</span>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <span>{m.aboutme()}</span>
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Quick Start</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
          <li>
            Edit <code>src/routes/index.tsx</code> to customize the home page.
          </li>
          <li>
            Update <code>src/components/Header.tsx</code> and{' '}
            <code>src/components/Footer.tsx</code> for brand links.
          </li>
          <li>
            Add routes in <code>src/routes</code> and tweak visual tokens in{' '}
            <code>src/styles.css</code>.
          </li>
        </ul>
      </section>
    </main>
  )
}
