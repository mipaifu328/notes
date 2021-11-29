# vuex
![vuex 图解](https://next.vuex.vuejs.org/vuex.png)

## store声明
安装
``` shell
npm install vuex@next
```
实例代码

``` js

import { createStore } from 'vuex'

const store = createStore({
  // state (){return {}}代替state：{} 和data类似，防止多处引用被污染 
  //仅 2.3.0+ 支持
  state () {
    return {
      count: 666
    }
  },
  getters: {
      doubule (state) {
          return state.count * 2
      }
  },
  mutations: {
    add (state) {
      state.count++
    }
  },
  //action 并不是直接修改数据，而是通过 mutations 去修改
  actions: {
    asyncAdd ({commit}){
        setTimeout(()=>{
            commit('add') 
        },1000) 
    }
  }
})

```

## options API 使用

```js 
import { mapState, mapGetters, mapMuations, mapActions } from 'vuex'
export default {
    computed: {
        // 在 computed 函数中访问 state
        count () {
            return this.$store.state.count
        }
        // 使用对象展开运算符将此对象混入到外部对象中
        ...mapState({

            // 映射 this.count 为 store.state.count
            count,

            // 箭头函数可使代码更简练
            count: state => state.count,

            // 传字符串参数 'count' 等同于 `state => state.count`
            countAlias: 'count',

            // 为了能够使用 `this` 获取局部状态，必须使用常规函数
            countPlusLocalState (state) {
                return state.count + this.localCount
            }
        })

        // 在 computed 函数中访问 getter
        ...mapGetters([
             // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
            doneCount: 'doneTodosCount'
            'doneTodosCount',
            'anotherGetter',
            // ...
            
        ])

        methods: {
            // 使用 mutation
            ...mapMutations([
                'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

                // `mapMutations` 也支持载荷：
                'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
            ]),
            ...mapMutations({
                add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
            })

            // 使用 action
            ...mapActions([
                'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

                // `mapActions` 也支持载荷：
                'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
            ]),
            ...mapActions({
                add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
            })
        }
    }
}
```

## composition API使用 

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),

      // 在 computed 函数中访问 getter
      double: computed(() => store.getters.double),

      // 使用 mutation
      increment: () => store.commit('increment'),

      // 使用 action
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

## 模块间相互引用

**想要调用其他模块的getter，mutation，actions必须要当前模块的actions里调用（第一个参数context）。**

如果你希望使用全局 state 和 getter，`rootState` 和 `rootGetters` 会作为第三和第四参数传入 getter，也会通过 context 对象的属性传入 action。

若需要在全局命名空间内分发 action 或提交 mutation，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit` 即可。

``` js
import { createStore } from "vuex";

const moduleA = {
  namespaced: true,
  state() {
    return {
      storeCount: 0,
    };
  },
  mutations: {
    increment(state) {
      state.storeCount++;
    },
  },
  actions: {
    getOtherModule({ commit, rootState }) {
      // 使用其他模块state
      console.log(rootState.b.bCount);
      // 使用其他模块mutation
      commit("b/bMutation", 300, { root: true });
      // 使用其他模块actions
      dispatch("b/bAction", null, { root: true });
    },
  },
};

const moduleB = {
  namespaced: true,
  state() {
    return {
      bCount: 100,
    };
  },
  mutations: {
    bMutation(state, value = 100) {
      state.bCount += value;
    },
  },
  actions: {
    bAction({ commit }) {
      commit("bMutation");
    },
  },
};

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB,
  },
});

export default store;

```


## 手写迷你版vuex
- 创建Store对象存储数据
- stroe数据转为reactvie响应式数据
- 通过provide/inject提供数据共享

``` js
import { inject, reactive, computed } from "vue";

const STORE_KEY = "__store__";

function useStore() {
  return inject(STORE_KEY);
}
function createStore(options) {
  return new Store(options);
}

class Store {
  constructor(options) {
    this.$options = options;
    this._state = reactive({
      data: options.state(),
    });
    this._mutations = options.mutations;
    this._actions = options._actions;

    this.getters = {};
    Object.keys(options.getters).forEach((name) => {
      const fn = options.getters[name];
      this.getters[name] = computed(() => fn(this.state));
    });
  }
  get state() {
    return this._state.data;
  }
  commit = (type, payload) => {
    const entry = this._mutations[type];
    entry && entry(this.state, payload);
  };

  dispatch = (type, payload) => {
    const entry = this._actions[type];
    entry && entry(this, payload);
  };

  // main.js入口处app.use(store)的时候，会执行这个函数
  install(app) {
    app.provide(STORE_KEY, this);
  }
}

export { createStore, useStore };
```