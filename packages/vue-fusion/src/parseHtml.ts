import * as sax from 'sax';
import { nodeOps } from './nodeOps';
import { toMpData } from './serialize';

export function parseHtml(html: string) {
    let parent = nodeOps.createElement('view');
    const parser = sax.parser(true);
    parser.onopentagstart = (tag) => {
        const child = nodeOps.createElement(tag.name);
        child.parentNode = parent;
        parent.children.push(child);
        parent = child;
    }
    parser.onattribute = ({name, value}) => {
        parent.props[name] = value;
    }
    parser.ontext = (t) => {
        parent.children.push(nodeOps.createText(t));
    }
    parser.onclosetag = () => {
        parent = parent.parentNode!;
    }
    parser.write(html).close();
    return toMpData(parent).children;
}