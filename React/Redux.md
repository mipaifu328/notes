# [Redux](https://www.redux.org.cn/)

## 基本概念

- store/state
state 变化时需要返回全新的对象，而不是修改传入的参数。
- action
改变内部 state 惟一方法是 dispatch 一个 action
- reducer
reducer，形式为(previousState, action) => newState 的**纯函数**。描述了 action 如何把 state 转变成下一个 state。

``` js
import { createStore } from 'redux';

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
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。
let store = createStore(counter);

// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() =>
  console.log(store.getState())
);

// 改变内部 state 惟一方法是 dispatch 一个 action。
// action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
store.dispatch({ type: 'INCREMENT' });
// 1
store.dispatch({ type: 'INCREMENT' });
// 2
store.dispatch({ type: 'DECREMENT' });
// 1

```

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

## redux-react

## 异步action
- redux-thunk
- redux-promise
- redux-saga

## 中间件

![redux中间件](https://cdn.jsdelivr.net/gh/mipaifu328/image@master/study/redux-mid.2z26xnbb9j40.png)


