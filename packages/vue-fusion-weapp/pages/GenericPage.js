// index.ts
// 获取应用实例
const app = getApp()
const def = require('define-function');
const ctx = def.context({
  global: { console, fwx: {
    setMpData(pageId, node) {
      console.log(pageId, node, new Date().getTime());
    }
  } },
  async dynamicImport(basename, filename) {
    if (filename.startsWith('<')) {
      return undefined;
    }
    let { data } = await new Promise((resolve, reject) => wx.request({
      url: `http://localhost:3000${filename}`,
      success: resolve,
      fail: reject
    }))
    return data;
  }
});



async function loadScript(script) {
  let { data } = await new Promise((resolve, reject) => wx.request({
    url: `http://localhost:3000${script}`,
    success: resolve,
    error: reject
  }))
  return await ctx.load(data);  
}

async function initRender(mpComponent) {
  let { data } = await new Promise((resolve, reject) => wx.request({
    url: 'http://localhost:3000',
    success: resolve, 
    fail: reject
  }))
  const end = data.indexOf('</html>');
  if (end !== -1) {
    data = data.substring(end + '</html>'.length);
  }
  const { scripts, mpData } = JSON.parse(data);
  mpComponent.setData({ fragments: mpData });
  const client = await loadScript('/src/entry-client.ts');
  client.renderPage('abc');
}

Page({
  async onLoad() {
    try {
      await initRender(this);
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
