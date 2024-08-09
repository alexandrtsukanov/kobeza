// ## Необходимо написать семафор для ограничивания одновременных Promise

class IterSemaphore {
    constructor(limit, functions) {
        this.limit = limit;
        this.functions = functions;
    }

    [Symbol.iterator]() {
        let count = 0;
        let parallels = 0;
        
        return {
            next() {
                while (parallels < this.limit) {
                    exec(count);
                }
            
                return {done: true, value: undefined};
                
                function exec(index) {
                    count += 1;
                    parallels += 1;
            
                    let result = functions[index]();
            
                    if (!result instanceof Promise) {
                        result = Promise.resolve(result);
                    }
            
                    result
                        .then(value => {
                            parallels -= 1;
                            return {done: false, value};
                        })
                        .catch(err => {
                            parallels -= 1;
                            return {done: false, value: err};
                        })
                        .finally(() => {
                            if (count < functions.length) {
                                exec(count);
                            }
                        });
                }
            }
        }
    }
}

// const limitedPromises = new IterSemaphore(2, [f1, f2, f3, f4, f5, f6]);

// Promise.all(limitedPromises).then(console.log).catch(console.error);

// ## Необходимо написать структуру RWLock

class RWLock {
    constructor(data) {
        this.data = data;
        this.readers = 0;
    }

    // Reading
    get() {
        if (this.readers < 0) {
            throw new Error('Resourse is being written');
        }

        this.readers += 1;

        let isFree = false;

        const wrapper = {
            proxy: this.freeze(this.data),
            free: () => {
                if (isFree) {
                    return;
                }

                wrapper.proxy = null;
                this.readers -= 1;
                isFree = true;

            },
            [Symbol.dispose]() {
                wrapper.free();
            },
        }

        return this.freeze(wrapper);
    }

    // Writing
    getMut() {
        if (this.readers !== 0) {
            throw new Error('Resourse is being read');
        }

        this.readers = -1;

        let isFree = false;

        const wrapper = {
            proxy: this.data,
            free: () => {
                if (isFree) {
                    return;
                }

                wrapper.proxy = null;
                this.readers = 0;
                isFree = true;
            },
            [Symbol.dispose]() {
                wrapper.free();
            },
        }

        return wrapper;
    }

    freeze(obj) {
        return Object.freeze({...obj});
    }
}

const lock = new RWLock({value: 1});

const {proxy, free} = lock.get();

console.log(proxy.value); // 1

{
    try {
        proxy.value = 2;      // Exception
    } catch {}
    
    try {
        lock.getMut();        // Exception - уже есть читающие
    } catch(err) {
        console.log(err);
    }
    
    free()
}

{
    const {proxy, free} = lock.getMut();

    proxy.value += 2;
  
    console.log(proxy.value); // 3
  
    try {
        lock.get();           // Exception - уже есть пишущий
    } catch(err) {
        console.log(err);
    }

    free()
}

{
    const {proxy, free} = lock.get();
    console.log(proxy.value);
}

// ## Необходимо написать асинхронный семафор

function createsAsyncSemaphore(callback, ...flags) {
    const arr = [];

    return function(arg) {
        arr.push(arg);

        return new Promise((resolve) => {
            if (flags.length === arr.length) {
                resolve(callback());
            }
        })
    }
}

const semaphore = createsAsyncSemaphore(() => {
    console.log('Boom!');
    return 121;
}, 'foo', 'bar');
  
// console.log(semaphore('foo'));
// console.log(semaphore('bar'));
// console.log(semaphore('bla'));

semaphore('foo').then(console.log); // 121

// Boom!
semaphore('bar').then(console.log); // 121

semaphore('bla').then(console.log);