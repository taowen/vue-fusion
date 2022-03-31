import {
  HElement,
  HNode,
  nodeOps,
} from './HNode';
import { NodeTypes } from './HNode';

let fragmentId = 1;

export function resetFragmentId() {
  fragmentId = 1;
}

export function encodePageUpdates(dirtyElements: HElement[]) {
  const changes = [];
  const changedFragmentIds = new Set();
  const changedPageIds = new Set();
  for (const elem of dirtyElements) {
    const root = elem.root;
    const pageId = root.pageId;
    if (!pageId) {
      throw new Error('can not encodePage before attachToPages');
    }
    if (changedPageIds.has(pageId)) {
      continue;
    }
    if (root === elem) {
      changes.push([pageId, '', encodeNode(elem).children]);
      changedPageIds.add(pageId);
    } else {
      const fragment = elem.ascendantFragment;
      if (!fragment) {
        continue;
      }
      if(changedFragmentIds.has(fragment.id)) {
        continue;
      }
      changedFragmentIds.add(fragment.id);
      changes.push([pageId, fragment.id, fragment.children.map(c => encodeNode(c))])
    }
  }
  return changes;
}

export function encodeNode(node: HNode): any {
  if (node.nodeType === NodeTypes.COMMENT) {
    return `<!--${node.data}-->`;
  } else if (node.nodeType === NodeTypes.TEXT) {
    return node.textContent;
  }
  const layerNumber = getLayerNumber(node);
  if (layerNumber > 0 && layerNumber < 4) {
    return {
      tag: node.tagName,
      id: node.id,
      ...translateProps(node.props),
      children: node.children.map(n => encodeNode(n)).filter(n => n !== '')
    }
  }
  if (!node.fragments) {
    node.fragments = [];
  }
  for (const fragment of node.fragments) {
    fragment.children.length = 0;
  }
  for (const [i, child] of node.children.entries()) {
    const j = Math.trunc(i / 9);
    let fragment = node.fragments[j];
    if (!fragment) {
      node.fragments.length = j + 1;
      node.fragments[j] = fragment = {
        id: `fragment${fragmentId++}`,
        parentNode: node,
        children: []
      };
    }
    fragment.children.push(child);
  }
  return {
    tag: node.tagName,
    id: node.id,
    ...translateProps(node.props),
    children: node.fragments.map(fragment => {
      return { tag: 'fragment', id: fragment.id, children: fragment.children.map(n => encodeNode(n)).filter(n => n !== '') };
    })
  }
}

export function decodeNode(jnode: any): HNode {
  if (typeof jnode === 'string') {
    if (jnode.startsWith('<!--') && jnode.endsWith('-->')) {
      return nodeOps.createComment(jnode.substring('<!--'.length, jnode.length - '-->'.length));
    }
    return nodeOps.createText(jnode);
  }
  const hnode = nodeOps.createElement(jnode.tag);
  for (const [k, v] of Object.entries(jnode)) {
    if (k === 'tag' || k === 'children') {
      continue;
    }
    hnode.props[k] = v;
  }
  if (!jnode.children || !jnode.children[0]) {
    return hnode;
  }
  let children = [];
  if (jnode.children[0].tag === 'fragment') {
    for (const fragment of jnode.children) {
      for (const child of fragment.children) {
        children.push(child);
      }
    }
  } else {
    children = jnode.children;
  }
  for (const child of children) {
    if (!child) {
      continue;
    }
    const childHNode = decodeNode(child);
    hnode.children.push(childHNode);
    childHNode.parentNode = hnode;
  }
  return hnode;
}

export function translateProps(props: Record<string, any>) {
  if (!props.style) {
    return props;
  }
  return {...props, style: translateStyle(props.style) };
}

function translateStyle(style: any) {
  if (!style || typeof style !== 'object') {
    return style;
  }
  return Object.entries(style).map(([k, v]) => `${k}:${v};`).join('');
}

function getLayerNumber(node: HElement): number {
  if (!node.parentNode) {
    return 0;
  }
  if (node.fragments) {
    return 0;
  }
  if (node.tagName === 'scroll-view' || node.tagName === 'swiper') {
    return getLayerNumber(node.parentNode);  
  }
  return getLayerNumber(node.parentNode) + 1;
}