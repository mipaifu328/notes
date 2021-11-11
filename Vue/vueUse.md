## vueUse

一套Vue Composition API的常用工具集。初衷就是将一切原本并不支持响应式的JS API变得支持响应式，省去程序员自己写相关代码。

**源码都是通过watch响应式对象，再进行原生api操作，返回响应式数据**

[ Anthony Fu B站视频分享](https://www.bilibili.com/video/BV1s5411g7wr?p=5)

[官网API](https://vueuse.org/functions.html)

> 下面举简单例子

 - `useStorage`
```js

function useStorage(name, value=[]){
    let data = ref(JSON.parse(localStorage.getItem(name)|| value))
    watchEffect(()=>{
        localStorage.setItem(name,JSON.stringify(data.value))
    })
    return data
}

// 使用
let todos = useStorage('todos',[])
let title = ref('')
function addTodo() {
  todos.value.push({
    title: title.value,
    done: false,
  });
  title.value = "";
}
```

- `useFavicon`
``` js

import {ref,watch} from 'vue'
export default function useFavicon( newIcon ) {
    const favicon = ref(newIcon)

    const updateIcon = (icon) => {
      document.head
        .querySelectorAll(`link[rel*="icon"]`)
        .forEach(el => el.href = `${icon}`)
    }
    const reset = ()=>favicon.value = '/favicon.ico'

    watch( favicon,
      (i) => {
        updateIcon(i)
      }
    )
    return {favicon,reset}
  } 

```

``` html

 <script setup>
 import useFavicon from './utils/favicon'
 let {favicon}  = useFavicon()
 function loading(){
   favicon.value = '/food.png'
 }
</script>

<template>
  <button @click="loading">loadFavicon</button>
</template>
```
