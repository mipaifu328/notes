/*
 * @Descripttion: 节流
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-09-03 10:09:16
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-09-03 10:11:58
 */

function throttle(fn, delay) {
  let timer = null
  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}
