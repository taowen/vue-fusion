import {
  HElement,
  HNode,
} from './nodeOps';
import { NodeTypes } from './nodeOps';

let fragmentId = 1;

export function serialize(node: HNode): string {
  return JSON.stringify(toMpData(node));
}

export function toMpData(node: HNode): any {
  if (node.nodeType === NodeTypes.COMMENT) {
    return undefined;
  } else if (node.nodeType === NodeTypes.TEXT) {
    return node.textContent;
  }
  const layerNumber = getLayerNumber(node);
  if (layerNumber > 0 && layerNumber < 4) {
    return {
      tag: node.tagName,
      props: Object.keys(node.props).length === 0 ? undefined : node.props,
      children: node.children.map(n => toMpData(n))
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
        id: fragmentId++,
        parentNode: node,
        children: []
      };
    }
    fragment.children.push(child);
  }
  return {
    tag: node.tagName,
    props: Object.keys(node.props).length === 0 ? undefined : node.props,
    children: node.fragments.map(fragment => {
      return { tag: 'fragment', children: fragment.children.map(n => toMpData(n)) };
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