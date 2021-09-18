/*
 * @Descripttion: 深拷贝实现
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-08-21 13:01:10
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-08-30 16:18:42
 */

// 解决循环引用问题i
let map = new WeakMap(); 

function deepClone(obj) {
    // typeof 能清楚查看值类型和方法，面对对象引用类型只返回object
    // 除了 == null，其他都用===， tip: == null => === null || === undefined
    if(typeof obj !== 'object' || obj == null) {
        // 非对象数组
        return obj;
    }
    
    // let result;
    // if(obj instanceof Array) {
    //     result = []
    // }else{
    //     result = {}
    // }

    let result = Array.isArray(obj) ? [] : {}

    if(map.has(obj)) {
        result = map.get(obj);
    }else{
        map.set(obj, result)
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                // result[key] = deepClone(obj[key])
                if(obj[key] && typeof obj[key] === 'object'){
                    result[key] = deepClone(obj[key])
                }else{
                    result[key] = obj[key]
                }
            }
        }
    }

    return result;
}


const test = {
    name: 'Tome',
    age: 12,
    likes: {
        type: 'football'
    }
}
const loop = {}
loop.links = test;
test.links = loop;

const result = deepClone(test)

result.likes.type = 'other';
console.log(test, result)