/*
 * @Descripttion: 限制并发
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-11-04 09:46:58
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-11-04 11:45:35
 */

// ES6 方式实现
function asyncPool(poolLimit, requestPools) {
  const results = []
  const executing = [] // 正在执行

  const enqueue = function () {
    const request = requestPools.shift()
    if (!request) {
      return Promise.resolve()
    }

    const p = Promise.resolve().then(() => {
      console.log(1)
      return request()
    })

    results.push(p)

    const e = p.then(() => {
      console.log(2)
      return executing.splice(executing.indexOf(e), 1)
    })
    executing.push(e)

    // 使用Promise.rece，每当executing数组中promise数量低于poolLimit，就实例化新的promise并执行
    let r =
      executing.length >= poolLimit
        ? Promise.race(executing)
        : Promise.resolve()
    // 递归，直到遍历完requestPools
    return r.then(() => enqueue())
  }

  return enqueue().then(() => Promise.all(results))
}

// ES7
async function concurrentControl(poolLimit, requestPool) {
  // 存放所有请求返回的 promise
  const ret = []
  // 正在执行的请求，用于控制并发
  const executing = []

  while (requestPool.length > 0) {
    const request = requestPool.shift()
    const p = Promise.resolve().then(() => request())
    ret.push(p)
    // p.then()返回一个新的 promise，表示当前请求的状态
    const e = p.then(() => executing.splice(executing.indexOf(e), 1))
    executing.push(e)
    if (executing.length >= poolLimit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(ret)
}

// 测试

let i = 0
function generateRequest() {
  const j = ++i
  return function request() {
    return new Promise((resolve) => {
      console.log(`r${j}...`)
      setTimeout(() => {
        resolve(`r${j}`)
      }, 1000 * j)
    })
  }
}
const requestPool = [
  generateRequest(),
  generateRequest(),
  generateRequest(),
  generateRequest(),
]

async function main() {
  const results = await asyncPool(2, requestPool)
  console.log(results)
}
main()
