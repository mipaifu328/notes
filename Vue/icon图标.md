# vue 图标方案

[unplugin-icons](https://github.com/antfu/unplugin-icons)
[iconify 搜索工具](https://icones.js.org/)

## 安装依赖

```shell
npm i @iconify/iconify --save
npm i -D unplugin-icons
npm i -D @iconify/json
// 或者
npm i -D @iconify-json/mdi

// autoimport
npm i unplugin-vue-components -D
```

## vite 配置

```js
// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
  ],
})
```

## 使用

```js
<template>
  <i-mdi:account-box-multiple />
</template>
```
