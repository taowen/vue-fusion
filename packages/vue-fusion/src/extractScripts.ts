import * as sax from 'sax';

export function extractScripts(html: string) {
    const scripts: string[] = [];
    const parser = sax.parser(false, {
        lowercase: true
    });
    let inScript = false;
    let inLink = false;
    parser.onopentagstart = (tag) => {
        if (tag.name === 'script') {
            inScript = true;
        } else if (tag.name === 'link') {
            inLink = true;
        }
    }
    parser.onattribute = ({ name, value }) => {
        if (inScript) {
            if (name === 'src') {
                scripts.push(value);
            }
        } else if (inLink) {
            if (name === 'href' && value.endsWith('.js')) {
                scripts.push(value);
            }
        }
    };
    parser.onclosetag = () => {
        inScript = false;
        inLink = false;
    }
    parser.write(html).close();
    return scripts;
}