/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-12-14 11:27:24
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-12-14 11:36:11
 */


// const checkType = (type) => (val) => val === type

const checkType = function(type) {
  return function (val) {
    console.log(Object.prototype.toString.call(val).slice(8, -1) )
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase() === type.toLowerCase()
  }
}


const isObject = checkType('object')
let a = {}
console.log(isObject(a))