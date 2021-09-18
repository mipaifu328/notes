class Subject{
    constructor() {
        this.observers = []
    }
    addObserver(observer) {
        this.observers.push(observer)
    }
    notify(msg) {
        this.observers.forEach(o => {
            o.receive(msg)
        })
    }
}

class Observer{
    constructor(name) {
        this.name = name
    }
    receive(msg) {
        console.log(`${this.name} : ${msg}`)
    }
}

const o1 = new Observer('TOM')
const o2 = new Observer('jack')

const s = new Subject()
s.addObserver(o1)
s.addObserver(o2)
s.notify('过来下')

// 发布、订阅
class Events {
    pool = {}
    on(eventKey, fn) {
        if(!eventKey) return 
        if(!fn || typeof fn !== 'function') return

        if(!this.pool[eventKey]){
            this.pool[eventKey] = [fn]
        }else if(!this.pool[eventKey].includes(fn)){
            this.pool[eventKey].push(fn)
        }
    }
    emit(eventKey) {
        if(!eventKey) return 
        if(this.pool[eventKey] && this.pool[eventKey].length){
            let args = [].slice.call(arguments, 1)
            // this.pool[eventKey].forEach(fn => {
            //     fn.apply(null, args)
            // })
            // 异步执行
            let p = Promise.resolve();
            this.pool[eventKey].map(item => {
                p = p.then(() => {
                    return item.apply(null, args);
                }).catch(e => {
                    console.log(e)
                })
            })
        }
        
    }
    off(eventKey, fn){
        if(!eventKey) {
            //解除所有
            this.pool = {}
            return
        }
        if(!fn || typeof fn !== 'function') {
            // 解除所有eventKey事件
            delete this.pool[eventKey]
            return
        }
        if(this.pool[eventKey]) {
            let index = this.pool[eventKey].findIndex(itemFn => itemFn === fn)
            this.pool[eventKey].splice(index, 1)
        }
    }
}


const eventBus = new Events()

const fn1 =  name => {
    console.log(`I say ${name}`)
}
const fn2 =  name => {
    console.log(`I run ${name}`)
}
console.time('test')
eventBus.on('say',fn1)
eventBus.on('run',fn2)
eventBus.on('run',fn1)
eventBus.emit('say','Tom')
eventBus.emit('run','Tom')
console.timeEnd('test')
eventBus.off('say',fn1)
eventBus.emit('say','Tom')