const { context } = require('define-function');

// const baseUrl = 'http://localhost:3000'; 
const baseUrl = 'https://taowen.github.io/vue-fusion/demo-huangli';

function getPageById(pageId) {
  const pages = getCurrentPages();
  for (const page of pages) {
    if (page.getPageId() === pageId) {
      return page;
    }
  }
  return undefined;
}

const global = {
  console, 
  wx: {
    ...wx,
    navigateTo({ url }) {
      return wx.navigateTo({ url: '/pages/GenericPage?url=' + encodeURIComponent(url) })
    },
  },
  clientHost: {
  updatePages(pageUpdates) {
    for (const [pageId, fragmentId, mpData] of pageUpdates) {
      const page = getPageById(pageId);
      if (!page) {
        continue;
      }
      if (!fragmentId) {
        page.setData({ fragments: mpData });
      } else if(page.fragments) {
        const fragment = page.fragments[fragmentId];
        if (fragment) {
          fragment.setData({ nodes: mpData });
        }
      }
    }
  }
}}

module.exports.client = undefined;

async function initClient(mpPage) {
  const url = decodeURIComponent(mpPage.options.url || '/');
  let { data } = await new Promise((resolve, reject) => wx.request({
    url: baseUrl + url,
    success: resolve, 
    fail: reject
  }))
  if (typeof data === 'string') {
    const end = data.indexOf('</html>');
    if (end !== -1) {
      data = data.substring(end + '</html>'.length);
    }
    data = JSON.parse(data);
  }
  let { scripts, fragments, preloaded } = data;
  if (fragments) {
    mpPage.setData({ fragments });
  }
  if (!scripts) {
    scripts = [];
  }
  if (preloaded) {
    scripts = [...scripts, ...Object.keys(preloaded)];
  }
  const ctx = context({
    global,
    async loadModuleContent(moduleName) {
      if (preloaded && preloaded[moduleName]) {
        return preloaded[moduleName];
      }
      if (!moduleName.startsWith('/')) {
        moduleName = '/' + moduleName;
      }
      let { data } = await new Promise((resolve, reject) => wx.request({
        url: baseUrl + moduleName,
        success: resolve,
        fail: reject
      }))
      return data;
    }
  });
  module.exports.client = await ctx.load(scripts.map(s => `export * from '${s}';`).join('\n'));
  module.exports.client.onPageLoad(mpPage.getPageId(), url);
}

Page({
  async onLoad(options) {
    if (module.exports.client) {
      module.exports.client.onPageLoad(this.getPageId(), decodeURIComponent(options.url) || '/');
    } else {
      module.exports.client = initClient(this);
      await module.exports.client;
    }
  },
  onUnload() {
    module.exports.client.onPageUnload(this.getPageId());
  }
})
