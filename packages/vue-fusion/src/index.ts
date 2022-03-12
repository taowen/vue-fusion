import {
  Component, CreateAppFunction, createHydrationRenderer,
  RootRenderFunction
} from '@vue/runtime-core'
import { extend } from '@vue/shared'
import { HElement, nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const { render: baseRender, createApp: baseCreateApp } = createHydrationRenderer(
  extend({ patchProp }, nodeOps) as any
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

export * from '@vue/runtime-core'
export * from './nodeOps'
export * from './renderToMpData'
export * from './serialize'
export * from './servePage'
export * from './triggerEvent'
export * from './onPageLoad'
