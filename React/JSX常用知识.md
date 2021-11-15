
## 简单jsx用法

``` js

class JSXBaseDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'Mipaifu328',
            imgUrl: 'https://avatars.githubusercontent.com/u/12646930?v=4',
            flag: true,
            list: [
                {
                    id: 'id-1',
                    title: '标题1'
                },
                {
                    id: 'id-2',
                    title: '标题2'
                },
                {
                    id: 'id-3',
                    title: '标题3'
                }
            ]
        }
    }
    render() {
        // 获取变量 插值
        const pElem = <p>{this.state.name}</p>
        return pElem

        // 表达式
        const exprElem = <p>{this.state.flag ? 'yes' : 'no'}</p>
        return exprElem

        // // 子元素
        const imgElem = <div>
            <p>我的头像</p>
            <img src="xxxx.png"/>
            <img src={this.state.imgUrl}/>
        </div>
        return imgElem

        // class
        const classElem = <p className="title">设置 css class</p>
        return classElem

        // style
        const styleData = { fontSize: '30px',  color: 'blue' }
        const styleElem = <p style={styleData}>设置 style</p>
        // 内联写法，注意 {{ 和 }}
        // const styleElem = <p style={{ fontSize: '30px',  color: 'blue' }}>设置 style</p>
        return styleElem

        // 原生 html
        const rawHtml = '<span>富文本内容<i>斜体</i><b>加粗</b></span>'
        const rawHtmlData = {
            __html: rawHtml // 注意，必须是这种格式
        }
        const rawHtmlElem = <div>
            <p dangerouslySetInnerHTML={rawHtmlData}></p>
            <p>{rawHtml}</p>
        </div>
        return rawHtmlElem

        // 加载组件
        const componentElem = <div>
            <p>JSX 中加载一个组件</p>
            <hr/>
            <List/>
        </div>
        return componentElem

        // &&
        const blackBtn = <button className="btn-black">black btn</button>
        const whiteBtn = <button className="btn-white">white btn</button>
        return <div>
            { this.state.theme === 'black' && blackBtn }
        </div>

        // 列表循环 map, {}表达式，里面放js
        // 列表过滤 filter
        return <ul>
            { /* vue v-for */
                this.state.list.map(
                    (item, index) => {
                        // 这里的 key 和 Vue 的 key 类似，必填，不能是 index 或 random
                        return <li key={item.id}>
                            index {index}; id {item.id}; title {item.title}
                        </li>
                    }
                )
            }
        </ul>
    }
}

export default JSXBaseDemo

```

## react事件相关

1. event 是 SyntheticEvent ，模拟出来 DOM 事件所有能力
2. event.nativeEvent 是原生事件对象
3. 所有的事件，都被挂载到 root 上， （react 16 document）
4. 和 DOM 事件不一样，和 Vue 事件也不一样

``` js

class EventDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'zhangsan',
            list: [
                {
                    id: 'id-1',
                    title: '标题1'
                },
                {
                    id: 'id-2',
                    title: '标题2'
                },
                {
                    id: 'id-3',
                    title: '标题3'
                }
            ]
        }

        // 修改方法的 this 指向
        this.clickHandler1 = this.clickHandler1.bind(this)
    }
    render() {
        // this - 使用 bind
        return <p onClick={this.clickHandler1}>
            {this.state.name}
        </p>

        // this - 使用静态方法
        return <p onClick={this.clickHandler2}>
            clickHandler2 {this.state.name}
        </p>

        // event
        return <a href="https://imooc.com/" onClick={this.clickHandler3}>
            click me
        </a>

        // 传递参数 - 用 bind(this, a, b)
        return <ul>{this.state.list.map((item, index) => {
            return <li key={item.id} onClick={this.clickHandler4.bind(this, item.id, item.title)}>
                index {index}; title {item.title}
            </li>
        })}</ul>
    }
    clickHandler1() {
        // console.log('this....', this) // this 默认是 undefined
        this.setState({
            name: 'lisi'
        })
    }
    // 静态方法，this 指向当前实例
    clickHandler2 = () => {
        this.setState({
            name: 'lisi'
        })
    }
    // 获取 event
    clickHandler3 = (event) => {
        event.preventDefault() // 阻止默认行为
        event.stopPropagation() // 阻止冒泡
        console.log('target', event.target) // 指向当前元素，即当前元素触发
        console.log('current target', event.currentTarget) // 指向当前元素，假象！！！

        // 注意，event 其实是 React 封装的。可以看 __proto__.constructor 是 SyntheticEvent 组合事件
        console.log('event', event) // 不是原生的 Event ，原生的 MouseEvent
        console.log('event.__proto__.constructor', event.__proto__.constructor)

        // 原生 event 如下。其 __proto__.constructor 是 MouseEvent
        console.log('nativeEvent', event.nativeEvent)
        console.log('nativeEvent target', event.nativeEvent.target)  // 指向当前元素，即当前元素触发
        console.log('nativeEvent current target', event.nativeEvent.currentTarget) // 指向 root ！！！
    }
    // 传递参数
    clickHandler4(id, title, event) {
        console.log(id, title)
        console.log('event', event) // 最后追加一个参数，即可接收 event
    }
}

```

为什么要合成事件：
- 更好的兼容和跨平台
- 减少内存消耗，避免频繁解绑
- 方便事件统一管理