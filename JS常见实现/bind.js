/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-09-18 15:52:41
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-09-24 09:36:50
 */
// 方式一
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // 可能的与 ECMAScript 5 内部的 IsCallable 函数最接近的东西，
      throw new TypeError(
        'Function.prototype.bind - what ' +
          'is trying to be bound is not callable'
      )
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(
          this instanceof fNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments))
        )
      }
    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()

    return fBound
  }
}

// 方式二
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this,
      curried = [].slice.call(arguments, 1),
      bound = function bound() {
        return fn.apply(
          !this ||
            (typeof window !== 'undefined' && this === window) ||
            (typeof global !== 'undefined' && this === global)
            ? obj
            : this,
          curried.concat.apply(curried, arguments)
        )
      }
    bound.prototype = Object.create(fn.prototype)
    return bound
  }
}

// https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650747563&idx=1&sn=3d9e18b4117a0d0547fc2ef0019a0d63
Function.prototype.bindFn = function bind(thisArg) {
  if (typeof this !== 'function') {
    throw new TypeError(this + ' must be a function')
  }
  // 存储调用bind的函数本身
  var self = this
  // 去除thisArg的其他参数 转成数组
  var args = [].slice.call(arguments, 1)
  var bound = function () {
    // bind返回的函数 的参数转成数组
    var boundArgs = [].slice.call(arguments)
    var finalArgs = args.concat(boundArgs)
    // new 调用时，其实this instanceof bound判断也不是很准确。es6 new.target就是解决这一问题的。
    if (this instanceof bound) {
      // 这里是实现上文描述的 new 的第 1, 2, 4 步
      // 1.创建一个全新的对象
      // 2.并且执行[[Prototype]]链接
      // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
      // self可能是ES6的箭头函数，没有prototype，所以就没必要再指向做prototype操作。
      if (self.prototype) {
        // ES5 提供的方案 Object.create()
        // bound.prototype = Object.create(self.prototype);
        // 但 既然是模拟ES5的bind，那浏览器也基本没有实现Object.create()
        // 所以采用 MDN ployfill方案 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
        function Empty() {}
        Empty.prototype = self.prototype
        bound.prototype = new Empty()
      }
      // 这里是实现上文描述的 new 的第 3 步
      // 3.生成的新对象会绑定到函数调用的`this`。
      var result = self.apply(this, finalArgs)
      // 这里是实现上文描述的 new 的第 5 步
      // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，
      // 那么`new`表达式中的函数调用会自动返回这个新的对象。
      var isObject = typeof result === 'object' && result !== null
      var isFunction = typeof result === 'function'
      if (isObject || isFunction) {
        return result
      }
      return this
    } else {
      // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
      return self.apply(thisArg, finalArgs)
    }
  }
  return bound
}
