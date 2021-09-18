/*
 * @Descripttion: 手写防抖实现
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-09-02 16:36:32
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-09-02 16:51:04
 */

function debounce(fn, delay = 500) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}
