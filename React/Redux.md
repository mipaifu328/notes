# [Redux](https://www.redux.org.cn/)

## 基本概念

- store/state
  state 变化时需要返回全新的对象，而不是修改传入的参数。
  Redux 应用只有一个单一的 store - 提供 getState() 方法获取 state； - 提供 dispatch(action) 方法更新 state； - 通过 subscribe(listener) 注册监听器; - 通过 subscribe(listener) 返回的函数注销监听器。
- action
  改变内部 state 惟一方法是 dispatch 一个 action
- reducer
  reducer，形式为(previousState, action) => newState 的**纯函数**。描述了 action 如何把 state 转变成下一个 state。

```js
import { createStore } from 'redux'

/**
 * 这是一个 reducer，形式为 (state, action) => state 的纯函数。
 * 描述了 action 如何把 state 转变成下一个 state。
 *
 * state 的形式取决于你，可以是基本类型、数组、对象、
 * 甚至是 Immutable.js 生成的数据结构。惟一的要点是
 * 当 state 变化时需要返回全新的对象，而不是修改传入的参数。
 *
 * 下面例子使用 `switch` 语句和字符串来做判断，但你可以写帮助类(helper)
 * 根据不同的约定（如方法映射）来判断，只要适用你的项目即可。
 */
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。
let store = createStore(counter)

// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() => console.log(store.getState()))

// 改变内部 state 惟一方法是 dispatch 一个 action。
// action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

一个完整的 Redux 的逻辑：

- 先创建 Store；
- 再利用 Action 和 Reducer 修改 Store；
- 最后利用 subscribe 监听 Store 的变化。

官方示例 ：[Todo List](https://www.redux.org.cn/docs/basics/ExampleTodoList.html)

![redux todolist demo](https://cdn.jsdelivr.net/gh/mipaifu328/image@master/study/Redux.5e43s0tk9us0.jpg)

## 三大原则

- `单一数据源`
  整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。
- `state只读`
  唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。
- `使用纯函数来执行修改`
  为了描述 action 如何改变 state tree ，你需要编写 reducers。Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。

## 单向数据流

**严格的单向数据流**是 Redux 架构的设计核心。
Redux 应用中数据的生命周期遵循下面 4 个步骤：

1. 调用 store.dispatch(action)。
2. Redux store 调用传入的 reducer 函数。
3. 根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树。
4. Redux store 保存了根 reducer 返回的完整 state 树。
   所有订阅 store.subscribe(listener) 的监听器都将被调用；监听器里可以调用 store.getState() 获得当前 state。

## react-redux

Redux 默认并不包含 React 绑定库，需要单独安装。

```shell
npm install --save react-redux
```

`<Provider> `让所有容器组件都可以访问 store，而不必显示地传递它。只需要在渲染根组件时使用即可。

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

完成了这样的配置之后，在函数组件中使用 Redux 就非常简单了：利用 react-redux 提供的 `useSelector` 和 `useDispatch` 这两个 Hooks。

**可以使用 useSelector、useDispatch 等 HooksApi 替代 connect，减少模板代码。**

```js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export function Counter() {
  // 从 state 中获取当前的计数值
  const count = useSelector((state) => state.value)

  // 获得当前 store 的 dispatch 方法
  const dispatch = useDispatch()

  // 在按钮的 click 时间中去分发 action 来修改 store
  return (
    <div>
      <button onClick={() => dispatch({ type: 'counter/incremented' })}>
        +
      </button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'counter/decremented' })}>
        -
      </button>
    </div>
  )
}
```

## 异步 action

- redux-thunk
- redux-promise
- redux-saga

## 中间件

[Middleware](https://www.redux.org.cn/docs/advanced/Middleware.html)，它提供的是位于 action 被发起之后，到达 reducer 之前的扩展点。

![redux中间件](https://cdn.jsdelivr.net/gh/mipaifu328/image@master/study/redux-mid.2z26xnbb9j40.png)

## redux-toolkit

### configureStore

configureStore 替换现有的 createStore 调。configureStore 接受一个具有指定字段的对象，而不是多个函数参数，因此我们需要将 reducer 函数作为一个名为 reducer 的字段传递：

```js
// 之前:
const store = createStore(counter)

// 之后:
const store = configureStore({
  reducer: counter,
})
```

### createAction

createAction 接受一个 action 类型字符串作为参数，并返回一个使用该类型字符串的 action creator 函数。

```js
// 原本的实现: 纯手工编写 action type 和 action creator
const INCREMENT = 'INCREMENT'

function incrementOriginal() {
  return { type: INCREMENT }
}

console.log(incrementOriginal())
// {type: "INCREMENT"}

// 或者，使用 `createAction` 来生成 action creator:
const incrementNew = createAction('INCREMENT')

console.log(incrementNew())
// {type: "INCREMENT"}
```

### createReducer

createReducer 函数 ，它让使用"查找表"对象的方式编写 reducer，其中对象的每一个 key 都是一个 Redux action type 字符串，value 是 reducer 函数：

```js
const increment = createAction('INCREMENT')
const decrement = createAction('DECREMENT')

const counter = createReducer(0, {
  // [increment.type]: (state) => state + 1,
  // [decrement.type]: (state) => state - 1,
  // toString()返回type
  [increment]: (state) => state + 1,
  [decrement]: (state) => state - 1,
})
// 代替switch
function counter(state = 0, action) {
  switch (action.type) {
    case increment.type:
      return state + 1
    case decrement.type:
      return state - 1
    default:
      return state
  }
}
```

### createSlice

createSlice 函数 的作用。它允许我们提供一个带有 reducer 函数的对象，并且它将根据我们列出的 reducer 的名称自动生成 action type 字符串和 action creator 函数。

createSlice 返回一个 "分片" 对象，该对象包含生成的 reducer 函数作为一个名为 reducer 的字段，以及在一个名为 actions 的对象中生成的 action creator。

```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
})

const store = configureStore({
  reducer: counterSlice.reducer,
})

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(counterSlice.actions.increment())
})
```

```js
//ES6的解构语法来提取 action creator 函数作为变量
const { actions, reducer } = counterSlice
const { increment, decrement } = actions
```

### 总结

- `configureStore`: 像从 Redux 最初的 createStore 一样，创建一个 Redux store 实例， 但是接受一个命名选项对象，并自动设置 Redux DevTools 扩展
- `createAction`: 接受一个 action type 字符串，并使用该 type 返回一个使用该类型的 action creator 函数
- `createReducer`: 为 reducer 函数接受一个初始状态值和 action type 的查找表，并创建一个 reducer 来处理所有这些 action type
- `createSlice`: 接受一个初始状态和一个包含 reducer 名称和函数的查找表，并自动生成 action creator 函数、action type 字符串和一个 reducer 函数
