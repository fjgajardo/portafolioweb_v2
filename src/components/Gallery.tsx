import { useState, useMemo } from 'react'
import type { SetStateAction } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLocale } from '#/paraglide/runtime'
import * as m from '../paraglide/messages'
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselItem,
  useCarousel,
} from '../../components/motion-primitives/carousel'
import { Link } from '@tanstack/react-router'

export type LocalizedString = {
  es: string
  en: string
}

export type Project = {
  slug: string
  date: string
  goTo: string
  img0: string
  img1: string
  img2: string
  img3: string
  img4: string
  img5: string
  img0_dark: string
  img1_dark: string
  img2_dark: string
  img3_dark: string
  img4_dark: string
  img5_dark: string
  tags: LocalizedString
  title: LocalizedString
  shortDescription: LocalizedString
  content: LocalizedString
  leyendaBoton: LocalizedString
}

export default function Gallery({ projects }: { projects: Project[] }) {
  const currentLang = getLocale()
  const [view, setView] = useState<'fullscreen' | 'grid'>('fullscreen')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Track the index AND the direction we are moving
  const [currentIndex, setCurrentIndex] = useState(0)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach(p => {
      const pTags = p.tags?.[currentLang]
      if (pTags) {
        pTags.split(',').forEach(t => {
          const trimmed = t.trim()
          if (trimmed) tags.add(trimmed)
        })
      }
    })
    return Array.from(tags)
  }, [projects, currentLang])

  const filteredProjects = useMemo(() => {
    if (!activeFilter) return projects
    return projects.filter(p => {
      const pTags = p.tags?.[currentLang] || ''
      const projectTags = pTags.split(',').map(t => t.trim())
      return projectTags.includes(activeFilter)
    })
  }, [projects, activeFilter, currentLang])

  return (
    <div className="h-full">
      {/* Global Header */}
      <header className="absolute -top-1/15 left-0 w-full z-50 text-on-surface-variant font-mono label-medium flex items-center gap-6">
        <button
          onClick={() => setView(view === 'grid' ? 'fullscreen' : 'grid')}
          className="uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          {view === 'grid' ? 'Close' : m.gallery_title()}
        </button>
        
        {view === 'grid' && (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveFilter(null)}
              className={`uppercase tracking-widest transition-opacity ${
                activeFilter === null ? 'font-bold opacity-100 text-primary' : 'opacity-50 hover:opacity-70'
              }`}
            >
              {currentLang === 'es' ? 'Todos' : 'All'}
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`uppercase tracking-widest transition-opacity ${
                  activeFilter === tag ? 'font-bold opacity-100 text-primary' : 'opacity-50 hover:opacity-70'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <GridView
            key="grid"
            projects={filteredProjects}
            currentLang={currentLang}
            onSelect={(idx: SetStateAction<number>) => {
              setCurrentIndex(idx)
              setView('fullscreen')
            }}
          />
        ) : (
          <FullscreenSlider
            key="fullscreen"
            currentLang={currentLang}
            projects={projects}
            index={currentIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function GridView({
  projects,
  onSelect,
  currentLang,
}: {
  projects: Project[]
  onSelect: (idx: number) => void
  currentLang: 'es' | 'en'
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full grid grid-cols-3 gap-4 overflow-y-auto "
    >
      {projects.map((p, id) => (
        <Link key={p.slug} to="/projects/$projectId" params={{ projectId: p.slug }}>
          <motion.div
            className="cursor-pointer w-full aspect-video flex flex-col justify-end group relative overflow-hidden"
          >
            <div className="relative w-full h-full">
              <motion.img
                layoutId={`image-${p.slug}-light`}
                className="absolute inset-0 w-full h-full object-cover dark:hidden"
                src={p.img0}
                alt={p.title[currentLang]}
              />
              <motion.img
                layoutId={`image-${p.slug}-dark`}
                className="absolute inset-0 w-full h-full object-cover hidden dark:block"
                src={p.img0_dark}
                alt={p.title[currentLang]}
              />
            </div>

            {/* GRADIENT OVERLAY: sits between image and text */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/10 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* TEXT CONTENT: z-20 to stay above gradient */}
            <div className="relative z-20 px-4 py-2 flex flex-col ">
              <motion.p
                layoutId={`date-${p.slug}`}
                className="label-medium text-on-surface-variant font-body"
              >
                {p.date}
              </motion.p>
              <motion.h3
                layoutId={`title-${p.slug}`}
                className="title-medium font-display text-on-surface"
              >
                {p.title[currentLang]}
              </motion.h3>
            </div>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
}

// 1. Create a new sub-component for the slide
function ProjectSlide({
  project,
  itemIndex,
  currentLang,
}: {
  project: Project
  itemIndex: number
  currentLang: 'es' | 'en'
}) {
  // Grab the current active index from your carousel context
  const { index: activeIndex } = useCarousel()
  const isActive = activeIndex === itemIndex

  return (
    <CarouselItem className="h-full w-5/6 relative overflow-visible">
      {/* Image: 
        Needs 'relative' and a higher z-index (z-10) to sit above the content box. 
      */}
      <div className="relative z-10 w-full h-full">
        <motion.img
          layoutId={`image-${project.slug}-light`}
          src={project.img0}
          alt={project.title[currentLang]}
          className="absolute inset-0 w-full h-full object-cover cursor-grab dark:hidden"
          animate={{ filter: isActive ? 'brightness(1)' : 'brightness(0.4)' }}
        />
        <motion.img
          layoutId={`image-${project.slug}-dark`}
          src={project.img0_dark}
          alt={project.title[currentLang]}
          className="absolute inset-0 w-full h-full object-cover cursor-grab hidden dark:block"
          animate={{ filter: isActive ? 'brightness(1)' : 'brightness(0.4)' }}
        />
      </div>

      <motion.div
        animate={{ opacity: isActive ? 1 : 0 }}
        className="contenidoCarrusel absolute -left-1/3 top-2/15 w-full h-4/5 border-1 border-outline-variant z-0 pointer-events-none"
      >
        <div className="flex flex-col w-1/3 p-2 pointer-events-auto">
          <motion.h1
            layoutId={`date-${project.slug}`}
            className="uppercase text-on-surface-variant font-body label-small"
          >
            {project.date}
          </motion.h1>
          <motion.p
            layoutId={`title-${project.slug}`}
            className="title-large font-display text-on-surface"
          >
            {project.title[currentLang]}
          </motion.p>
          <motion.p
            layoutId={`description-${project.slug}`}
            className="mt-2 body-small font-body text-on-surface-variant"
          >
            {project.content[currentLang]}
          </motion.p>
        </div>
      </motion.div>
    </CarouselItem>
  )
}

// 2. Update your FullscreenSlider to map the new ProjectSlide
function FullscreenSlider({
  projects,
  index,
  currentLang,
}: {
  projects: Project[]
  index: number
  currentLang: 'es' | 'en'
}) {
  // Track the active index locally so the text component can react to it
  const [activeIndex, setActiveIndex] = useState(index)

  return (
    <div className="relative h-full w-full">
      <div className="absolute -left-1/5 top-1/5 w-1/5 h-5/7 z-0 border-1 border-outline-variant  overflow-auto pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full p-2 pointer-events-auto "
          >
            <h1 className="uppercase text-on-surface-variant font-body label-small">
              {projects[activeIndex].date}
            </h1>
            <p className="title-large font-display text-on-surface">
              {projects[activeIndex].title[currentLang]}
            </p>
            <p className="mt-2 body-small font-body text-on-surface-variant">
              {projects[activeIndex].content[currentLang]}
            </p>
            <Link
              to="/projects/$projectId"
              params={{ projectId: projects[activeIndex].slug }}
              className="my-5 w-fit items-center px-4 py-2 border border-outline text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 font-mono label-medium uppercase tracking-wider"
            >
              {m.gallery_button_details()}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. THE CAROUSEL */}
      <Carousel
        initialIndex={index}
        onIndexChange={setActiveIndex} // Syncs the scroll with our text state
        className="h-full w-full"
      >
        <CarouselContent className="gap-10 h-full">
          {projects.map((p, i) => (
            <CarouselItem key={p.slug} className="h-full w-5/6">
              <Link to="/projects/$projectId" params={{ projectId: p.slug }}>
                <div className="relative w-full h-full">
                  <motion.img
                    layoutId={`image-${p.slug}-light`}
                    src={p.img0}
                    alt={p.title[currentLang]}
                    className="absolute inset-0 w-full h-full object-cover dark:hidden"
                    // Dim the inactive images
                    animate={{
                      filter:
                        activeIndex === i ? 'brightness(1)' : 'brightness(0.4)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.img
                    layoutId={`image-${p.slug}-dark`}
                    src={p.img0_dark}
                    alt={p.title[currentLang]}
                    className="absolute inset-0 w-full h-full object-cover hidden dark:block"
                    // Dim the inactive images
                    animate={{
                      filter:
                        activeIndex === i ? 'brightness(1)' : 'brightness(0.4)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation
          alwaysShow
          classNameButtonLeft={m.gallery_nav_left()}
          classNameButtonRight={m.gallery_nav_right()}
        />
      </Carousel>
    </div>
  )
}
