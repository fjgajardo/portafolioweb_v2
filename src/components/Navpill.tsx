import { Home, PhoneCall, Presentation, User } from 'lucide-react'
import { AnimatedBackground } from '../../components/motion-primitives/animated-background'
import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
// import { LanguageSwitcher } from './LanguageSwitcher'
import React, { useRef, useState } from 'react'
import useMeasure from 'react-use-measure'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'
import useClickOutside from '../../hooks/useClickOutside'
import * as m from '../paraglide/messages'

const contact = {
  id: 2,
  label: 'Contacto',
  to: '',
  icon: <PhoneCall className="h-5 w-5" />,
  content: (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row gap-10">
        <div>
          <p className="font-mono text-primary label-large">
            {m.contact_info_email()}
          </p>
          <h1 className="display-small font-body text-on-surface">
            fjgajardo@uc.cl
          </h1>
        </div>
        <div>
          <img
            src="../../public/qr.png"
            alt="QR code"
            className="object-cover h-25 opacity-80"
          />
        </div>
      </div>

      <div className="flex flex-row gap-10">
        <div>
          <p className="font-mono text-primary label-medium">
            {m.contact_info_phone()}
          </p>
          <h1 className="headline-small font-body text-on-surface">
            +56977092131
          </h1>
        </div>
        <div>
          <p className="font-mono text-primary label-medium">
            {m.contact_info_linkedin()}
          </p>
          <a
            href="https://www.linkedin.com/in/fernando-gajardo/"
            className="headline-medium font-body text-secondary underline"
          >
            Perfil de LinkedIn
          </a>
        </div>
      </div>
    </div>
  ),
}

const ITEMS = [
  {
    id: 0,
    label: 'Home',
    to: '/',
    icon: <Home className="h-5 w-5" />,
    content: '',
  },
  {
    id: 1,
    label: 'About',
    to: '/about',
    icon: <User className="h-5 w-5" />,
    content: '',
  },
]

export function NavPill() {
  const [active, setActive] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Track width instead of height for the side expansion
  const [contentRef, { width: widthContent }] = useMeasure()

  useClickOutside(ref, () => {
    setIsOpen(false)
    setActive(null)
  })

  const isSelected = active === contact.id

  return (
    <MotionConfig
      transition={{
        type: 'spring',
        bounce: 0.1,
        duration: 0.25,
      }}
    >
      <div className="fixed inset-y-0 left-0 flex items-center m-10 z-200">
        {/* 1. New Flex Row wrapper. Ref goes here so clicking outside EITHER panel closes it */}
        <div ref={ref} className="flex flex-row items-center relative">
          {/* Main Nav Pill (z-10 ensures it sits on top of the sliding animation) */}
          <div className="flex flex-col gap-1 p-2 glass_effect relative z-10">
            <AnimatedBackground
              className="rounded-lg bg-surface-container-highest"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.3,
              }}
              enableHover
            >
              {ITEMS.map((item) => (
                <Link
                  key={item.label}
                  onClick={() => {
                    if (!isOpen) setIsOpen(true)
                    if (active === item.id) {
                      setIsOpen(false)
                      setActive(null)
                      return
                    }
                    setActive(item.id)
                  }}
                  to={item.to}
                  data-id={item.label}
                  className="inline-flex h-10 w-10 items-center justify-center transition-colors duration-100 hover:text-on-surface hover:rounded-lg"
                  activeProps={{
                    className:
                      'bg-surface-container-high rounded-lg is-active text-primary',
                  }}
                  inactiveProps={{
                    className: 'text-on-surface-variant',
                  }}
                >
                  {item.icon}
                </Link>
              ))}
            </AnimatedBackground>

            <div className="inline-flex h-10 w-10 items-center justify-center transition-colors duration-100 hover:text-on-surface hover:rounded-lg ">
              <button
                key={contact.id}
                aria-label={contact.label}
                className={cn(
                  'relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-on-surface transition-colors hover:surface-container-highest hover:text-on-surface focus-visible:ring-2 cursor-pointer ',
                  active === contact.id
                    ? 'bg-surface-container-high text-primary'
                    : '',
                )}
                type="button"
                onClick={() => {
                  if (!isOpen) setIsOpen(true)
                  if (active === contact.id) {
                    setIsOpen(false)
                    setActive(null)
                    return
                  }
                  setActive(contact.id)
                }}
              >
                {contact.icon}
              </button>
            </div>

            <hr className="text-outline-variant mx-1" />
            <ThemeToggle />
            {/* <LanguageSwitcher /> */}
          </div>

          {/* 2. Side Panel Flyout */}
          <AnimatePresence initial={false} mode="sync">
            {isOpen && isSelected && (
              <motion.div
                key="side-content"
                initial={{ width: 0, opacity: 0, x: -15 }}
                animate={{ width: widthContent || 0, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -15 }}
                className="overflow-hidden ml-2 z-0"
              >
                {/* Apply glass_effect to the panel. w-max ensures useMeasure reads the true width */}
                <div ref={contentRef} className="glass_effect p-5 w-max ">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.05 }} // Slight delay to let the slide out start first
                  >
                    {contact.content}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}
