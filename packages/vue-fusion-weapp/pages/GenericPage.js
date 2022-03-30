const { context } = require('define-function');

const baseUrl = 'http://localhost:3000';
// const baseUrl = 'https://taowen.github.io/vue-fusion/demo-huangli';

const otherModules = {};

async function loadFromPack(packedFile) {
  const preloaded = {};
  const { instance } = await WXWebAssembly.instantiate(packedFile);
  const buffer = new Uint8Array(instance.exports.packed.buffer);
  let begin = 0;
  let isFilename = true;
  let filename = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    if (buffer[i] === 0) {
      if (begin === i) {
        break;
      }
      if (isFilename) {
        filename = UTF8ArrayToString(buffer, begin, i);
      } else {
        if (filename === 'index.js' || filename === 'client.js') {
          preloaded[filename] = UTF8ArrayToString(buffer, begin, i);
        } else {
          otherModules[filename] = UTF8ArrayToString(buffer, begin, i);
        }
      }
      isFilename = !isFilename;
      begin = i + 1;
    }
  }
  return { preloaded };
}

function UTF8ArrayToString(heap, idx, endPtr) {
  var str = "";
  while (idx < endPtr) {
    var u0 = heap[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heap[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode((u0 & 31) << 6 | u1);
      continue;
    }
    var u2 = heap[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = (u0 & 15) << 12 | u1 << 6 | u2;
    } else {
      u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
    }
  }
  return str;
}

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
  setTimeout,
  setImmediate(f) {
    return setTimeout(f, 0);
  },
  setInterval,
  clearInterval,
  clearTimeout,
  performance: {
    now() {
      return new Date().getTime();
    }
  },
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
          // page.setData(processPageFragments(mpData));
        } else if (page.fragments) {
          const fragment = page.fragments[fragmentId];
          if (fragment) {
            fragment.setData({ nodes: mpData });
          }
        }
      }
    }
  }
}

const systemInfo = getSystemInfo();

function processPageFragments(fragments) {
  let pageMeta = {};
  for (const fragment of fragments) {
    for (const child of fragment.children) {
      if (child.tag === 'page-meta') {
        pageMeta = child;
      }
    }
  }
  const { statusBarHeight, navBarHeight } = systemInfo;
  pageMeta['page-style'] = pageMeta['page-style'] || '';
  pageMeta['page-style'] += `;--statusBarHeight: ${statusBarHeight}px;--navBarHeight: ${navBarHeight}px;`;
  return { fragments, pageMeta };
}

function getSystemInfo() {
  const systemInfo = { ...wx.getSystemInfoSync() };
  const ios = systemInfo.system.toLowerCase().includes('ios');
  let rect;
  try {
    rect = th.getMenuButtonBoundingClientRect ? th.getMenuButtonBoundingClientRect() : null;
    if (rect === null) {
      throw new Error('getMenuButtonBoundingClientRect error');
    }
    if (rect.width <= 0 || rect.top <= 0 || rect.left <= 0 || rect.height <= 0) {
      // getMenuButtonBoundingClientRect在ios上可能存在返回负值的情况
      throw new Error('getMenuButtonBoundingClientRect error');
    }
  } catch (error) {
    let gap = ''; // 胶囊按钮上下间距 使导航内容居中
    let width = 96; // 胶囊的宽度
    if (systemInfo.platform === 'android') {
      gap = 8;
      width = 96;
    } else if (systemInfo.platform === 'devtools') {
      if (ios) {
        gap = 5.5; // 开发工具中ios手机
      } else {
        gap = 7.5; // 开发工具中android和其他手机
      }
    } else {
      gap = 4;
      width = 88;
    }
    if (!systemInfo.statusBarHeight) {
      // 开启wifi的情况下修复statusBarHeight值获取不到
      systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
    }
    rect = {
      // 获取不到胶囊信息就自定义重置一个
      bottom: systemInfo.statusBarHeight + gap + 32,
      height: 32,
      left: systemInfo.windowWidth - width - 10,
      right: systemInfo.windowWidth - 10,
      top: systemInfo.statusBarHeight + gap,
      width,
    };
  }

  let navBarHeight = 0, navBarExtendHeight = 0;
  if (!systemInfo.statusBarHeight) {
    systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
    navBarHeight = (function () {
      const gap = rect.top - systemInfo.statusBarHeight;
      return 2 * gap + rect.height;
    })();

    systemInfo.statusBarHeight = 0;
  } else {
    navBarHeight = (function () {
      const gap = rect.top - systemInfo.statusBarHeight;
      return systemInfo.statusBarHeight + 2 * gap + rect.height;
    })();

    if (ios) {
      navBarExtendHeight = 4; // 下方扩展4像素高度 防止下方边距太小
    } else {
      navBarExtendHeight = 0;
    }
  }
  navBarHeight = navBarHeight + navBarExtendHeight
  systemInfo.navBarHeight = navBarHeight;
  return systemInfo;
}

module.exports.client = undefined;

async function loadFromServer(url) {
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
  return data;
}

async function initClient(mpPage) {
  const url = decodeURIComponent(mpPage.options.url || '/');
  let { scripts, fragments, preloaded } = await loadFromServer(url);
  // let { scripts, fragments, preloaded } = await loadFromPack('/packed.wasm.br');
  if (fragments) {
    mpPage.setData(processPageFragments(fragments));
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
      if (otherModules && otherModules[moduleName]) {
        return otherModules[moduleName];
      }
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
  await ctx.load(`
    const consoleWarn = console.warn;
    function transformArg(arg) {
      if (arg instanceof Error) {
        return arg.message + ' ' + arg.stack;
      }
      try {
        JSON.stringify(arg);
        return arg;
      } catch(e) {
        consoleWarn('ignore console.warn with data that can not JSON.stringify: ' + e);
          return null;
      }
    }
    global.console.warn = (...args) => {
        consoleWarn(...args.map(arg => transformArg(arg)));
    }
    const consoleError = console.error;
    global.console.error = (...args) => {
      consoleError(...args.map(arg => transformArg(arg)));
    }
    global.WebSocket = class {
      constructor(url) {
        wx.connectSocket({
          url,
          fail: (e) => {
            console.warn('failed to connect websocket', url, e);
          }
        })
      }
      set onopen(cb) {
        wx.onSocketOpen(cb);
      }
      set onclose(cb) {
        wx.onSocketClose(cb);
      }
      set onmessage(cb) {
        wx.onSocketMessage(cb);
      }
      set onerror(cb) {
        wx.onSocketError(cb);
      }
      send(data) {
        wx.sendSocketMessage({
          data,
        })
      }
    }
    global.XMLHttpRequest = class {
      header = {}
      open(method, url, async) {
        Object.assign(this, { method, url, async });
      }
      setRequestHeader(k, v) {
        this.header[k] = v;
      }
      send(data) {
        wx.request({
          method: this.method,
          url: this.url,
          header: this.header,
          data,
          dataType: 'text',
          success: (resp) => {
            this.responseText = resp.data;
            this.readyState = 4;
            this.status = 200;
            this.onreadystatechange();
          }
        })
      }
    };
  `)
  const devtools = { host: 'http://10.68.1.158', port: 8098 };
  await ctx.load(`
  global.__VUE_DEVTOOLS_HOST__ = '${devtools.host}';
  global.__VUE_DEVTOOLS_PORT__ = ${devtools.port};
  global.__VUE_DEVTOOLS_TOAST__ = console.log;
  `);
  // const { data } = await new Promise((resolve, reject) => wx.request({
  //     url: `${devtools.host}:${devtools.port}`,
  //     success: resolve,
  //     fail: reject
  // }));
  // await ctx.load(data);
  module.exports.client = await ctx.load(scripts.map(s => `export * from '${s}';`).join('\n'));
  module.exports.client.onPageLoad(mpPage.getPageId(), url, fragments);
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
