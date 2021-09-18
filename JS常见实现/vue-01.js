/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-08-11 09:34:16
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-09-14 16:25:34
 */
// observer

const oldArrayProto = Array.prototype
const ArrayProto = Object.create(oldArrayProto)
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(
  (method) => {
    ArrayProto[method] = function () {
      console.log('update')
      oldArrayProto[method].apply(this, [...arguments])
    }
  }
)

// Object.defineProperty
/**
 * 递归监听，一次性递归到底
 * 无法监测新增、删除属性（vue.set vue.delete）
 * */
function defineReactive(obj, key, value) {
  // 深度监听
  observe(value)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    set(newValue) {
      if (newValue !== value) {
        value = newValue
        // 设置时，也要深度监听
        observe(value)
        console.log(`set ${key} ${newValue}`)
      }
    },
    get() {
      console.log(`get ${key}`)
      return value
    },
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  // 如果是数组，修改该原型
  if (Array.isArray(obj)) {
    obj.__proto__ = ArrayProto
  }
  for (let key in obj) {
    defineReactive(obj, key, obj[key])
  }
}

const data = {
  name: '张三',
  msg: {
    age: 12,
  },
  likes: [],
}

observe(data)

// data.name = "李五";
// console.log(data.name);
// data.msg.age = 13;
data.likes.push('Apple')
console.log(data.likes)

// function reative(obj) {
//   let name = obj.name;
//   Object.defineProperty(obj, "name", {
//     set(val) {
//       name = val;
//       console.log("set");
//     },
//     get() {
//       console.log("get");
//       return name;
//     },
//   });
// }
// reative(data);
// let data = {
//   name: "Tom",
//   age: 12,
//   likes: [{ type: 1, name: "足球" }],
// };
// var proxy = new Proxy(data, {
//   get: function (target, propKey, receiver) {
//     console.log(target, propKey, receiver);
//     return Reflect.get(target, propKey);
//   },
//   set(target, propKey, value, receiver) {
//     Reflect.set(target, propKey, value);
//     console.log(target, propKey, value, receiver);
//   },
// });
