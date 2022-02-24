# About

vue-fusion render vue application in server side (SSR) with data provided by Java (Python, Go), deliver the page to end-user via CDN cache, hydrate the page in client side with exact same vue application code.

Frontend and backend fused together, TypeScript/Java/Python/Go fused together, for extreme user experience.

It features:

* fast initial load time
  * page loads instantly because it is just html served via CDN cache
  * even dynamic page can be cached via CDN, data can be refreshed again in client side
  * same code for both client side rendering (CSR) and SSR
  * server only component to reduce code bundle size to download
  * selective hydration to run as little code initially as possible
* fast interaction
  * second page switch to use client side routing
  * manage the initial page loading as well as RPC command and queries
  * data security is not an option, enforced hardened authorization solution
  * batch RPC command and queries originated from multiple components in single RPC roundtrip
* headless and backendless
  * not opinionated, work seamlessly along with existing vue components, backend languages and infrastructure
  * with polyglot GraalVM, eliminates extra backend for frontend (BFF) service
  * provides example of how to integrate with popular backend languages, in a type safe way
  * integrate with miniprogram via adapter powered by  [taro](https://github.com/NervJS/taro), [quickjs](https://bellard.org/quickjs/), [emscripten](https://emscripten.org/)
  * turn existing RESTful data access code into secured GraphQL open api for 3rd party service/UI integration

  vue-fusion is opinionated about how initial page/code loads, how client/server talk to each other to transfer state as efficient as possible.

  vue-fusion is liberated about everything else (headless and backendless).
