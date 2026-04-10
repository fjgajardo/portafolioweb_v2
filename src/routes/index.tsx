import { createFileRoute } from '@tanstack/react-router'
import { getProjects } from '../../lib/post'
import { InView } from '../../components/motion-primitives/in-view'
import Gallery from '#/components/Gallery'
import { Intro } from '#/components/Intro'

export const Route = createFileRoute('/')({
  loader: async () => {
    const projects = await getProjects()
    return { projects }
  },
  component: App,
})

function App() {
  const { projects } = Route.useLoaderData()

  return (
    <main className=" h-screen w-screen flex flex-col justify">
      <div className="h-3/7 flex items-end page-wrap px-10">
        <section className="intro">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            viewOptions={{ margin: '0px 0px -200px 0px' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <Intro />
          </InView>
        </section>
      </div>

      <div className="h-1/7"></div>

      <div className="h-3/7 justify-self-end relative">
        <section className="absolute h-full inset-y-0 right-0 w-6/8">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            viewOptions={{ margin: '0px 0px 0px 0px' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="h-full"
          >
            <Gallery projects={projects} />
          </InView>
        </section>
      </div>
    </main>
  )
}
