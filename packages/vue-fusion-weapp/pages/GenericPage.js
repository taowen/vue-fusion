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
  for(let i = 0; i < buffer.byteLength; i++) {
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
        page.setData(processPageFragments(mpData));
      } else if(page.fragments) {
        const fragment = page.fragments[fragmentId];
        if (fragment) {
          fragment.setData({ nodes: mpData });
        }
      }
    }
  }
}}

function processPageFragments(fragments) {
  let pageMeta = {};
  let navigationBar = {};
  for (const fragment of fragments) {
    for (const child of fragment.children) {
      if (child.tag === 'page-meta') {
        pageMeta = child;
        for (const grandChild of child.children) {
          if (grandChild.tag === 'navigation-bar') {
            navigationBar = grandChild;
          }
        }
      }
    }
  }
  return { fragments, pageMeta, navigationBar };
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
