'use client';
import type {
  ReactNode} from 'react';
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Transition} from 'motion/react';
import { motion, useMotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

export type CarouselContextType = {
  index: number;
  setIndex: (newIndex: number) => void;
  itemsCount: number;
  setItemsCount: (newItemsCount: number) => void;
  disableDrag: boolean;
};

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within an CarouselProvider');
  }
  return context;
}

export type CarouselProviderProps = {
  children: ReactNode;
  initialIndex?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
};

function CarouselProvider({
  children,
  initialIndex = 0,
  onIndexChange,
  disableDrag = false,
}: CarouselProviderProps) {
  const [index, setIndex] = useState<number>(initialIndex);
  const [itemsCount, setItemsCount] = useState<number>(0);

  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  return (
    <CarouselContext.Provider
      value={{
        index,
        setIndex: handleSetIndex,
        itemsCount,
        setItemsCount,
        disableDrag,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

export type CarouselProps = {
  children: ReactNode;
  className?: string;
  initialIndex?: number;
  index?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
};

function Carousel({
  children,
  className,
  initialIndex = 0,
  index: externalIndex,
  onIndexChange,
  disableDrag = false,
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState<number>(initialIndex);
  const isControlled = externalIndex !== undefined;
  const currentIndex = isControlled ? externalIndex : internalIndex;

  const handleIndexChange = (newIndex: number) => {
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    onIndexChange?.(newIndex);
  };

  return (
    <CarouselProvider
      initialIndex={currentIndex}
      onIndexChange={handleIndexChange}
      disableDrag={disableDrag}
    >
      <div className={cn('group/hover relative h-full', className)}>
        <div className='overflow-hidden h-full'>{children}</div>
      </div>
    </CarouselProvider>
  );
}

export type CarouselNavigationProps = {
  className?: string;
  classNameButtonLeft?: string;
  classNameButtonRight?: string;
  classNameButton?: string;
  alwaysShow?: boolean;
};

function CarouselNavigation({
  className,
  classNameButtonLeft,
  classNameButtonRight,
  classNameButton,
  alwaysShow,
}: CarouselNavigationProps) {
  const { index, setIndex, itemsCount } = useCarousel();

  return (
    <div
      className={cn(
        'absolute -top-1/15 right-0 flex z-50 text-on-surface-variant font-mono label-medium gap-4 mr-5',
        className
      )}
    >
      <button
        type='button'
        aria-label='Previous slide'
        className={cn(
          'uppercase tracking-widest pointer-events-auto hover:opacity-70',
          alwaysShow
            ? 'opacity-100'
            : 'opacity-0 group-hover/hover:opacity-100',
          alwaysShow
            ? 'disabled:opacity-40'
            : 'group-hover/hover:disabled:opacity-40',
            classNameButton,
        )}
        disabled={index === 0}
        onClick={() => {
          if (index > 0) {
            setIndex(index - 1);
          }
        }}
      >
        {classNameButtonLeft}
      </button>
      <button
        type='button'
        className={cn(
          'uppercase tracking-widest pointer-events-auto hover:opacity-70',
          alwaysShow
            ? 'opacity-100'
            : 'opacity-0 group-hover/hover:opacity-100',
          alwaysShow
            ? 'disabled:opacity-40'
            : 'group-hover/hover:disabled:opacity-40',
            classNameButton,
        )}
        aria-label='Next slide'
        disabled={index + 1 === itemsCount}
        onClick={() => {
          if (index < itemsCount - 1) {
            setIndex(index + 1);
          }
        }}
      >
        {classNameButtonRight}
      </button>
    </div>
  );
}

export type CarouselIndicatorProps = {
  className?: string;
  classNameButton?: string;
};

function CarouselIndicator({
  className,
  classNameButton,
}: CarouselIndicatorProps) {
  const { index, itemsCount, setIndex } = useCarousel();

  return (
    <div
      className={cn(
        'absolute bottom-0 z-10 flex w-full items-center justify-center',
        className
      )}
    >
      <div className='flex space-x-2'>
        {Array.from({ length: itemsCount }, (_, i) => (
          <button
            key={i}
            type='button'
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              'h-2 w-2 rounded-full transition-opacity duration-300',
              index === i
                ? 'bg-zinc-950 dark:bg-zinc-50'
                : 'bg-zinc-900/50 dark:bg-zinc-100/50',
              classNameButton
            )}
          />
        ))}
      </div>
    </div>
  );
}

export type CarouselContentProps = {
  children: ReactNode;
  className?: string;
  transition?: Transition;
};

function CarouselContent({
  children,
  className,
  transition,
}: CarouselContentProps) {
  // 1. Destructure itemsCount from the context
  const { index, setIndex, setItemsCount, disableDrag, itemsCount } = useCarousel();
  const [visibleItemsCount, setVisibleItemsCount] = useState(1);
  const [itemOffset, setItemOffset] = useState(0);
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsLength = Children.count(children);
  
  // 2. Add a ref to manage the scroll cooldown
  const isWheelLocked = useRef(false);

  // Measure offset useEffect... (Keep your existing code here)
  useEffect(() => {
    if (!containerRef.current) return;
    const measureOffset = () => {
      const container = containerRef.current;
      if (!container || container.children.length === 0) return;
      const firstChild = container.children[0] as HTMLElement;
      const style = window.getComputedStyle(container);
      const gap = parseFloat(style.gap) || 0;
      setItemOffset(firstChild.offsetWidth + gap);
    };
    measureOffset();
    window.addEventListener('resize', measureOffset);
    return () => window.removeEventListener('resize', measureOffset);
  }, [children]);

  // Sync items count useEffect... (Keep your existing code here)
  useEffect(() => {
    if (!itemsLength) return;
    setItemsCount(itemsLength);
  }, [itemsLength, setItemsCount]);

  // 3. NEW: Add the Wheel Event Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Stop the browser from scrolling down the page
      e.preventDefault();

      if (isWheelLocked.current) return;

      // Capture the dominant scroll direction (handles both vertical mice and trackpad horizontal scrolling)
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      // Minimum threshold to prevent trackpad micro-jitters
      if (Math.abs(delta) > 10) {
        isWheelLocked.current = true;

        if (delta > 0 && index < itemsCount - 1) {
          setIndex(index + 1); // Scroll down/right -> Next image
        } else if (delta < 0 && index > 0) {
          setIndex(index - 1); // Scroll up/left -> Previous image
        }

        // Lock scrolling for 400ms to allow the animation to play out
        setTimeout(() => {
          isWheelLocked.current = false;
        }, 400); 
      }
    };

    // { passive: false } is strictly required so we can call e.preventDefault()
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [index, itemsCount, setIndex]);

  return (
    <motion.div
      animate={{ x: -(index * itemOffset) }}
      transition={
        transition || {
          damping: 18,
          stiffness: 90,
          type: 'spring',
          duration: 0.2,
        }
      }
      className={cn(
        'flex items-center',
        !disableDrag && 'cursor-grab active:cursor-grabbing',
        className
      )}
      ref={containerRef}
    >
      {children}
    </motion.div>
  );
}

export type CarouselItemProps = {
  children: ReactNode;
  className?: string;
};

function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <motion.div
      className={cn(
        'w-full min-w-0 shrink-0 grow-0 overflow-hidden',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
  useCarousel,
};
