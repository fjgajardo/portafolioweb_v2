// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { deLocalizeUrl, localizeUrl, getLocale } from './paraglide/runtime' 

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => {
        // Fetch the active locale
        const currentLocale = getLocale(); 
        
        // Pass it as an object property: { locale: currentLocale }
        return localizeUrl(url, { locale: currentLocale }); 
      },
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}