var MyModules = (function Manager() {
  var modules = {};
  function define(name, deps, fn) {
    for (var i = 0, len = deps.length; i < len; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = fn.apply(fn, deps);
  }

  function get(name) {
    return modules[name];
  }

  return {
    define: define,
    get: get,
  };
})();

MyModules.define("bar", [], function () {
  function hello(who) {
    return "Let me introduce: " + who;
  }

  return {
    hello: hello,
  };
});

MyModules.define("foo", ["bar"], function (bar) {
  var hungry = "hippo";

  function awesome() {
    console.log(bar.hello(hungry).toUpperCase());
  }

  return {
    awesome: awesome,
  };
});

var bar = MyModules.get("bar");
var foo = MyModules.get("foo");

console.log(bar.hello("hippo")); // Let me introduce: hippo

foo.awesome(); // LET ME INTRODUCE: HIPPO
