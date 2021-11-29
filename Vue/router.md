# vue-router

## 知识点

### 路由模式

- hash
  `createWebHashHistory()创建`,它在内部传递的实际 URL 之前使用了一个哈希字符（#）。由于这部分 URL 从未被发送到服务器，所以它`不需要在服务器层面上进行任何特殊处理`。不过，`它在 SEO 中确实有不好的影响`。主要通过`onhashchange监听变化`
- H5 history
  利用 `history.pushState` API 来完成 URL 跳转而无须重新加载页面。`需要后台配置支持`。`对SEO友好`，通过`pushState()/replaceState()/onpopstate（监听不到前面2个方法的变化）`。
  [HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

### 路由配置

- 动态路由

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User },
  ],
})
```

| 模式                          | 匹配路径            | $route.params                        |
| ----------------------------- | ------------------- | ------------------------------------ |
| /user/:username               | /user/evan          | { username: 'evan' }                 |
| /user/:username/post/:post_id | /user/evan/post/123 | { username: 'evan', post_id: '123' } |

- 懒加载

```js
// 首先，可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)：
const Foo = () =>
  Promise.resolve({
    /* 组件定义对象 */
  })

// 第二，在 Webpack 2 中，我们可以使用动态 import语法来定义代码分块点 (split point)：
const Foo = () => import('./Foo.vue')
// 路由配置
const router = new VueRouter({
  routes: [{ path: '/foo', component: Foo }],
})
// vue3
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/foo', component: Foo }],
})
```

### 路由监听

[官网](https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html)

```js
/** 1. $watch监听，watch $route 对象上的任意属性 **/
const User = {
  template: '...',
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // 对路由变化做出响应...
      }
    )
  },
}

/** 2.组件内守卫
 * beforeRouteEnter
 * beforeRouteUpdate
 * beforeRouteLeave **/
const User = {
  template: '...',
  async beforeRouteUpdate(to, from) {
    // 对路由变化做出响应...
    this.userData = await fetchUser(to.params.id)
  },
}

/** 3. 全局导航守卫
 * beforeEach（to, from [, next]） 全局前置守卫
 * beforeResolve 全局解析守卫
 * afterEach(to, from)  全局后置钩子
 *  **/
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
// 确保 next 在任何给定的导航守卫中都被严格调用一次。
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})

/** 4.路由独享的守卫 **/
// 直接在路由配置上定义 beforeEnter 守卫
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
// 你也可以将一个函数数组传递给 beforeEnter
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

**完整的导航解析流程**

- 导航被触发。
- 在失活的组件里调用 `beforeRouteLeave` 守卫。
- 调用全局的 `beforeEach` 守卫。
- 在重用的组件里调用 `beforeRouteUpdate `守卫(2.2+)。
- 在路由配置里调用 `beforeEnter`。
- 解析异步路由组件。
- 在被激活的组件里调用 `beforeRouteEnter`。
- 调用全局的 `beforeResolve `守卫(2.5+)。
- 导航被确认。
- 调用全局的 `afterEach` 钩子。
- 触发 DOM 更新。
- 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## 路由实现

> [7 张图，从零实现一个简易版 Vue-Router，太通俗易懂了！](https://juejin.cn/post/7012272146907037732)
