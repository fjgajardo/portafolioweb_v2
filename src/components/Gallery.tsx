import { useState } from 'react';
import type { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction } from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import { getLocale } from '#/paraglide/runtime';
import * as m from "../paraglide/messages"
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselItem,
} from '../../components/motion-primitives/carousel';

export type LocalizedString = {
  es: string;
  en: string;
};

export type Project = {
  slug: string;
  date: string;
  goTo: string;
  img0: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  tags: LocalizedString;
  title: LocalizedString;
  shortDescription: LocalizedString;
  content: LocalizedString;
  leyendaBoton: LocalizedString;
}

export default function Gallery({ projects }: { projects: Project[] }) {
  const currentLang = getLocale();
  const [view, setView] = useState<'fullscreen' | 'grid'>('fullscreen');
  
  // Track the index AND the direction we are moving
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextProject = () => {
    setDirection(1); // Moving forward
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };
  
  const prevProject = () => {
    setDirection(-1); // Moving backward
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

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
              setCurrentIndex(idx); 
              setView('fullscreen'); 
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
  );
}

// --- SUB-COMPONENTS ---

function GridView({ 
  projects, 
  onSelect,
  currentLang
}: { 
  projects: Project[]; 
  onSelect: (idx: number) => void;
  currentLang: 'es' | 'en';
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="w-full h-full  px-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto"
    >
      {projects.map((p, id) => (
        <motion.div 
          layoutId={`project-container-${p.slug}`}
          key={p.slug} 
          onClick={() => onSelect(id)}
          className="cursor-pointer w-full aspect-video flex flex-col justify-end p-6 group relative overflow-hidden"
        >
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
            layoutId={`image-${p.slug}`}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity will-change-transform" 
            src={p.img0}  
            alt={p.title[currentLang]} 
          />
          <div className="relative z-10 flex flex-col">
            <motion.h3 layoutId={`title-${p.slug}`} className="text-xl font-bold uppercase mb-1 drop-shadow-md">
              {p.title[currentLang]}
            </motion.h3>
            <motion.p layoutId={`date-${p.slug}`} className="text-sm opacity-70 drop-shadow-md">
              {p.date}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function FullscreenSlider({ 
  projects, 
  index,
  currentLang
}: { 
  projects: Project[];
  index: number;
  currentLang: 'es' | 'en';
}) {
  return (
    <div className='relative h-full w-full'>
      {/* ADD initialIndex={index} HERE */}
      <Carousel initialIndex={index}>
        <CarouselContent className='gap-10 h-full'>
          {projects.map((p) => {
            return (
              <CarouselItem key={p.slug} className='h-full w-5/6'>
                  <motion.img
                      layoutId={`image-${p.slug}`}
                      src={p.img0}
                      alt={p.title[currentLang]}
                      className="w-full h-full object-cover z-50 cursor-grab" 
                    />
                    
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselNavigation
          alwaysShow
          classNameButtonLeft={m.gallery_nav_left()}
          classNameButtonRight={m.gallery_nav_right()}
        />
      </Carousel>
    </div>
  );
}