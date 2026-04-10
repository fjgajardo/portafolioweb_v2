import { useState } from 'react'
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
  tags: LocalizedString
  title: LocalizedString
  shortDescription: LocalizedString
  content: LocalizedString
  leyendaBoton: LocalizedString
}

export default function Gallery({ projects }: { projects: Project[] }) {
  const currentLang = getLocale()
  const [view, setView] = useState<'fullscreen' | 'grid'>('fullscreen')

  // Track the index AND the direction we are moving
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="h-full">
      {/* Global Header */}
      <header className="absolute -top-1/15 left-0 w-full z-50 text-on-surface-variant font-mono label-medium">
        <button
          onClick={() => setView(view === 'grid' ? 'fullscreen' : 'grid')}
          className="uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          {view === 'grid' ? 'Close' : m.gallery_title()}
        </button>
      </header>

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <GridView
            key="grid"
            projects={projects}
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
        <motion.div
          key={p.slug}
          onClick={() => onSelect(id)}
          className="cursor-pointer w-full aspect-video flex flex-col justify-end group relative overflow-hidden"
        >
          {/* IMAGE: Shared layoutId only here */}
          <motion.img
            layoutId={`image-${p.slug}`}
            className="absolute inset-0 w-full h-full object-cover"
            src={p.img0}
            alt={p.title[currentLang]}
          />

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
      <motion.img
        layoutId={`image-${project.slug}`}
        src={project.img0}
        alt={project.title[currentLang]}
        className="relative z-10 w-full h-full object-cover cursor-grab"
        animate={{ filter: isActive ? 'brightness(1)' : 'brightness(0.4)' }}
      />

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
              <motion.img
                layoutId={`image-${p.slug}`}
                src={p.img0}
                alt={p.title[currentLang]}
                className="w-full h-full object-cover"
                // Dim the inactive images
                animate={{
                  filter:
                    activeIndex === i ? 'brightness(1)' : 'brightness(0.4)',
                }}
                transition={{ duration: 0.3 }}
              />
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
