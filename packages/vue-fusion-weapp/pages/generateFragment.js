leafs = {
  image: {
    events: ['load', 'tap'],
    props: {
      src: undefined 
    }
  }
}

containers = {
  view: {
    props: {
      style: undefined
    },
    events: ['tap']
  },
  swiper: {
    props: {
      ['indicator-dots']: undefined,
      ['indicator-color']: undefined
    }
  },
  ['swiper-item']: {
      props: {}
  }
}

function leafTemplate(compName, comp) {
  attrs = [];
  for (const [k, v] of Object.entries(comp.props)) {
    if (v === undefined) {
      attrs.push(`${k}="{{${k}}}"`)
    } else {
      throw new Error('default value not supported yet');
    }
  }
  for (const e of comp.events || []) {
    attrs.push(`catch:${e}="eh"`);
  }
  return `\t<${compName} ${attrs.join(' ')}/>`
}

function leafTemplates() {
  lines = [];
  for (const [compName, comp] of Object.entries(leafs)) {
    lines.push(`<template name="${compName}">`)
    lines.push(leafTemplate(compName, comp));
    lines.push('</template>')
  }
  return lines.join('\n');
}

function containerTemplate(compName, comp, nextLevel) {
  attrs = [];
  for (const [k, v] of Object.entries(comp.props)) {
    if (v === undefined) {
      attrs.push(`${k}="{{item['${k}']}}"`)
    } else {
      throw new Error('default value not supported yet');
    }
  }
  for (const e of comp.events || []) {
    attrs.push(`catch:${e}="eh"`);
  }
  return `\t<${compName} wx:elif="{{item.type === '${compName}'}}" ${attrs.join(' ')}><template is="${nextLevel}" data="{{ nodes: item.children }}" /></${compName}>`
}

function containerTemplates(nextLevel) {
  lines = [];
  lines.push(`\t<block wx:if="{{item.type === 'fragment'}}"><Fragment node="{{item.children[0]}}"/></block>`);
  for (const [compName, comp] of Object.entries(containers)) {
    lines.push(containerTemplate(compName, comp, nextLevel));
  }
  lines.push(`\t<template wx:elif="{{item.type}}" is="{{item.type}}" data="{{...item}}" />`)
  return lines.join('\n');
}

console.log(`<template name="level1">
${containerTemplates('level2')}
</template>
<template name="level2">
<block wx:for="{{nodes}}" wx:key="id">
${containerTemplates('level3')}
</block>
</template>
<template name="level3">
<block wx:for="{{nodes}}" wx:key="id">
${containerTemplates('level4')}
</block>
</template>
<template name="level4">
<block wx:for="{{nodes}}" wx:key="id">
\t<Fragment node="{{item}}"/>
</block>
</template>
${leafTemplates()}
<template is="level1" data="{{ item: node }}"/>`)