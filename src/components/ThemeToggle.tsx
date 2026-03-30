import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

// Removed 'auto' - it is now strictly a binary choice
type ThemeMode = 'light' | 'dark'

function getInitialMode(): ThemeMode {
  // Safe fallback for Server-Side Rendering
  if (typeof window === 'undefined') {
    return 'light' 
  }

  // 1. Check if the user has a saved preference
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  // 2. If no saved preference, default to system preference immediately
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  function toggleMode() {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const label = `Theme mode: ${mode}. Click to switch to ${mode === 'light' ? 'dark' : 'light'} mode.`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      // Removed the static text color to allow the icons to dictate their own colors
      className="flex items-center justify-center rounded-full bg-[var(--chip-bg)] p-2 shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {!mounted ? (
        <span className="h-5 w-5 opacity-0" />
      ) : mode === 'light' ? (
        <Moon className="h-5 w-5 text-indigo-400" strokeWidth={2} />
        
      ) : (
        <Sun className="h-5 w-5 text-amber-200" strokeWidth={2} />
        
      )}
    </button>
  )
}