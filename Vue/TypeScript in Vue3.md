# TypeScript in Vue3

要在单文件组件中使用 TypeScript，需要在 `<script> `标签上加上 `lang="ts"` 的 attribute。当 lang="ts" 存在时，所有的模板内表达式都将享受到更严格的类型检查。

## 为组件的 prop 标注类型

通过泛型参数来定义 prop 的类型通常更直接.

```html
<script setup lang="ts">
  // 运行时申明。然而，通过泛型参数来定义 prop 的类型通常更直接。
  const props = defineProps({
    foo: { type: String, required: true },
    bar: Number,
  })

  // 方式一， 同一个文件中的一个接口或对象类型字面量的引用
  interface IProps {
    foo: string
    bar: number
    msg: string
  }

  defineProps<IProps>()

  // 方式二， 泛型加上自变量对象
  defineProps<{
    msg: string
    foo: string
    bar: number
  }>()

  // !!!不支持外部引用的Interface
  import { Props } from './other-file'
  // 不支持！
  defineProps<Props>()
  // 因为 Vue 组件是单独编译的，编译器目前不会抓取导入的文件以分析源类型。
  // 这个限制可能会在未来的版本中被解除。
</script>
```

如果不适用`setup`语法糖，则需要使用`defineComponent()`。传入 `setup() `的 prop 对象类型是从 `props 选项`中推导而来。

```html
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      message: String,
    },
    setup(props) {
      props.message // <-- 类型：string
    },
  })
</script>
```

## 为组件的 emit 标注类型

基于类型的声明使我们可以对所触发事件的类型进行更细粒度的控制。

```html
<script setup lang="ts">
  // 运行时
  const emit = defineEmits(['change', 'update'])

  // 基于类型
  const emit = defineEmits<{
    (e: 'change', id: number): void
    (e: 'update', value: string): void
  }>()
</script>
```

## 为 ref() 标注类型

有时我们可能想为 ref 内的值指定一个更复杂的类型，可以通过使用 Ref 这个类型：

```js
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

或者，在调用 ref() 时传入一个泛型参数，来覆盖默认的推导行为：

```js
// 得到的类型：Ref<string | number>
// const year = ref<string | number> '2020'

year.value = 2020 // 成功！
```

## 为模板 ref 标注类型

```html
<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const el = ref<HTMLInputElement | null>(null)

  onMounted(() => {
    el.value?.focus()
  })
</script>

<template>
  <input ref="el" />
</template>
```

## 为组件模板 ref 标注类型

有时，你可能需要为一个子组件添加一个模板 ref，以便调用它公开的方法。举个例子，我们有一个 MyModal 子组件，它有一个打开模态框的方法：

```html
<!-- MyModal.vue -->
<script setup lang="ts">
  import { ref } from 'vue'

  const isContentShown = ref(false)
  const open = () => (isContentShown.value = true)

  defineExpose({
    open,
  })
</script>
```

为了获取 MyModal 的类型，我们首先需要通过 typeof 得到其类型，再使用 TypeScript 内置的 InstanceType 工具类型来获取其实例类型：

```html
<!-- App.vue -->
<script setup lang="ts">
  import MyModal from './MyModal.vue'

  const modal = ref<InstanceType<typeof MyModal> | null>(null)

  const openModal = () => {
    modal.value?.open()
  }
</script>
```

## 为 reactive() 标注类型

```js
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

不推荐使用 reactive() 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同。
