# useState

`useState`用来管理 `state` 的，它可以让函数组件具有维持状态的能力。也就是说，在一个函数组件的`多次渲染`之间，这个 state 是`共享`的。

useState 就和类组件中的 setState 非常类似。不过两者最大的区别就在于，类组件中的 state 只能有一个。所以我们一般都是把一个对象作为 一个 state，然后再通过不同的属性来表示不同的状态。而函数组件中用 useState 则可以很容易地创建多个 state

使用方法

```js
import React, { useState } from 'react'

function Example() {
  // 创建一个保存 count 的 state，并给初始值 0
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

> 我们要遵循的一个原则就是：`state 中永远不要保存可以通过计算得到的值`。

- **从 props 传递过来的值。** 有时候 props 传递过来的值无法直接使用，而是要通过一定的计算后再在 UI 上展示，比如说排序。那么我们要做的就是每次用的时候，都重新排序一下，或者利用某些 cache 机制，而不是将结果直接放到 state 里。
- **从 URL 中读到的值。** 比如有时需要读取 URL 中的参数，把它作为组件的一部分状态。那么我们可以在每次需要用的时候从 URL 中读取，而不是读出来直接放到 state 里。
- **从 cookie、localStorage 中读取的值。** 通常来说，也是每次要用的时候直接去读取，而不是读出来后放到 state 里。

> 弊端

一旦组件有自己状态，意味着组件如果重新创建，就需要有恢复状态的过程，这通常会让组件变得更复杂.(**使用 Redux**)
