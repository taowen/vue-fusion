// simplified from https://github.com/developit/htmlParser/blob/master/src/htmlParser.js
const nodeTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;

const NOOP = () => { };

export function iterateNodes(xml: string, callbacks: {
    onComment?: (comment: string) => void;
    onCDATA?: (CDATA: string) => void;
    onTagOpen?: (tag: string, attributes?: string) => void;
    onTagClose?: (tag: string) => void;
    onText?: (text: string) => void;
}) {
    if (!callbacks.onCDATA) {
        callbacks.onCDATA = NOOP;
    }
    if (!callbacks.onComment) {
        callbacks.onComment = NOOP;
    }
    if (!callbacks.onTagOpen) {
        callbacks.onTagOpen = NOOP;
    }
    if (!callbacks.onTagClose) {
        callbacks.onTagClose = NOOP;
    }
    if (!callbacks.onText) {
        callbacks.onText = NOOP;
    }
    nodeTokenizer.lastIndex = 0;
    let token: RegExpExecArray | null = null;
    let bStart = '';
    let lastIndex = 0;
    while ((token = nodeTokenizer.exec(xml))) {
        bStart = token[5] || token[8];
        const textIndexEnd = nodeTokenizer.lastIndex - token[0].length;
        if (textIndexEnd > lastIndex) {
            callbacks.onText(xml.substring(lastIndex, textIndexEnd));
        }
        if (bStart === '<!--') {
            callbacks.onComment(token[6] || token[9]);
        } else if (bStart === '<![CDATA[') {
            callbacks.onCDATA(token[6] || token[9]);
        } else if (token[1] !== '/') {
            callbacks.onTagOpen(token[2], token[3]);
            // is self closing
            if ((token[4] && token[4].indexOf('/') > -1)) {
                callbacks.onTagClose(token[2]);
            }
        } else {
            callbacks.onTagClose(token[2]);
        }
        lastIndex = nodeTokenizer.lastIndex;
    }
    if (xml.length > lastIndex) {
        callbacks.onText(xml.substring(lastIndex));
    }
}