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
import { defineComponent} from "vue";

// option配置
const Jsx = defineComponent({
  props: {
    name: String
  },
  setup(props) {
    console.log(props)
    return () => <div>{props.name} JSX option Test</div> 
  }
  // 或
  render(props) {
    return <div>{props.name} JSX option Test</div> 
  }
})


// setup函数, 只传setup没发获取props对象属性
const Jsx = defineComponent((props) => {
  console.log(props)
  return () =>  <div>{props.name} JSX Test 123</div> 
})

// 函数
const Jsx = (props) => {
  console.log(props)
  return <div>{props.name}JSX function Test</div>    
}


export default Jsx
```
`defineComponent(配置对象/setup函数)，或者直接函数`

- .vue文件
vite中使用vue写jsx，需要在script中申明`<script lang="tsx">`。
`setup语法糖写法？？`官网暂未查到相关使用。

**jsx和template区别**

- jsx本质上是js代码，可以使用js任何能力
- template只能嵌入简单表达式，需要其他指令如v-if
- jsx 已成为 ES 规范，template只是vue自家规范
- vue3对template有性能优化（patchFlag，hoistStatic，cacheHandler）

本质相同，都会编译为js代码 （ render函数 ）
