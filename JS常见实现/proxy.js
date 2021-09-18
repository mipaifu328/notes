// let obj = function (a, b) {
//   return a + b;
// };

// let proxy = new Proxy(obj, {
//   apply(target, thisArg, argumentList) {
//     console.log("call");
//     return Reflect.apply(target, thisArg, argumentList);
//   },
// });

// proxy(12, "tom");

// var messages = [],
//   handlers = {
//     get(target, key) {
//       // 是字符串值吗？
//       if (typeof target[key] == "string") {
//         // 过滤掉标点符号
//         return target[key].replace(/[^\w]/g, "");
//       }

//       // 让其余的东西通过
//       return target[key];
//     },
//     set(target, key, val) {
//       // 仅设置唯一的小写字符串
//       if (typeof val == "string") {
//         val = val.toLowerCase();
//         if (target.indexOf(val) == -1) {
//           target.push(val);
//         }
//       }
//       return true;
//     },
//   },
//   messages_proxy = new Proxy(messages, handlers);

// // 在别处：
// messages_proxy.push("heLLo...", 42, "wOrlD!!", "WoRld!!");

// messages_proxy.forEach(function (val) {
//   console.log(val);
// });
// // hello world

// messages.forEach(function (val) {
//   console.log(val);
// });
// // hello... world!!

let person = {
  name: "Tome",
  age: 18,
};

let handler = {
  get() {
    throw "No such property/method!";
  },
  set() {
    throw "No such property/method!";
  },
};

let pobj = new Proxy({}, handler);

// 让 `pobj` 称为 `obj` 的后备
Object.setPrototypeOf(person, pobj);

person.name; // Tom
person.name1; // No such property/method!
