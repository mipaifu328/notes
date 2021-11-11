简单入门学习，了解具体使用和pinia优势

`pinia相对于vuex优点:`

- 轻量级
- typescript支持
- action可同步或者异步，不同于vuex需要同步(mutation)或者异步(action)
- 支持多个store不用modules区分
- SSR，webpack拆分

[Pinia官网](https://pinia.esm.dev/getting-started.html)

`使用`：

1. 安装
``` shell
yarn add pinia 
##或者
npm install pinia
```

2. vue挂载插件
``` js
import { createPinia } from 'pinia'
app.use(createPinia())
```
3. 在scr/store下申明store
``` js
import { defineStore } from 'pinia'
export const useStore = defineStore('main', {
  // other options...
})
```
4. 在组件中引用并使用stroe
``` js
import { useStore } from '@/stores/counter'
export default {
  setup() {
    const store = useStore()
    return {
      store,
    }
  },
}
```