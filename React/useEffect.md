# useEffect

> useEffect 中代码的执行是`不影响渲染`出来的 UI 的，useEffect 是每次组件 `render 完后判断依赖并执行`。

`useEffect(callback, dependencies)`
第一个为要执行的函数 callback，第二个是可选的依赖项数组 dependencies。
其中依赖项是可选的，如果不指定，那么 callback 就会在每次函数组件执行完后都执行；如果指定了，那么只有依赖项中的值发生变化的时候，它才会执行。

## 知识点

- 依赖项为数组，第一次以及依赖项发生变化后执行。

- 没有依赖项，则每次 render 后都会重新执行。例如：

```js
useEffect(() => {
  // 每次 render 完一定执行
  console.log('re-rendered')
})
```

- 如果依赖项为空数组，则只在首次执行时触发，对应到 Class 组件就是 `componentDidMount`。例如：

```js
useEffect(() => {
  // 组件首次渲染时执行，等价于 class 组件中的 componentDidMount
  console.log('did mount')
}, [])
```

- 返回一个函数，用于在组件销毁的时候做一些`清理的操作`。比如移除事件的监听。这个机制就几乎等价于类组件中的 `componentWillUnmount`。

```js
// 设置一个 size 的 state 用于保存当前窗口尺寸
const [size, setSize] = useState({})
useEffect(() => {
  // 窗口大小变化事件处理函数
  const handler = () => {
    setSize(getSize())
  }
  // 监听 resize 事件
  window.addEventListener('resize', handler)

  // 返回一个 callback 在组件销毁时调用
  return () => {
    // 移除 resize 事件
    window.removeEventListener('resize', handler)
  }
}, [])
```

## 注意

- 依赖项中定义的变量一定是会在回调函数中用到的，否则声明依赖项其实是没有意义的。
- 依赖项一般是一个常量数组，而不是一个变量。因为一般在创建 callback 的时候，你其实非常清楚其中要用到哪些依赖项了。
- React 会使用浅比较来对比依赖项是否发生了变化，所以要特别注意数组或者对象类型。如果你是每次创建一个新对象，即使和之前的值是等价的，也会被认为是依赖项发生了变化。

## useEffect 代替 class 生命周期

```js
useEffect(() => {
  // componentDidMount + componentDidUpdate
  console.log('这里基本等价于 componentDidMount + componentDidUpdate')
  return () => {
    // componentWillUnmount
    console.log('这里基本等价于 componentWillUnmount')
  }
}, [deps])
```

useEffect 接收的返回值是一个回调函数，这个回调函数不只是会在组件销毁时执行，而且是每次 Effect 重新执行之前都会执行，用于清理上一次 Effect 的执行结果。它也完全不等价于 componentWillUnmount。
