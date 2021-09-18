/*
 * @Descripttion: 队列基础
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-06-22 16:14:00
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-06-22 16:17:10
 */

const queue = []    // 数组模拟队列

queue.push(1)   // push入队列
queue.push(2)

console.log(queue)

const item1 = queue.shift()   // shift出队列
console.log(item1, queue)

const item2 = queue.shift()
console.log(item2, queue);

