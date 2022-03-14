import { iterateAttributes } from './iterateAttributes';
import { iterateNodes } from './iterateNodes';
import { nodeOps } from '../renderer';

// parse html to HNode
export function parseHtml(html: string) {
    let parent = nodeOps.createElement('view');
    iterateNodes(html, {
        onTagOpen(tag, attributes) {
            const child = nodeOps.createElement(tag);
            child.parentNode = parent;
            iterateAttributes(attributes, {
                onAttribute(name, value) {
                    child.props[name] = value;
                },
                onAttributeEnabled(name) {
                    child.props[name] = true;
                }
            })
            parent.children.push(child);
            parent = child;
        },
        onTagClose(tag) {
            parent = parent.parentNode!;
        },
        onText(text) {
            parent.children.push(nodeOps.createText(text));
        }
    })
    return parent;
}