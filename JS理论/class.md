# class

## class 不同属性申明方式区别

```js
class A {
  a() {
    console.log('a') // 保存在A的原型中
  }
  b = () => {
    console.log('b') // 保存在A实例中
  }
}

let instanceA = new A()
console.log(A.prototype) // {constructor: ƒ, a: ƒ}
console.log(instanceA) // A {b: ƒ}

class B extends A {
  a() {
    console.log('a from B')
  }
  b() {
    console.log('b from B')
  }
}
let instanceB = new B()
instanceB.a() // a from B
instanceB.b() // b
```
