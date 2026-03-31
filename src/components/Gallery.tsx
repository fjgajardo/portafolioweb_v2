import { useState       } from 'react';
import type {JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction} from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';

export type Project = {
  slug: string;
  title: string;
  date: string;
  content: string;
  leyendaBoton: string;
  goTo: string;
  img1: string;
  img0: string;
  img2: string;
}


export default function Gallery({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<'fullscreen' | 'grid'>('fullscreen');
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
  const prevProject = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <div className="h-full">
      
      {/* Global Header */}
      <header className="absolute top-0 left-0 w-full p-6  z-50 mix-blend-difference">
        <button 
          onClick={() => setView(view === 'grid' ? 'fullscreen' : 'grid')}
          className="uppercase text-xs tracking-widest hover:opacity-70 transition-opacity"
        >
          {view === 'grid' ? 'Close' : 'All Projects'}
        </button>
      </header>

      {/* Main Container */}
      <AnimatePresence mode="popLayout">
        {view === 'grid' ? (
          <GridView 
            key="grid" 
            projects={projects} 
            onSelect={(idx: SetStateAction<number>) => { 
              setCurrentIndex(idx); 
              setView('fullscreen'); 
            }} 
          />
        ) : (
          <FullscreenSlider 
            key="fullscreen" 
            projects={projects}  
            onNext={nextProject} 
            onPrev={prevProject} 
            total={projects.length}
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
  onSelect 
}: { 
  projects: Project[]; 
  onSelect: (idx: number) => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="w-full h-full pt-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto"
    >
      {projects.map((p, id) => (
        <motion.div 
          layoutId={`project-container-${p.slug}`}
          key={p.slug} 
          onClick={() => onSelect(id)}
          className="cursor-pointer w-full aspect-video bg-neutral-900 flex flex-col justify-end p-6 group relative overflow-hidden"
        >
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20, 
              mass: 1 
            }}
            layoutId={`image-${p.slug}`}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity will-change-transform" 
            src={p.img0}  
            alt={p.title} 
          />
          <div className="relative z-10 flex flex-col">
            <motion.h3 layoutId={`title-${p.slug}`} className="text-xl font-bold uppercase mb-1 drop-shadow-md">
              {p.title}
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
  onNext, 
  onPrev, 
  index 
}: { 
  projects: Project[];
  onNext: () => void;
  onPrev: () => void;
  total: number;
  index: number;
}) {
  // Grab only the last 5 projects
  const sliderProjects = projects.slice(-5);

  return (
    <motion.div className=" inset-0 w-full h-full flex overflow-hidden">
      
      {/* Controls Overlay */}
      <div className="absolute inset-x-0 bottom-10 md:inset-0 flex items-center justify-between px-6 z-50 mix-blend-difference pointer-events-none">
        <button onClick={onPrev} className="uppercase tracking-widest text-sm pointer-events-auto hover:opacity-70 text-white">Prev</button>
        <button onClick={onNext} className="uppercase tracking-widest text-sm pointer-events-auto hover:opacity-70 text-white">Next</button>
      </div>

      <AnimatePresence initial={false}>
        {sliderProjects.map((p, i) => {
          // Determine the state of each item relative to the current index
          const isActive = i === index;
          const isNext = i === index + 1;
          
          // If we are at the last item, let it take 100% width since there is no next item
          const isLastActive = isActive && index === sliderProjects.length - 1;

          let width = "0%";
          let opacity = 0;

          if (isActive) {
            width = isLastActive ? "100%" : "60%";
            opacity = 1;
          } else if (isNext) {
            width = "40%"; 
            opacity = 1; // Keep opacity 1 so the image acts as a clear preview
          }

          // Don't render items that are totally out of view to keep the DOM clean
          if (width === "0%") return null;

          return (
            <motion.div 
              key={p.slug}
              layoutId={`project-container-${p.slug}`}
              initial={{ width: "0%", opacity: 0 }}
              animate={{ width, opacity }}
              exit={{ width: "0%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="h-full relative overflow-hidden flex flex-col justify-end border-r border-white/10 shrink-0"
            >
              {/* Background Image */}
              {p.img0 && (
                <motion.img
                  layoutId={`image-${p.slug}`}
                  src={p.img0}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover z-0 will-change-transform" 
                  // Dim the "next" image slightly so the active one stands out
                  animate={{ filter: isActive ? "brightness(1)" : "brightness(0.5)" }}
                />
              )}

              {/* Gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

              {/* Typography - using min-w-[60vw] prevents text reflow/wrapping while width shrinks */}
              <motion.div 
                animate={{ opacity: isActive ? 1 : 0 }}
                className="relative z-20 flex justify-between items-end min-w-[60vw] md:min-w-[100vw] p-8 md:p-16 text-white"
              >
                <div className="flex flex-col">
                  <motion.h1 layoutId={`date-${p.slug}`} className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
                    {p.date}
                  </motion.h1>
                  <motion.p layoutId={`title-${p.slug}`} className="text-xl md:text-3xl font-light mt-2">
                    {p.title}
                    {p.goTo && <span className="text-sm uppercase tracking-widest opacity-60 ml-2">{p.goTo}</span>}
                  </motion.p>
                </div>
                
                {/* Index Tracker */}
                <div className="hidden md:block text-3xl font-light mb-2">
                  0{i + 1}. <span className="text-lg opacity-50">/ 0{sliderProjects.length}.</span>
                </div>
              </motion.div>

              {/* Clickable overlay on the "Next" slice so users can just tap the image to advance */}
              {isNext && (
                <div 
                  className="absolute inset-0 z-30 cursor-pointer" 
                  onClick={onNext}
                  title="Next Project"
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}