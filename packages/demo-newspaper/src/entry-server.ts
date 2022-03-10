import * as fusion from 'vue-fusion';
import { createApp } from './main';

export async function render(url: string, manifest: any) {
  const { app } = createApp()
  return fusion.renderToMpData(app);
}
