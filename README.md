# About

微信小程序的 SSR / OTA / HMR 解决方案，用熟悉的 Vue + TSX 写界面

* SSR: 通过 Server Side Rendering 提高首屏打开速度
* OTA: 达到类似 React Native 的 codepush 效果，实现 Over The Air Update
* HMR: 开发环境的 Hot Module Replacement，基于 Vite + TypeScript
* 可推广给 Android / iOS / Windows 10 SDK 等其他原生应用开发技术栈

# 实现原理

* vue-fusion: 是一个 vue 3 的 [custom renderer](https://vuejs.org/api/custom-renderer.html)（与 kbone/taro 不同，它们是模拟 DOM），把 vue 组件渲染成 HNode
* vue-fusion-weapp：通过 http 拉取 SSR 出来的 HNode，用 [quick.js](https://github.com/taowen/define-function) hydrate，遍历 HNode 把界面绘制到微信小程序上