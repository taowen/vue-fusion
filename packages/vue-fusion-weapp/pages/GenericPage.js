// index.ts
// 获取应用实例
const app = getApp()
const { context } = require('define-function');

function getPageById(pageId) {
  const pages = getCurrentPages();
  for (const page of pages) {
    if (page.getPageId() === pageId) {
      return page;
    }
  }
  return undefined;
}

const ctx = context({
  global: { 
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
  } },
  async loadModuleContent(moduleName) {
    let { data } = await new Promise((resolve, reject) => wx.request({
      url: `http://localhost:3000${moduleName}`,
      success: resolve,
      fail: reject
    }))
    return data;
  }
});

module.exports.client = undefined;

async function initClient(mpPage) {
  const url = decodeURIComponent(mpPage.options.url || '/');
  let { data } = await new Promise((resolve, reject) => wx.request({
    url: 'http://localhost:3000' + url,
    success: resolve, 
    fail: reject
  }))
  const end = data.indexOf('</html>');
  if (end !== -1) {
    data = data.substring(end + '</html>'.length);
  }
  const { scripts, fragments } = JSON.parse(data);
  mpPage.setData({ fragments });
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
  }
})
