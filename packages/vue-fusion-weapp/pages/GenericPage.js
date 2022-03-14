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
  global: { console, clientHost: {
    updatePages(pageUpdates) {
      for (const [pageId, fragmentId, mpData] of pageUpdates) {
        const page = getPageById(pageId);
        if (!page || !page.fragments) {
          continue;
        }
        if (!fragmentId) {
          page.setData({ fragments: mpData });
        } else {
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

let client = undefined;

async function initClient(mpPage) {
  let { data } = await new Promise((resolve, reject) => wx.request({
    url: 'http://localhost:3000',
    success: resolve, 
    fail: reject
  }))
  const end = data.indexOf('</html>');
  if (end !== -1) {
    data = data.substring(end + '</html>'.length);
  }
  const { scripts, fragments } = JSON.parse(data);
  mpPage.setData({ fragments });
  client = await ctx.load(scripts.map(s => `export * from '${s}';`).join('\n'));
  client.onPageLoad(mpPage.getPageId());
}

Page({
  async onLoad() {
    try {
      await initClient(this);
    } catch(e) {
      console.error(e);
    }
    // this.setData({
    //   nodes: [{
    //     type: 'swiper',
    //     ['indicator-dots']: true,
    //     ['indicator-color']: 'red',
    //     children: [{
    //       type: 'swiper-item',
    //       children: [{
    //         type: 'fragment',
    //         children: [{
    //           type: 'image',
    //           src: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
    //         }]
    //       }]
    //     }, {
    //       type: 'swiper-item',
    //       children: [{
    //         type: 'image',
    //         src: 'https://www.baidu.com/img/pc_9c5c85e6b953f1d172e1ed6821618b91.png'
    //       }]
    //     }]
    //   }]
    // })
  }
})
