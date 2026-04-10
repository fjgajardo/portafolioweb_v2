import { createFileRoute } from '@tanstack/react-router'
import { getExperience, getEducation } from '../../lib/post'
import { InView } from '../../components/motion-primitives/in-view'
import { Intro_about } from '#/components/about/Intro_about'
import Experiencia from '#/components/about/Experiencia'
import { Skills } from '#/components/about/Skills'
import Education from '#/components/about/Education'
// import Education from '#/components/about/Education' // <-- Make sure to import your Education component!

export const Route = createFileRoute('/about')({
  loader: async () => {
    const experiences = await getExperience()
    const studies = await getEducation()
    return { experiences, studies }
  },
  component: About,
})

function About() {
  const { experiences } = Route.useLoaderData()
  const { studies } = Route.useLoaderData()

  return (
    // Replaced w-screen with w-full to prevent accidental horizontal scrolling
    <main className="w-full min-h-screen flex flex-col pb-24">
      {/* 1. INTRO: Top margin, centered */}
      <section className="mt-20 flex justify-center w-full page-wrap px-10">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px -200px 0px' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Intro_about />
        </InView>
      </section>

      {/* LOWER SECTION: Holds the line, Experience, Skills, and Education */}

      {/* THE LINE: Starts at the top of this div (start of Experience) and goes to the bottom */}
      {/* md:left-1/4 positions it 25% from the left, acting as the visual indent border */}
      <div className="fixed top-0 bottom-0 left-1/3 border-l border-outline-variant -z-10"></div>

      {/* 2. EXPERIENCE: Indented via the parent wrapper */}
      <section className="ml-[33.333333%] mt-10">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px 0px 0px' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <Experiencia experience={experiences} />
        </InView>
      </section>

      {/* 3. SKILLS & EDUCATION: Same row, different columns */}
      {/* grid-cols-1 on mobile, grid-cols-2 on medium screens and up */}
      <section className="mt-20 flex gap-30 justify-center w-full page-wrap px-10">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px 0px 0px' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="h-full w-2/3"
        >
          <Education study={studies} />
        </InView>

        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          viewOptions={{ margin: '0px 0px 0px 0px' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="h-full w-1/3"
        >
          <Skills />
        </InView>
      </section>
    </main>
  )
}
