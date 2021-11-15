# EventLoop

## 基本概念

EventLoop事件循环机制.是一种解决**javaScript单线**程运行时不会阻塞的一种机制，也就是我们经常使用**异步**的原理。

任务被分为两种，一种宏任务（MacroTask）也叫Task，一种叫微任务（MicroTask）。

- MacroTask（宏任务）
script全部代码、setTimeout、setInterval、setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）、I/O、UI Rendering。
- MicroTask（微任务）
Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver等

## 运行机制
在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务处理模型是比较复杂的，但关键步骤如下：

1. 执行一个宏任务（栈中没有就从事件队列中获取）
2. 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3. 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
4. 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
5. 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）


![EventLoop 图解](https://cdn.jsdelivr.net/gh/mipaifu328/image@master/study/EventLoop.krjz2edbss0.jpg)

## 简单例子

``` js 

console.log('start')    

setTimeout(() => {
    console.log(1)      
}, 0)

new Promise((resolve, reject) => {
    console.log(2)      
    resolve()
}).then((res) => {
    console.log(3)      
})

console.log('end')      

// 输出结果
// start
// 2
// end
// 3
// 1

```

1. 先运行同步代码。start -> 2 -> end
2. 判断是否有微任务，有则执行完所有微任务。 3
3. 执行下一个宏任务。 1