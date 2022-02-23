# About

vue-fusion render vue application in server side (SSR) with data provided by Java (Python, Go), deliver the page to end-user via CDN cache, hydrate the page in client side with exact same vue application code.

Frontend and backend fused together, TypeScript/Java/Python/Go fused together, for extreme user experience.

It features:

* page loads instantly because it is just html served via CDN cache
* even dynamic page can be cached via CDN, data can be refreshed again in client side
* same code for both client side rendering (CSR) and SSR
* with polyglot GraalVM, eliminates extra backend for frontend (BFF) service
* headless and backendless, not opinionated, work seamlessly along with existing ui library, backend languages and infrastructure
* data security is not an option, enforced hardened authorization solution
* miniprogram silent OTA with [taro](https://github.com/NervJS/taro), [quickjs](https://bellard.org/quickjs/), [emscripten](https://emscripten.org/)