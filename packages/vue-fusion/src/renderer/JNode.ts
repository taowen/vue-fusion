import {
  HElement,
  HNode,
} from './HNode';
import { NodeTypes } from './HNode';

let fragmentId = 1;

export function resetFragmentId() {
  fragmentId = 1;
}

export function encodePageUpdates(dirtyElements: HElement[]) {
  const changes = [];
  const changedFragmentIds = new Set();
  for (const elem of dirtyElements) {
    const root = elem.root;
    const pageId = root.pageId;
    if (!pageId) {
      throw new Error('can not encodePage before attachToPages');
    }
    if (root === elem) {
      changes.push([pageId, '', encodeNode(elem).children])
    } else {
      const fragment = elem.ascendantFragment;
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
    return undefined;
  } else if (node.nodeType === NodeTypes.TEXT) {
    return node.textContent;
  }
  const layerNumber = getLayerNumber(node);
  if (layerNumber > 0 && layerNumber < 4) {
    return {
      tag: node.tagName,
      props: { id: node.id, ... node.props },
      children: node.children.map(n => encodeNode(n))
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
    props: { id: node.id, ... node.props },
    children: node.fragments.map(fragment => {
      return { tag: 'fragment', props: { id: fragment.id }, children: fragment.children.map(n => encodeNode(n)) };
    })
  }
}

function getLayerNumber(node: HElement): number {
  if (!node.parentNode) {
    return 0;
  }
  if (node.fragments) {
    return 0;
  }
  return getLayerNumber(node.parentNode) + 1;
}