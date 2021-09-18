// var a = 1;
// var b = 2;

// function* foo() {
//   a++;
//   yield;
//   b = b * a;
//   a = (yield b) + 3;
// }

// function* bar() {
//   b--;
//   yield;
//   a = (yield 8) + b;
//   b = a * (yield 2);
// }

// function step(gen) {
//   var it = gen();
//   var last;

//   return function () {
//     // 不论`yield`出什么，只管在下一次时直接把它塞回去！
//     last = it.next(last).value;
//   };
// }

// var s1 = step(foo);
// var s2 = step(bar);

// s2(); // b--;
// s2(); // 让出 8
// s1(); // a++;
// s2(); // a = 8 + b;
// // 让出 2
// s1(); // b = b * a;
// // 让出 b
// s1(); // a = b + 3;
// s2(); // b = a * 2;

function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}
// foo是一个generator，而不是一个 iterable。我们不得不调用foo()来构建一个发生器给for..of，以便它可以迭代。
for (let i of foo()) {
  console.log(i);
}

let obj = {
  name: "Tom",
  age: 12,
};

// 对象 迭代 方式一（转译一个Generator）
// obj[Symbol.iterator] = function() {
//   let keys = Object.keys(this);
//   let count = 0;
//   return {
//     next() {
//       if (count < keys.length) {
//         return {
//           value: obj[keys[count++]],
//           done: false,
//         };
//       } else {
//         return {
//           value: undefined,
//           done: true,
//         };
//       }
//     },
//   };
// }

// 对象 迭代 方式二
obj[Symbol.iterator] = function* () {
  let keys = Object.keys(this);
  for (key of keys) {
    yield [key, obj[key]];
  }
};

for (let item of obj) {
  console.log(item);
}
