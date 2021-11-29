# useCallback

### 概念

**useCallback：缓存回调函数。**

`事件处理函数会被重复定义`
React 函数组件中每一次 UI 的变化，都是通过重新执行整个函数来完成的，**这和传统的 Class 组件有很大区别：函数组件中并没有一个直接的方式在多次渲染之间维持一个状态。**

`函数作为属性传给组件，会导致该组件重新渲染`
创建一个新的事件处理函数，虽然不影响结果的正确性，但其实是没必要的。因为这样做不仅增加了系统的开销，更重要的是：**每次创建新函数的方式会让接收事件处理函数的组件，需要重新渲染。**

### API 签名

```js
useCallback(fn, deps)
```

fn 是定义的回调函数，deps 是依赖的变量数组。只有当某个依赖变量发生变化时，才会重新声明 fn 这个回调函数。

```js
import React, { useState, useCallback } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const handleIncrement = useCallback(
    () => setCount(count + 1),
    [count] // 只有当 count 发生变化时，才会重新创建回调函数
  )
  // ...
  return <button onClick={handleIncrement}>+</button>
}
```

**这样就保证了组件不会创建重复的回调函数。而接收这个回调函数作为属性的组件，也不会频繁地需要重新渲染。**
