# vue3 Ref 相关知识点

## ref 基础用法

> `ref` 接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property .value。

```html
<template> {{count}} </template>
```

```js
setup() {
    const count = ref(0)
    console.log(count.value) // 0

    count.value++
    console.log(count.value) // 1
    return {
        count
    }
}
```

如果将对象分配为 ref 值，则通过 reactive 函数使该对象具有高度的响应式。

```js
const refObject = ref({
  name: 'zhangsan',
  age: 12,
})
// refObject.value 等价于
// reactive({
//     name: 'zhangsan',
//     age: 12
// })
```

## ref 构造函数

```js
class RefImpl {
  constructor(value, _shallow) {
    this._shallow = _shallow
    this.dep = undefined
    this.__v_isRef = true
    this._rawValue = _shallow ? value : toRaw(value)
    this._value = _shallow ? value : convert(value)
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newVal) {
    newVal = this._shallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

## toRef 和 toRefs

### toRef

可以用来为源响应式对象上的`某个 property` 新创建一个 ref。然后，ref 可以被传递，它会保持对其源 property 的响应式连接。

```html
<template> {{name}} </template>
```

```js
 setup(){
     const user = reactive({
         name: 'zhangsan',
         age: 20
     })
     setTimeout(() => {
         user.name = 'lisi'
     }, 2000)

     return {
         ...user // 这里结构后的属性，没有响应式
         ...toRef(user, name)   // 这里的name是一个ref对象，响应式
         ...toRefs(user)    // 整个user对象属性都响应式
     }
 }

```

### toRefs

当从组合式函数返回响应式对象时，toRefs 非常有用，这样消费组件就可以在`不丢失响应性`的情况下对返回的对象进行`解构/展开`：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  })

  // 操作 state 的逻辑

  // 返回时转换为ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以在不失去响应性的情况下解构
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar,
    }
  },
}
```

toRefs 只会为源对象中包含的 property 生成 ref。如果要为特定的 property 创建 ref，则应当使用 toRef

## 疑问

### 为什么要 ref?

- 返回基础类型，会失去响应式
- setup， computed， 合成函数（自定义 hooks）都可能返回值类型
- reactive 只能监听对象，对于经常用到的基本值类型还需要 ref

### 为什么要 .value?

- ref 是一个对象（不丢失响应式），value 存储值
- 通过.vaule 属性的 get 和 set 实现响应式
- 用于模板、reactive 时，不需要.value，其他情况都需要
