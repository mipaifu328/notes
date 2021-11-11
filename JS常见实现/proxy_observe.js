/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-09-28 09:27:55
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-09-28 09:27:55
 */
const data = {
  name: 'Tom',
  age: 20,
  info: {
    city: 'guangzhou',
  },
}
// const data = [1, 2, 3, 4]
function reactiveObject(data) {
  if (typeof data !== 'object' || data == null) {
    return data
  }
  const proxyConfig = {
    get(target, key, receiver) {
      // 排除非自身属性（类似数组push（）会触发get push）
      const ownKeys = Reflect.ownKeys(target)
      if (ownKeys.includes(key)) {
        // 监听
        console.log(`get: ${key}`)
      }
      const result = Reflect.get(target, key, receiver)

      // 深度监听，和Object.defineProperty不一样，没一次性深度监听
      return reactiveObject(result)
    },
    set(target, key, value, receiver) {
      // 新旧数据值相同，不处理
      if (target[key] === value) {
        return true
      }
      // 监听是否新增属性
      const ownKeys = Reflect.ownKeys(target)
      if (ownKeys.includes(key)) {
        // 监听
        console.log('已有属性')
      } else {
        console.log('新增属性')
      }
      const result = Reflect.set(target, key, value, receiver)
      console.log(`set: ${key}  ${value}`)
      return result
    },
    deleteProperty(target, key, receiver) {
      const result = Reflect.deleteProperty(target, key, receiver)
      console.log(`delete: ${key}`)
      return result
    },
  }
  const proxy = new Proxy(data, proxyConfig)
  return proxy
}

const proxy = reactiveObject(data)
// proxy.push(10)
// proxy.info // get: info
// proxy.info.city // get: info   get: city

proxy.age = 100 //已有属性  set: age  100
proxy.children = 3 // 新增属性  set: children  3
