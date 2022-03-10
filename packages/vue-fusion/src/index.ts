import {
    createRenderer,
    RootRenderFunction,
    CreateAppFunction
  } from '@vue/runtime-core'
  import { nodeOps, HElement } from './nodeOps'
  import { patchProp } from './patchProp'
  import { extend } from '@vue/shared'
  
  const { render: baseRender, createApp: baseCreateApp } = createRenderer(
    extend({ patchProp }, nodeOps)
  )
  
  export const render = baseRender as RootRenderFunction<HElement>
  export const createApp = baseCreateApp as CreateAppFunction<HElement>
  
  export * from './triggerEvent'
  export * from './serialize'
  export * from './nodeOps'
  export * from './renderToMpData'
  export * from './servePage'
  export * from '@vue/runtime-core'