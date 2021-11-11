## setState
- 不可变值
- 可能是异步更新
- 可能会被合并

``` js
// 不可变值（函数式编程，纯函数） - 数组
const list5Copy = this.state.list5.slice()
list5Copy.splice(2, 0, 'a') // 中间插入/删除
this.setState({
    list1: this.state.list1.concat(100), // 追加
    list2: [...this.state.list2, 100], // 追加
    list3: this.state.list3.slice(0, 3), // 截取
    list4: this.state.list4.filter(item => item > 100), // 筛选
    list5: list5Copy // 其他操作
})
// 注意，不能直接对 this.state.list 进行 push pop splice 等，这样违反不可变值

// 不可变值 - 对象
this.setState({
    obj1: Object.assign({}, this.state.obj1, {a: 100}),
    obj2: {...this.state.obj2, a: 100}
})
// 注意，不能直接对 this.state.obj 进行属性设置，这样违反不可变值
```

