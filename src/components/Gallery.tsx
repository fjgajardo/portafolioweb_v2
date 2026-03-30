import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal, type SetStateAction } from 'react';
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
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* Global Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
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
            project={projects[currentIndex]} 
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

function FullscreenSlider({ project, onNext, onPrev, total, index }) {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center w-full h-full">
      <motion.div 
        layoutId={`slug-${project.slug}`} 
        className="w-full h-full bg-neutral-800 flex flex-col justify-end p-8 md:p-16 relative"
      >
        {/* ADD THE IMAGE HERE */}
        {project.img0 && (
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
            layoutId={`image-${project.slug}`}
            src={project.img0}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 will-change-transform" 
          />
        )}
        {/* Playback / Next Prev Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-6 z-20 mix-blend-difference pointer-events-none">
          <button onClick={onPrev} className="uppercase tracking-widest text-sm pointer-events-auto hover:opacity-70">Prev</button>
          <button onClick={onNext} className="uppercase tracking-widest text-sm pointer-events-auto hover:opacity-70">Next</button>
        </div>

        {/* Project Typography */}
        <div className="relative z-10 flex justify-between items-end w-full">
          <div className="flex flex-col">
            <motion.h1 layoutId={`date-${project.slug}`} className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
              {project.date}
            </motion.h1>
            <motion.p layoutId={`title-${project.slug}`} className="text-xl md:text-3xl font-light mt-2">
              {project.title}<span className="text-sm uppercase tracking-widest opacity-60">{project.goTo}</span>
            </motion.p>
          </div>
          
          {/* Index Tracker */}
          <div className="hidden md:block text-3xl font-light mb-2">
            0{index + 1}. <span className="text-lg opacity-50">/ 0{total}.</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}