#nextTick

## 使用

- Vue 是异步渲染
- data 改变后，Dom 不会马上渲染
- $nextTick 会在 DOM 渲染之后触发，以获取新的 DOM 节点
- 页面渲染时会将 data 的修改进行合并,多次 data 修改只会渲染一次

## 例子

```js
import { createApp, nextTick } from 'vue'

const app = createApp({
  setup() {
    const message = ref('Hello!')
    const changeMessage = async (newMessage) => {
      // 数据修改后，Dom不会马上更新渲染
      message.value = newMessage
      await nextTick()
      console.log('Now DOM is updated')
    }
  },
})
```
