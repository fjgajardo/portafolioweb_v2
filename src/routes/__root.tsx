import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { NavPill } from '../components/Navpill'
import appCss from '../styles.css?url'
import { getLocale } from '#/paraglide/runtime'
import Header from '#/components/Header'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`



export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Fernando Gajardo',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={ getLocale() } suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <div className='gradient-background'></div>
      <body className="font-body antialiased bg-surface [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <NavPill />
        <Header/>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
