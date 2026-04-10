import { Home, PhoneCall, Presentation, User } from 'lucide-react'
import { AnimatedBackground } from '../../components/motion-primitives/animated-background'
import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'

export function NavPill() {
  const TABS = [
    {
      label: 'Home',
      to: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: 'About',
      to: '/about',
      icon: <User className="h-5 w-5" />,
    },
    {
      label: 'Contacto',
      to: '/contact',
      icon: <PhoneCall className="h-5 w-5" />,
    },
  ]

  return (
    <div className="fixed inset-y-0 left-0 flex items-center m-10 z-200">
      <div className="flex flex-col rounded-xl gap-1  p-2 glass_effect">
        <AnimatedBackground
          className="rounded-lg bg-surface-container-highest"
          transition={{
            type: 'spring',
            bounce: 0.2,
            duration: 0.3,
          }}
          enableHover
        >
          {TABS.map((tab) => (
            <Link
              key={tab.label}
              to={tab.to}
              data-id={tab.label}
              // 1. Base classes (NO text color here)
              className="inline-flex h-10 w-10 items-center justify-center transition-colors duration-100 hover:text-on-surface hover:rounded-lg"
              // 2. Applied ONLY when active
              activeProps={{
                className:
                  'bg-surface-container-high rounded-lg is-active text-primary',
              }}
              // 3. Applied ONLY when inactive
              inactiveProps={{
                className: 'text-on-surface-variant',
              }}
              activeOptions={{ exact: tab.to === '/' }}
            >
              {tab.icon}
            </Link>
          ))}
        </AnimatedBackground>
        <hr className="text-outline-variant mx-1" />
        <ThemeToggle />
        {/* <LanguageSwitcher /> */}
      </div>
    </div>
  )
}
