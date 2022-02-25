简单入门学习，了解具体使用和 pinia 优势

`pinia相对于vuex优点:`

- 轻量级
- typescript 支持
- action 可同步或者异步，不同于 vuex 需要同步(mutation)或者异步(action)
- 支持多个 store 不用 modules 区分
- SSR，webpack 拆分

[Pinia 官网](https://pinia.esm.dev/getting-started.html)

`使用`：

1. 安装

```shell
yarn add pinia
##或者
npm install pinia
```

2. vue 挂载插件

```js
import { createPinia } from 'pinia'
app.use(createPinia())
```

3. 在 scr/store 下申明 store

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

同时可以使用`函数（类似 setup）`申明：

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

4. 在组件中引用并使用 stroe

```js
import { useStore } from '@/stores/counter'
export default {
  setup() {
    const counter = useCounterStore()

    // state直接修改
    counter.count++
    // 通过$patch修改
    counter.$patch({ count: counter.count + 1 })
    // $patch可以接受函数
    counter.$patch((state) => {
      state.count++
      state.hasChanged = true
    })
    // 或者使用action代替
    counter.increment()
  },
}
```

**store 解构 使用`storeToRefs()`**

```js
export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ 没法正常工作，因为破坏力响应式
    // 类似`props`不能这样直接解构使用
    const { name, doubleCount } = store

    name // "eduardo"
    doubleCount // 2

    return {
      // 永远等于"eduardo"
      name,
      // 永远等于 2
      doubleCount,
      // 这个则可以响应式
      doubleValue: computed(() => store.doubleCount),
    }
  },
})
```

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()
    // `name` 和 `doubleCount` 是 reactive refs
    // 跳过了所有action和不是响应式属性
    const { name, doubleCount } = storeToRefs(store)

    return {
      name,
      doubleCount,
    }
  },
})
```
