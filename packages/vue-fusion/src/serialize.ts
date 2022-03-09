import {
  HNode,
  NodeTypes
} from './nodeOps';

export function serialize(node: HNode): string {
  return JSON.stringify(toMpData(node));
}

export function toMpData(node: HNode): any {
  if (node.type === NodeTypes.COMMENT) {
    return undefined;
  } else if (node.type === NodeTypes.TEXT) {
    return node.text;
  }
  return {
    tag: node.tag,
    props: Object.keys(node.props).length === 0 ? undefined : node.props,
    children: node.children.map(node => toMpData(node))
  }
}