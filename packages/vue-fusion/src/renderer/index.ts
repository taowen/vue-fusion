import {
  Component, CreateAppFunction, createHydrationRenderer,
  RootRenderFunction
} from 'vue'
import { HElement, nodeOps } from './HNode'
import { App } from 'vue';
import { Router } from 'vue-router';

const { render: baseRender, createApp: baseCreateApp } = createHydrationRenderer(
  nodeOps as any
)

export const render = baseRender as any as RootRenderFunction<HElement>
export const createApp: CreateAppFunction<HElement> = (rootComponent: Component, rootProps?: Record<string, unknown> | null) => {
  const app = baseCreateApp(rootComponent, rootProps)
  const { mount } = app;
  app.mount = (rootContainer) => {
    return mount(rootContainer, (rootContainer as any).hasChildNodes());
  }
  return app as any;
}

export * from './HNode'
export * from './JNode'
export * from './styled'
export { defineComponent, nextTick, h, Fragment } from 'vue';
export type { App } from 'vue'
export const $app = {
    create: (): { app: App, router: Router } => {
        throw new Error('$app not injected');
    }
}