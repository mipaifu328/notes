/*
 * @Descripttion: 柯里化
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-02-21 14:43:33
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-02-21 15:08:27
 */

function add1(a, b, c, d) {
  console.log(a + b + c + d)
  return a + b + c + d
}

/**
 * 参数定长的柯里化
 * @param {*} fn
 * @param  {...any} args
 * @returns
 */
const curry = (fn, ...args) => {
  if (fn.length > args.length) {
    return (..._args) => curry(fn, ...args, ..._args)
  } else {
    return fn(...args)
  }
}

// const curry = (fn, ...args) =>
//   // 函数的参数个数可以直接通过函数数的.length属性来访问
//   args.length >= fn.length // 这个判断很关键！！！
//     ? // 传入的参数大于等于原始函数fn的参数个数，则直接执行该函数
//       fn(...args)
//     : /**
//        * 传入的参数小于原始函数fn的参数个数时
//        * 则继续对当前函数进行柯里化，返回一个接受所有参数（当前参数和剩余参数） 的函数
//        */
//       (..._args) => curry(fn, ...args, ..._args)

const add = curry(add1)

add(1, 2, 3, 4)
add(1, 2)(3, 4)
add(1)(2)(3)(4)
