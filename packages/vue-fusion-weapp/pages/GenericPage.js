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
    let { data } = await new Promise((resolve, reject) => wx.request({
      url: `http://localhost:3000${filename}`,
      success: resolve,
      error: reject
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
  await ctx.load(data);  
}

Page({
  async onLoad() {
    let { data } = await new Promise((resolve, reject) => wx.request({
      url: 'http://localhost:3000',
      success: resolve,
      error: reject
    }))
    const end = data.indexOf('</html>');
    if (end !== -1) {
      data = data.substring(end + '</html>'.length);
    }
    const { scripts, mpData } = JSON.parse(data);
    this.setData({ fragments: mpData });
    for (const script of Object.keys(scripts)) {
      await loadScript(script);
    }
    console.log('loaded', new Date().getTime());
    const renderPage = await ctx.def(`
return (async() => {
  const client = await import('/src/entry-client.ts');
  return client.renderPage(...arguments);
})();
`)
await renderPage('page1');
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
