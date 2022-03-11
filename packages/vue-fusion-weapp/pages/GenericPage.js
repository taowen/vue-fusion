// index.ts
// 获取应用实例
const app = getApp()

Page({
  async onLoad() {
    const { data } = await new Promise((resolve, reject) => wx.request({
      url: 'http://localhost:3000',
      success: resolve,
      error: reject
    }))
    this.setData({ fragments: data.mpData })
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
