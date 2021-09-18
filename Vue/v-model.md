# 自定义 v-model

## vue2

```html
<CustomInput1 v-model="inputValue" />
```

```html
<!-- CustomInput1.vue -->
<template>
  <div>
    <input type="text" :value="text1" @input="input" />
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'text1',
      event: 'input1',
    },
    props: {
      text1: String,
    },
    methods: {
      input(e) {
        this.$emit('input1', e.target.value)
      },
    },
  }
</script>
```

## vue3

```html
<CustomInput2 v-model="inputValue" />
```

```html
<!-- CustomInput2.vue -->
<template>
  <div>
    <input type="text" :value="modelValue" @input="input" />
  </div>
</template>

<script>
  export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    methods: {
      input(e) {
        this.$emit('update:modelValue', e.target.value)
      },
    },
  }
</script>
```
