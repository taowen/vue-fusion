import { isArray } from '@vue/shared'
import { HElement } from './nodeOps'

export function triggerEvent(
  el: HElement,
  event: string,
  payload: any[] = []
) {
  const { eventListeners } = el
  if (eventListeners) {
    const listener = eventListeners[event]
    if (listener) {
      if (isArray(listener)) {
        for (let i = 0; i < listener.length; i++) {
          listener[i](...payload)
        }
      } else {
        listener(...payload)
      }
    }
  }
}