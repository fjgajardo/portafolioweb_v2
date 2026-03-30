// src/components/LanguageSwitcher.tsx
import { useRouter } from '@tanstack/react-router'
import { setLocale, locales, getLocale } from '../paraglide/runtime'

export function LanguageSwitcher() {
  const router = useRouter()
  const currentLanguage = getLocale()

  const handleLanguageChange = (newLang: string) => {
    // 1. Actualizas el estado interno de Paraglide
    setLocale({ locale: newLang })
    
    // 2. Le dices a TanStack Router que recargue la ruta actual 
    // para que la URL se actualice (ej: de /proyectos a /en/proyectos)
    router.invalidate() 
  }

  return (
    <div className="flex gap-2">
      {locales.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`px-3 py-1 border ${
            currentLanguage === lang ? 'bg-black text-white' : 'bg-transparent'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}