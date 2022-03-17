# About

微信小程序的 SSR / OTA / HMR 解决方案，用熟悉的 Vue + TSX 写界面

* SSR: 通过 Server Side Rendering 提高首屏打开速度
* OTA: 达到类似 React Native 的 codepush 效果，实现 Over The Air Update
* HMR: 开发环境的 Hot Module Replacement，基于 Vite + TypeScript
* 可推广给 Android / iOS / Windows 10 SDK 等其他原生应用开发技术栈

# 运行模式

| 运行模式 | 服务端 | 微信小程序 | 更新方式 | 优势 |
| ---     | ---    | ---       | ---     | --- |
| 本地开发 SSR+HMR | vite |  本地无代码，从 vite 下载 | HMR 推送 | 开发便利，支持真机 |
| 本地预览 |  vite | 本地无代码，从 vite 下载 | HMR 推送 | 只预览模板，不跑业务代码 |
| SSR | node 跑 SSR 服务 | 本地无代码，从 SSR 服务端下载 | 获取首页时获取代码 | 首屏渲染快，小程序包体积小 |
| SSR+预分发代码 | node 跑 SSR 服务 | 代码打包进小程序 | 获取首页时检查本地代码更新 | 首屏渲染快，更快开始执行js |
| SSG | http 静态服务 | 本地无代码，从 http 下载 | 执行前先获取最新代码 | 可以部署到 github pages 等静态 http 服务，节省服务器成本 |
| SSG+预分发代码 | http 静态服务 | 代码打包进小程序 | 执行前先检查本地代码更新 | 更快开始执行 js |
| 传统客户端 | http 静态服务 | 代码打包进小程序 | 业务代码主动调用检查更新和重启 | 不依赖服务器高可用 |

# 实现原理

* vue-fusion: 是一个 vue 3 的 [custom renderer](https://vuejs.org/api/custom-renderer.html)（与 kbone/taro 不同，它们是模拟 DOM），把 vue 组件渲染成 HNode
* vue-fusion-weapp：通过 http 拉取 SSR 出来的 HNode，用 [quick.js](https://github.com/taowen/define-function) hydrate，遍历 HNode 把界面绘制到微信小程序上