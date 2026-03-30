import { createFileRoute } from '@tanstack/react-router'
import { TextLoop } from '../../components/motion-primitives/text-loop';
import { getProjects } from '../../lib/post';
import * as m from "../paraglide/messages"
import { InView } from '../../components/motion-primitives/in-view';
import Gallery from '#/components/Gallery';


export const Route = createFileRoute('/')({
  loader: async () => {
    const projects = await getProjects()
    return { projects }
  }, 
  component: App })

function App() {
  const { projects } = Route.useLoaderData()

  return (
    <main className="page-wrap px-2 pb-8 pt-60">
      <section className="intro">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px -200px 0px' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}>  
        <h1 className='display-xlarge font-display'>Fernando Gajardo</h1>
        <div className='body-large'>
          {m.intro_title()} {' '}
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
            <span>{m.intro_title_options()}</span>
            <span>{m.intro_title_options_1()}</span>
            <span>{m.intro_title_options_2()}</span>
          </TextLoop> 
          
        </div>
        <div className="mt-8 grid grid-cols-6">
          <div className='col-start-3 col-end-7 font-body body-medium'>
              <span>{m.aboutme()}</span>
          </div>
        </div>
          
        </InView>     
        
      </section>
      <Gallery projects={projects} />

      <section >
        
        
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        
      </section>
    </main>
  )
}
