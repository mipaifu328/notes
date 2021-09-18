# slot 插槽

## 使用

- 具名插槽。
  `v-slot:slotName`（缩写`#slotName`） -> `<slot name="slotName">` ，默认为`v-slot:defalut`。
  `v-slot` 必须放到`<template>`里。
- 插槽作用域。
  `v-slot:slotName="slotProps"`, `<slot :slotData="xxx">`。
  获取插槽数据：`slotProps.slotData`

## 例子

```html
<slot>
  <template v-slot:default="slotProps"> {{ slotProps.item.title }} </template>
  <template v-slot:url="slotProps"> {{ slotProps.item.url }} </template>
</slot>
```

```html
<template>
  <div>
    <slot name="url" :item="website"></slot>
    <slot :item="website"> </slot>
  </div>
</template>

<script>
  export default {
    props: {},
    data() {
      return {
        website: {
          title: '百度',
          url: 'https://www.baidu.com',
        },
      }
    },
  }
</script>
```

显示最终 html 为：

```html
<div>https://www.baidu.com百度</div>
```
