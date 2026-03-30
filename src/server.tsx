// src/server.ts
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { paraglideMiddleware } from './paraglide/server' 

export default createServerEntry({
  fetch(request: Request) {


    // 1. Clone the headers and strip the navigation flag
    const headers = new Headers(request.headers);
    headers.delete('sec-fetch-dest');

    // 2. Create a "stealth" request. 
    // Without 'sec-fetch-dest: document', Paraglide skips the 307 redirect 
    // and correctly accepts '/es' as the locale source of truth!
    const stealthRequest = new Request(request.url, {
      method: request.method,
      headers: headers,
      body: request.body,
      // @ts-expect-error - Prevents Node stream consumption errors
      duplex: 'half'
    });

    // 3. Pass the stealth request to Paraglide to set up the locale memory,
    // but pass the ORIGINAL request to your app router.
    return paraglideMiddleware(stealthRequest, () => handler.fetch(request));
  },
})