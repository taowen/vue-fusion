// simplified from https://github.com/developit/htmlParser/blob/master/src/htmlParser.js
const elementTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;

const NOOP = () => { };

export function iterateNodes(xml: string, callbacks: {
    onComment?: (comment: string) => void;
    onCDATA?: (CDATA: string) => void;
    onTagBegin?: (tag: string, attributes?: string) => void;
    onTagEnd?: (tag: string) => void;
    onText?: (text: string) => void;
}) {
    if (!callbacks.onCDATA) {
        callbacks.onCDATA = NOOP;
    }
    if (!callbacks.onComment) {
        callbacks.onComment = NOOP;
    }
    if (!callbacks.onTagBegin) {
        callbacks.onTagBegin = NOOP;
    }
    if (!callbacks.onTagEnd) {
        callbacks.onTagEnd = NOOP;
    }
    if (!callbacks.onText) {
        callbacks.onText = NOOP;
    }
    elementTokenizer.lastIndex = 0;
    let token: RegExpExecArray | null = null;
    let bStart = '';
    let lastIndex = 0;
    while ((token = elementTokenizer.exec(xml))) {
        bStart = token[5] || token[8];
        const textIndexEnd = elementTokenizer.lastIndex - token[0].length;
        if (textIndexEnd > lastIndex) {
            callbacks.onText(xml.substring(lastIndex, textIndexEnd));
        }
        if (bStart === '<!--') {
            callbacks.onComment(token[6] || token[9]);
        } else if (bStart === '<![CDATA[') {
            callbacks.onCDATA(token[6] || token[9]);
        } else if (token[1] !== '/') {
            callbacks.onTagBegin(token[2], token[3]);
            // is self closing
            if ((token[4] && token[4].indexOf('/') > -1)) {
                callbacks.onTagEnd(token[2]);
            }
        } else {
            callbacks.onTagEnd(token[2]);
        }
        lastIndex = elementTokenizer.lastIndex;
    }
    if (xml.length > lastIndex) {
        callbacks.onText(xml.substring(lastIndex));
    }
}