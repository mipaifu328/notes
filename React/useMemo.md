# useMemo

`useCallback(fn, deps) === useMemo(() => fn, deps)`

API 签名

```js
useMemo(fn, deps)
```

fn 是产生所需数据的一个计算函数。通常来说，fn 会使用 deps 中声明的一些变量来生成一个结果，用来渲染出最终的 UI。
**如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算。**
作用

- `避免重复计算`
- `避免子组件重复渲染`

就和 useCallback 的场景一样，可以避免很多不必要的组件刷新。

```js
import React, { useState, useEffect } from 'react'

export default function SearchUserList() {
  const [users, setUsers] = useState(null)
  const [searchKey, setSearchKey] = useState('')

  useEffect(() => {
    const doFetch = async () => {
      // 组件首次加载时发请求获取用户数据
      const res = await fetch('https://reqres.in/api/users/')
      setUsers(await res.json())
    }
    doFetch()
  }, [])
  // 不是用useMemo
  let usersToShow = null
  if (users) {
    // 无论组件为何刷新，这里一定会对数组做一次过滤的操作
    usersToShow = users.data.filter((user) =>
      user.first_name.includes(searchKey)
    )
  }

  // 使用 userMemo 缓存计算的结果
  const usersToShow = useMemo(() => {
    if (!users) return null;
    return users.data.filter((user) => {
      return user.first_name.includes(searchKey));
    }
  }, [users, searchKey]);

  return (
    <div>
      <input
        type="text"
        value={searchKey}
        onChange={(evt) => setSearchKey(evt.target.value)}
      />
      <ul>
        {usersToShow &&
          usersToShow.length > 0 &&
          usersToShow.map((user) => {
            return <li key={user.id}>{user.first_name}</li>
          })}
      </ul>
    </div>
  )
}
```
