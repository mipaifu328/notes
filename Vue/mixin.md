# mixin

## 使用

mixin 多个组件有相同的逻辑，抽离出来

```html
<template>
  <div>
    {{mixinDemo}} - {{ mixinName }}
    <button @click="sayMixinName">show</button>
  </div>
</template>
<script>
  import myMixin from '../mixin/myMixin'

  export default {
    mixins: [myMixin],
    data() {
      return {
        mixinDemo: 'mixinDemo',
      }
    },
  }
</script>
```

```js
// ../mixin/myMixin.js
export default {
  data() {
    return {
      mixinName: 'zhangsan',
    }
  },
  methods: {
    sayMixinName() {
      console.log(this.mixinName, this.mixinDemo)
    },
  },
}
```

## 问题

- 变量来源不明确，不易于阅读
- 多个 mixin 可能造成命名冲突
- mixin 和组件可能出现多对多关系，复杂度较高
