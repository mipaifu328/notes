**vite中使用jsx**

- 安装 `@vitejs/plugin-vue-jsx` 插件
-  配置 vite.config.js
``` js
import vueJsx from '@vitejs/plugin-vue-jsx'
export default {
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ]
}
```

使用方式

- .jsx文件
``` js
import { defineComponent } from "vue";
export default defineComponent({ render() { return <div>Test</div> }})
// 或
export default defineComponent(() => {
  return () => { return <div>Test 123</div> }
})
```
`defineComponent(配置对象/setup函数)`

- .vue文件
vite中使用vue写jsx，需要在script中申明`<script lang="tsx">`。`setup语法糖写法？？`

**jsx和template区别**

- jsx本质上是js代码，可以使用js任何能力
- template只能嵌入简单表达式，需要其他指令如v-if
- jsx 已成为 ES 规范，template只是vue自家规范

本质相同，都会编译为js代码 （ render函数 ）
