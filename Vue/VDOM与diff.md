#虚拟节点 VDOM(Virtual DOM) 和 diff

## vdom 基础

- DOM 操作非常耗性能
- jquery 手动操作 dom
- vue / react `数据驱动视图` （如何有效操作 dom）
  `vdom：用 js 模拟 dom 结构，计算出最小的变更，操作 dom`

  ```html
  <div id="container" class="wrapper">
    <p>vdom</p>
  </div>
  ```

  ```js
  // js模拟dom结构
  {
      tag: 'div',
      props: {
          className: 'wrapper',
          id: 'container'
      },
      children: [{
          tag: 'p',
          children: 'vdom'
      }]
  }

  ```

  ## [snabbdom](https://github.com/snabbdom/snabbdom)

  Snabbdom 由一个非常简单、高性能和可扩展的虚拟 DOM 库。

  ```js
  const container = document.getElementById('container')
  const vnode = h(
    'div#container.two.classes',
    {
      on: {
        click: () => {
          console.log(123)
        },
      },
    },
    [
      h('span', { style: { fontWeight: 'bold' } }, 'This is bold'),
      ' and this is just normal text',
      h('a', { props: { href: '/foo' } }, "I'll take you places!"),
    ]
  )
  // Patch into empty DOM element – this modifies the DOM as a side effect
  patch(container, vnode)
  const newVnode = h(
    'div#container.two.classes',
    { on: { click: () => console.log('anotherEventHandler') } },
    [
      h(
        'span',
        { style: { fontWeight: 'normal', fontStyle: 'italic' } },
        'This is now italic type'
      ),
      ' and this is still just normal text',
      h('a', { props: { href: '/bar' } }, "I'll take you places!"),
    ]
  )
  // Second `patch` invocation
  patch(vnode, newVnode) // Snabbdom efficiently updates the old view to the new state
  ```

## diff 算法

优化时间复杂度为 O(n)

- 只比较同一级，不跨级比较
- tag 不相同，直接删除掉重建，不再深度比较
- tag 和 key 都相同，则认为是相同节点，进行深度比较

`仅在同级的vnode间做diff，递归地进行同级vnode的diff，最终实现整个DOM树的更新`

- h() -> vNodes
- patch(vNodes, newVNodes)
- patchVnode(vNodes, newVNodes)
- addVnodes/removeVnodes/updateChildren(parentElm, oldCh, newCh)


[Vue 3 Virtual Dom Diff源码阅读](https://segmentfault.com/a/1190000038654183)