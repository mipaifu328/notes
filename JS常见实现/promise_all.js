/*
 * @Descripttion: promise.all实现
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-08-26 16:23:28
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-08-30 16:18:24
 */

Promise.myAll = function(arr) {
    
    return new Promise((resolve, reject) => {
        
        if(!arr || arr.length === 0) {
            resolve([])
        }else{
            let result = []
            let count = 0 // 计数器，用于判断所有任务是否执行完成
            for(let i = 0, len = arr.length; i< len; i++){
                // 考虑到iterators[i]可能是普通对象，则统一包装为Promise对象
                Promise.resolve(arr[i]).then((data) => {
                    result[i] = data;// 按顺序保存对应的结果
                    // 当所有任务都执行完成后，再统一返回结果
                    if(++count === len){
                        resolve(result)
                    }
                },( err )=> {
                    reject(err) // 任何一个Promise对象执行失败，则调用reject()方法
                    return
                })
            }
        }
    })
}

const p1 = new Promise((resolve, reject) => {
    resolve(1)
})
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(2), 1000)
})
const p3 = new Promise((resolve, reject) => {
    resolve(3)
})

Promise.all([p1, p2, p3]).then( res => {
    console.log(res)
})

Promise.myAll([p1, p2, p3]).then( res => {
    console.log(res)
})