# useContext

全局状态管理

```js
const MyContext = React.createContext(initialValue)
const value = useContext(MyContext)
```

```js
const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
}
// 创建一个 Theme 的 Context

const ThemeContext = React.createContext(themes.light)
function App() {
  // 整个应用使用 ThemeContext.Provider 作为根组件
  return (
    // 使用 themes.dark 作为当前 Context
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

// 在 Toolbar 组件中使用一个会使用 Theme 的 Button
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  )
}

// 在 Theme Button 中使用 useContext 来获取当前的主题
function ThemedButton() {
  const theme = useContext(ThemeContext)
  return (
    <button
      style={{
        background: theme.background,
        color: theme.foreground,
      }}
    >
      I am styled by theme context!
    </button>
  )
}
```

Context 提供了一个方便在多个组件之间共享数据的机制。不过需要注意的是，它的灵活性也是一柄双刃剑。

- 会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。
- 让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。

除了像 Theme、Language 等一目了然的需要全局设置的变量外，我们很少会使用 Context 来做太多数据的共享。需要再三强调的是，**Context 更多的是提供了一个强大的机制，让 React 应用具备定义全局的响应式数据的能力。**
