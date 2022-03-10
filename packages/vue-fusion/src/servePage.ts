import { extractScripts } from "./extractScripts";
import * as fs from 'fs';
import * as path from 'path';

export function servePage(renderResult: { mpData: any }, htmlFile: string) {
    const page: Record<string, any> = { ...renderResult };
    if (!page.scripts) {
        page.scripts = {};
    }
    const html = fs.readFileSync(htmlFile, { encoding: 'utf-8'});
    const scripts = extractScripts(html);
    for (const script of scripts) {
        const scriptFile = path.join(path.dirname(htmlFile), script);
        const scriptContent = fs.readFileSync(scriptFile, { encoding: 'utf-8'});
        page.scripts[script] = scriptContent;
    }
    return JSON.stringify(page);
}