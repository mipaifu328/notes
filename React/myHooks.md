# 自定义 hooks

## 封装通用逻辑：useAsync

有一个最常见的需求：发起异步请求获取数据并显示在界面上。在这个过程中，我们不仅要关心请求正确返回时，UI 会如何展现数据；还需要处理请求出错，以及关注 Loading 状态在 UI 上如何显示。
通常都会遵循下面步骤：

- 创建 data，loading，error 这 3 个 state；
- 请求发出后，设置 loading state 为 true；
- 请求成功后，将返回的数据放到某个 state 中，并将 loading state 设为 false；
- 请求失败后，设置 error state 为 true，并将 loading state 设为 false。

最后，基于 data、loading、error 这 3 个 state 的数据，UI 就可以正确地显示数据，或者 loading、error 这些反馈给用户了。

```js
import { useState } from 'react'

const useAsync = (asyncFunction) => {
  // 设置三个异步逻辑相关的 state
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // 定义一个 callback 用于执行异步逻辑
  const execute = useCallback(() => {
    // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态
    setLoading(true)
    setData(null)
    setError(null)
    return asyncFunction()
      .then((response) => {
        // 请求成功时，将数据写进 state，设置 loading 为 false
        setData(response)
        setLoading(false)
      })
      .catch((error) => {
        // 请求失败时，设置 loading 为 false，并设置错误状态
        setError(error)
        setLoading(false)
      })
  }, [asyncFunction])

  return { execute, loading, data, error }
}
```

```js
import React from 'react'
import useAsync from './useAsync'

export default function UserList() {
  // 通过 useAsync 这个函数，只需要提供异步逻辑的实现
  const {
    execute: fetchUsers,
    data: users,
    loading,
    error,
  } = useAsync(async () => {
    const res = await fetch('https://reqres.in/api/users/')
    const json = await res.json()
    return json.data
  })

  return (
    <div className="user-list">
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Show Users'}
      </button>
      {error && <div style={{ color: 'red' }}>Failed: {String(error)}</div>}
      <br />
      <ul>
        {users &&
          users.length > 0 &&
          users.map((user) => {
            return <li key={user.id}>{user.first_name}</li>
          })}
      </ul>
    </div>
  )
}
```

## 监听浏览器状态：useScroll

用到浏览器的 API 来监听这些状态的变化。

```js
import { useState, useEffect } from 'react'

// 获取横向，纵向滚动条位置
const getPosition = () => {
  return {
    x: document.body.scrollLeft,
    y: document.body.scrollTop,
  }
}
const useScroll = () => {
  // 定一个 position 这个 state 保存滚动条位置
  const [position, setPosition] = useState(getPosition())
  useEffect(() => {
    const handler = () => {
      setPosition(getPosition(document))
    }
    // 监听 scroll 事件，更新滚动条位置
    document.addEventListener('scroll', handler)
    return () => {
      // 组件销毁时，取消事件监听
      document.removeEventListener('scroll', handler)
    }
  }, [])
  return position
}
```

有了这个 Hook，你就可以非常方便地监听当前浏览器窗口的滚动条位置了。比如下面的代码就展示了“返回顶部”这样一个功能的实现：

```js
import React, { useCallback } from 'react'
import useScroll from './useScroll'

function ScrollTop() {
  const { y } = useScroll()

  const goTop = useCallback(() => {
    document.body.scrollTop = 0
  }, [])

  const style = {
    position: 'fixed',
    right: '10px',
    bottom: '10px',
  }
  // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
  if (y > 300) {
    return (
      <button onClick={goTop} style={style}>
        Back to Top
      </button>
    )
  }
  // 否则不 render 任何 UI
  return null
}
```

## 拆分复杂组件

```js
function BlogList() {
  // 获取文章列表...
  // 获取分类列表...
  // 组合文章数据和分类数据...
  // 根据选择的分类过滤文章...
  // 渲染 UI ...
}
```

尽量将相关的逻辑做成独立的 Hooks，然后在函数组中使用这些 Hooks，通过参数传递和返回值让 Hooks 之间完成交互。

拆分逻辑的目的不一定是为了重用，而可以是仅仅为了业务逻辑的隔离。所以在这个场景下，我们不一定要把 Hooks 放到独立的文件中，而是可以和函数组件写在一个文件中。

```js
import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { Select, Table } from 'antd'
import _ from 'lodash'
import useAsync from './useAsync'

const endpoint = 'https://myserver.com/api/'
const useArticles = () => {
  // 使用上面创建的 useAsync 获取文章列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/posts`)
      return await res.json()
    }, [])
  )
  // 执行异步调用
  useEffect(() => execute(), [execute])
  // 返回语义化的数据结构
  return {
    articles: data,
    articlesLoading: loading,
    articlesError: error,
  }
}
const useCategories = () => {
  // 使用上面创建的 useAsync 获取分类列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/categories`)
      return await res.json()
    }, [])
  )
  // 执行异步调用
  useEffect(() => execute(), [execute])

  // 返回语义化的数据结构
  return {
    categories: data,
    categoriesLoading: loading,
    categoriesError: error,
  }
}
const useCombinedArticles = (articles, categories) => {
  // 将文章数据和分类数据组合到一起
  return useMemo(() => {
    // 如果没有文章或者分类数据则返回 null
    if (!articles || !categories) return null
    return articles.map((article) => {
      return {
        ...article,
        category: categories.find(
          (c) => String(c.id) === String(article.categoryId)
        ),
      }
    })
  }, [articles, categories])
}
const useFilteredArticles = (articles, selectedCategory) => {
  // 实现按照分类过滤
  return useMemo(() => {
    if (!articles) return null
    if (!selectedCategory) return articles
    return articles.filter((article) => {
      console.log('filter: ', article.categoryId, selectedCategory)
      return String(article?.category?.name) === String(selectedCategory)
    })
  }, [articles, selectedCategory])
}

const columns = [
  { dataIndex: 'title', title: 'Title' },
  { dataIndex: ['category', 'name'], title: 'Category' },
]

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  // 获取文章列表
  const { articles, articlesError } = useArticles()
  // 获取分类列表
  const { categories, categoriesError } = useCategories()
  // 组合数据
  const combined = useCombinedArticles(articles, categories)
  // 实现过滤
  const result = useFilteredArticles(combined, selectedCategory)

  // 分类下拉框选项用于过滤
  const options = useMemo(() => {
    const arr = _.uniqBy(categories, (c) => c.name).map((c) => ({
      value: c.name,
      label: c.name,
    }))
    arr.unshift({ value: null, label: 'All' })
    return arr
  }, [categories])

  // 如果出错，简单返回 Failed
  if (articlesError || categoriesError) return 'Failed'

  // 如果没有结果，说明正在加载
  if (!result) return 'Loading...'

  return (
    <div>
      <Select
        value={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
        options={options}
        style={{ width: '200px' }}
        placeholder="Select a category"
      />
      <Table dataSource={result} columns={columns} />
    </div>
  )
}
```
