leafs = {
  image: {
    events: ['load', 'tap'],
    props: {
      src: undefined,
    }
  },
  spacer: {
    component: 'view',
    props: {
    },
    events: ['tap']
  }
}

containers = {
  view: {
    props: {
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
  Object.assign(comp.props, {
    id: undefined,
    class: undefined,
    style: undefined,
    hidden: undefined
  })
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
    lines.push(leafTemplate(comp.component || compName, comp));
    lines.push('</template>')
  }
  return lines.join('\n');
}

function containerTemplate(compName, comp, nextLevel) {
  attrs = [];
  Object.assign(comp.props, {
    id: undefined,
    class: undefined,
    style: undefined,
    hidden: undefined
  })
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
  return `\t<${compName} wx:elif="{{item.tag === '${compName}'}}" ${attrs.join(' ')}><template is="${nextLevel}" data="{{ nodes: item.children }}" /></${compName}>`
}

function containerTemplates(nextLevel) {
  lines = [];
  lines.push(`\t<block wx:if="{{item.tag === 'fragment'}}"><Fragment id="{{item.id}}" nodes="{{item.children}}"/></block>`);
  for (const [compName, comp] of Object.entries(containers)) {
    lines.push(containerTemplate(compName, comp, nextLevel));
  }
  lines.push(`\t<block wx:elif="{{helper.isString(item)}}">{{item}}</block>`)
  lines.push(`\t<block wx:elif="{{item.tag === 'page-meta'}}" />`)
  lines.push(`\t<template wx:elif="{{item.tag}}" is="{{item.tag}}" data="{{...item}}" />`)
  return lines.join('\n');
}

console.log(`
<wxs src="./Fragment.wxs" module="helper" />
<template name="level1">
<block wx:for="{{nodes}}" wx:key="id">
${containerTemplates('level2')}
</block>
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
${containerTemplates('level5')}
</block>
</template>
<template name="level5">
\t<Fragment nodes="{{nodes}}"/>
</template>
${leafTemplates()}
<template is="level1" data="{{ nodes: nodes }}"/>`)