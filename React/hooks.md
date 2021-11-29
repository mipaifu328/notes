# Hooks 规则

#### Hooks 只能在函数组件的顶级作用域使用

所谓顶层作用域，就是 Hooks `不能在循环、条件判断或者嵌套函数内执行`，而必须是在顶层。同时 Hooks 在`组件的多次渲染之间，必须按顺序被执行`。

Hooks 的这个规则可以总结为两点：**第一，所有 Hook 必须要被执行到。第二，必须按顺序执行。**

```js
function MyComp() {
  const [count, setCount] = useState(0)
  if (count > 10) {
    // 错误：不能将 Hook 用在条件判断里
    useEffect(() => {
      // ...
    }, [count])
  }

  // 这里可能提前返回组件渲染结果，后面就不能再用 Hooks 了
  if (count === 0) {
    return 'No content'
  }

  // 错误：不能将 Hook 放在可能的 return 之后
  const [loading, setLoading] = useState(false)

  //...
  return <div>{count}</div>
}
```

#### Hooks 只能在函数组件或者其它 Hooks 中使用。

Hooks 作为专门为函数组件设计的机制，使用的情况只有两种。**一种是在函数组件内，另外一种则是在自定义的 Hooks 里面。**

但是如果一定要在 Class 组件中使用，那应该如何做呢？其实有一个通用的机制，那就是**利用高阶组件的模式，将 Hooks 封装成高阶组件**，从而让类组件使用。

```js
import React from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
export const withWindowSize = (Comp) => {
  return (props) => {
    const windowSize = useWindowSize()
    return
  }
}
```

```js
import React from 'react'
import { withWindowSize } from './withWindowSize'
class MyComp {
  render() {
    const { windowSize } = this.props
    // ...
  }
}
// 通过 withWindowSize 高阶组件给 MyComp 添加 windowSize 属性
export default withWindowSize(MyComp)
```

这样，通过 withWindowSize 这样一个高阶组件模式，你就可以把 useWindowSize 的结果作为属性，传递给需要使用窗口大小的类组件，这样就可以实现在 Class 组件中复用 Hooks 的逻辑了。
