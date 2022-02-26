import App from './App'
import { createSSRApp } from 'vue'
import { createRouter } from './router'

import * as A from '@motherboard';
import * as B from 'demo-motherboard';

let a: typeof A = undefined as any;
let b: typeof B = undefined as any;
a = b;

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}
