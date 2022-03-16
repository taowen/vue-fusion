import { markRaw } from 'vue'
import { nextTick, InjectionKey, App } from 'vue';
import { isArray } from '@vue/shared';
import { isOn } from '@vue/shared'

const dirtyElements = new Set<HElement>();

export interface Event {
  type: string,
  bubbles?: boolean,
  stopPropagation(): void;
}

export const enum NodeTypes{
  ELEMENT = 1,
  TEXT = 3,
  COMMENT = 8
};

export const enum NodeOpTypes {
  CREATE = 'create',
  INSERT = 'insert',
  REMOVE = 'remove',
  SET_TEXT = 'setText',
  SET_ELEMENT_TEXT = 'setElementText',
  PATCH = 'patch'
}

export interface HFragment {
  id: string
  parentNode: HElement | null
  children: HNode[]
}

export class HElement {
  id = `elem${nodeId++}`;
  parentNode: HElement | null = null;
  tagName: string = '';
  children: HNode[] = [];
  fragments: HFragment[] | null = null;
  props: Record<string, any> = {};
  eventListeners: Record<string, Function | Function[]> | null = null
  pageId?: string;
  __vue_app__?: App<HElement>;

  constructor(init?: Partial<HElement>) {
    Object.assign(this, init);
  }

  get nodeType() {
    return 1 as const;
  }

  hasChildNodes() {
    return this.children.length > 0;
  }
  
  get ascendantFragment(): HFragment | null {
    if (!this.parentNode) {
      return null;
    }
    if (this.parentNode.fragments) {
      for (const fragment of this.parentNode.fragments) {
        if (fragment.children.includes(this)) {
          return fragment;
        }
      }
      return null;
    }
    return this.parentNode.ascendantFragment;
  }

  get root(): HElement {
    if(this.parentNode) {
      return this.parentNode.root;
    }
    return this;
  }

  get firstChild() {
    return this.children[0];
  }

  get textContent() {
    return this.children.map(node => (node as any).textContent || '').join('');
  }

  getElementById(id: string): HElement | null {
    if (this.id === id || this.props?.id === id) {
      return this;
    }
    for (const child of this.children) {
      if (child.nodeType === NodeTypes.ELEMENT) {
        const found = child.getElementById(id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  triggerEvent(event: Event) {
    if (this.eventListeners) {
        const listener = this.eventListeners[event.type]
        if (listener) {
            if (isArray(listener)) {
                for (let i = 0; i < listener.length; i++) {
                    listener[i](event)
                }
            } else {
                listener(event)
            }
        }
    }
    if (this.parentNode && event.bubbles) {
      this.parentNode.triggerEvent(event);
    }
  }

  get app(): App<HElement> | null {
    if (this.__vue_app__) {
      return this.__vue_app__;
    }
    if (this.parentNode) {
      return this.parentNode.app;
    }
    return null;
  }

  markDirty() {
    const shouldFlush = dirtyElements.size === 0;
    dirtyElements.add(this);
    if (!shouldFlush) {
      return;
    }
    nextTick(() => {
      const toFlush = Array.from(dirtyElements);
      dirtyElements.clear();
      const app = this.app;
      if (app) {
        const flushElements = app._context.provides[flushElementsKey as any];
        if (flushElements) {
          try {
            flushElements(toFlush);
          } catch(e) {
            console.error(`failed to flushElements: ${e}`);
          }
        }
      }
    });
  }
}

export class HText {
  parentNode: HElement | null = null;
  textContent: string = '';

  constructor(init?: Partial<HText>) {
    Object.assign(this, init);
  }

  get nodeType() {
    return 3 as const;
  }
}

export class HComment {
  parentNode: HElement | null = null;
  text: string = '';

  constructor(init?: Partial<HComment>) {
    Object.assign(this, init);
  }

  get nodeType() {
    return 8 as const;
  }
}

export type HNode = HElement | HText | HComment

export interface NodeOp {
  type: NodeOpTypes
  nodeType?: NodeTypes
  tag?: string
  text?: string
  targetNode?: HNode
  parentNode?: HElement
  refNode?: HNode | null
  propKey?: string
  propPrevValue?: any
  propNextValue?: any
}

let nodeId: number = 1
let recordedNodeOps: NodeOp[] = []

export function resetNodeId() {
  nodeId = 1;
}

export function logNodeOp(op: NodeOp) {
  recordedNodeOps.push(op)
}

export function resetOps() {
  recordedNodeOps = []
}

export function dumpOps(): NodeOp[] {
  const ops = recordedNodeOps.slice()
  resetOps()
  return ops
}

function createElement(tagName: string): HElement {
  const node = new HElement({ tagName });
  logNodeOp({
    type: NodeOpTypes.CREATE,
    nodeType: node.nodeType,
    targetNode: node,
    tag: tagName
  })
  // avoid test nodes from being observed
  markRaw(node)
  return node
}

function createText(textContent: string): HText {
  const node = new HText({ textContent });
  logNodeOp({
    type: NodeOpTypes.CREATE,
    nodeType: node.nodeType,
    targetNode: node,
    text: textContent
  })
  // avoid test nodes from being observed
  markRaw(node)
  return node
}

function createComment(text: string): HComment {
  const node = new HComment({ text });
  logNodeOp({
    type: NodeOpTypes.CREATE,
    nodeType: node.nodeType,
    targetNode: node,
    text
  })
  // avoid test nodes from being observed
  markRaw(node)
  return node
}

function setText(node: HText, text: string) {
  logNodeOp({
    type: NodeOpTypes.SET_TEXT,
    targetNode: node,
    text
  })
  node.textContent = text
}

function insert(child: HNode, parent: HElement, ref?: HNode | null) {
  let refIndex
  if (ref) {
    refIndex = parent.children.indexOf(ref)
    if (refIndex === -1) {
      console.error('ref: ', ref)
      console.error('parent: ', parent)
      throw new Error('ref is not a child of parent')
    }
  }
  logNodeOp({
    type: NodeOpTypes.INSERT,
    targetNode: child,
    parentNode: parent,
    refNode: ref
  })
  // remove the node first, but don't log it as a REMOVE op
  remove(child, false)
  // re-calculate the ref index because the child's removal may have affected it
  refIndex = ref ? parent.children.indexOf(ref) : -1
  if (refIndex === -1) {
    parent.children.push(child)
    child.parentNode = parent
  } else {
    parent.children.splice(refIndex, 0, child)
    child.parentNode = parent
  }
}

function remove(child: HNode, logOp = true) {
  const parent = child.parentNode
  if (parent) {
    if (logOp) {
      logNodeOp({
        type: NodeOpTypes.REMOVE,
        targetNode: child,
        parentNode: parent
      })
    }
    const i = parent.children.indexOf(child)
    if (i > -1) {
      parent.children.splice(i, 1)
    } else {
      console.error('target: ', child)
      console.error('parent: ', parent)
      throw Error('target is not a childNode of parent')
    }
    child.parentNode = null
  }
}

function setElementText(el: HElement, textContent: string) {
  logNodeOp({
    type: NodeOpTypes.SET_ELEMENT_TEXT,
    targetNode: el,
    text: textContent
  })
  el.children.forEach(c => {
    c.parentNode = null
  })
  if (!textContent) {
    el.children = []
  } else {
    el.children = [
      new HText({ textContent, parentNode: el })
    ]
  }
  el.markDirty();
}

function parentNode(node: HNode): HElement | null {
  return node.parentNode
}

function nextSibling(node: HNode): HNode | null {
  const parent = node.parentNode
  if (!parent) {
    return null
  }
  const i = parent.children.indexOf(node)
  return parent.children[i + 1] || null
}

function querySelector(): never {
  throw new Error('querySelector not supported in test renderer.')
}

function setScopeId(el: HElement, id: string) {
  el.props[id] = ''
}

function attachToPage(el: HElement, pageId: string) {
  el.pageId = pageId;
  el.markDirty();
}

function patchProp(
  el: HElement,
  key: string,
  prevValue: any,
  nextValue: any
) {
  logNodeOp({
    type: NodeOpTypes.PATCH,
    targetNode: el,
    propKey: key,
    propPrevValue: prevValue,
    propNextValue: nextValue
  })
  el.props[key] = nextValue
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    (el.eventListeners || (el.eventListeners = {}))[event] = nextValue;
  }
  el.markDirty();
}

export const flushElementsKey = Symbol() as InjectionKey<(elements: HElement[]) => void>;

export const nodeOps = {
  insert,
  remove,
  createElement,
  createText,
  createComment,
  setText,
  setElementText,
  parentNode,
  nextSibling,
  querySelector,
  setScopeId,
  attachToPage,
  patchProp,
}