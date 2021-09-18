# 栈

> 特点： 后进先出

## 场景一：十进制转二进制

把余数依次入栈，然后再出栈。

![十进制转二进制](https://cdn.jsdelivr.net/gh/mipaifu328/image@master/study/十进制转二进制.jpeg)

## 场景二：有效的括号
- 越靠后的左括号，对应的右括号越靠前。
- 左括号入栈，右括号出栈，最后栈空了就是合法的。

``` js
    (({{[[]]}}))    // true
    ()()()          // true
    ((])            // false
    ((())())        // true
```

## 场景三：函数调用堆栈
- 最后调用的函数，最先执行完。
- js解释器使用栈来控制函数的调用顺序。

``` js
function foo() {
    bar()
    console.log('foo over')
}
function bar() {
    console.log('bar over')
}
foo() 
// bar over
// foo over
```