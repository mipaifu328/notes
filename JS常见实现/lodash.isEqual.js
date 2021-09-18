/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-09-03 14:54:55
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-09-03 15:57:52
 */
function isObject(obj) {
  return typeof obj === "object" && obj !== null
}
function isEqual(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    // 值类型
    return obj1 === obj2
  }
  if (obj1 === obj2) {
    return true
  }

  // 非相同对象，深度对比
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)
  if (obj1Keys.lenght !== obj1Keys.lenght) {
    return false
  }
  for (let key in obj1) {
    if (!isEqual(obj1[key], obj2[key])) {
      return false
    }
  }
  return true
}

const obj1 = {
  a: 100,
  b: {
    x: 1,
    y: 2,
  },
}

const obj2 = {
  a: 100,
  b: {
    x: 1,
    y: 2,
  },
}

console.log(isEqual(obj1, obj2))
