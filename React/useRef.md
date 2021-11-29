# useRef

- `在多次渲染之间共享数据`
- `保存某个 DOM 节点的引用`

Hooks 比起 Class 组件，还缺少了一个很重要的能力：在多次渲染之间共享数据。

假设你要去做一个计时器组件，这个组件有开始和暂停两个功能，这时组件渲染期间需要拿到同一个计时器，使用 useRef 最合适：

```js
import React, { useState, useCallback, useRef } from 'react'

export default function Timer() {
  // 定义 time state 用于保存计时的累积时间
  const [time, setTime] = useState(0)

  // 定义 timer 这样一个容器用于在跨组件渲染之间保存一个变量
  const timer = useRef(null)

  // 开始计时的事件处理函数
  const handleStart = useCallback(() => {
    // 使用 current 属性设置 ref 的值
    timer.current = window.setInterval(() => {
      setTime((time) => time + 1)
    }, 100)
  }, [])

  // 暂停计时的事件处理函数
  const handlePause = useCallback(() => {
    // 使用 clearInterval 来停止计时
    window.clearInterval(timer.current)
    timer.current = null
  }, [])

  return (
    <div>
      {time / 10} seconds.
      <br />
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  )
}
```

我们使用了 useRef 来创建了一个保存 window.setInterval 返回句柄的空间，从而能够在用户点击暂停按钮时清除定时器，达到暂停计时的目的。

**使用 useRef 保存的数据一般是和 UI 的`渲染无关`的，因此`当 ref 的值发生变化时，是不会触发组件的重新渲染的`，这也是 useRef 区别于 useState 的地方。**

除了存储跨渲染的数据之外，**useRef 还有一个重要的功能，就是保存某个 DOM 节点的引用。**
比如说，你需要在点击某个按钮时让某个输入框获得焦点：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null)
  const onButtonClick = () => {
    // current 属性指向了真实的 input 这个 DOM 节点，从而可以调用 focus 方法
    inputEl.current.focus()
  }
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  )
}
```
