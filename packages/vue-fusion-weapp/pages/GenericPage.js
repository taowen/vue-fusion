// index.ts
// 获取应用实例
const app = getApp()
const { context } = require('define-function');
const ctx = context({
  global: { console, fwx: {
    setMpData(pageId, node) {
      console.log(pageId, node, new Date().getTime());
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

async function initClient(mpComponent) {
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
  mpComponent.setData({ fragments });
  client = await ctx.load(scripts.map(s => `export * from '${s}';`).join('\n'));
  client.onPageLoad('abc');
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
