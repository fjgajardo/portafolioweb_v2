// src/client.tsx
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client' // <-- New import path!
import { setLocale } from './paraglide/runtime'

// 1. Read the locale straight from the server-rendered HTML tag
const serverLocale = document.documentElement.lang || 'es'

// 2. Sync Paraglide to the exact locale the server used BEFORE hydration
setLocale(serverLocale as any)

// 3. Hydrate the app (no router prop needed anymore!)
hydrateRoot(document, <StartClient />)