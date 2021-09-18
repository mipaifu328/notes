/*
 * @Descripttion: 栈基础
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-06-21 11:04:01
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-06-22 11:22:15
 */

const stack = []  // 数组模拟栈

stack.push(1)
stack.push(2)

console.log(stack)  //[ 1, 2 ]

const item1 = stack.pop()
console.log(item1, stack)   // 2 [ 1 ]
z
const item2 = stack.pop()
console.log(item2, stack)   // 1 []
