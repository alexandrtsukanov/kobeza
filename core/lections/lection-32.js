class Semaphore {
    constructor(data, consumers) {
        this.data = data;
        this.consumers = consumers;
        this.queue = [];
    }

    getValue() {
        if (this.consumers === 0) {
            throw new Error('Lack of resourses');
        }

        this.consumers -= 1;

        let free = false;

        const wrapper = {
            [Symbol.dispose]() {
                wrapper.free();
            },
            data: this.data,
            free: () => {
                if (free) {
                    return;
                }
                
                wrapper.data = null;
                this.consumers += 1;
                free = true;
            }
        }

        return wrapper;
    }

    getAsyncValue() {
        const exec = () => {
            this.consumers -= 1;
    
            let free = false;
    
            const wrapper = {
                [Symbol.dispose]() {
                    this.free();
                },
                data: this.data,
                free: () => {
                    if (free) {
                        return;
                    }
                    
                    wrapper.data = null;
                    this.free();
                    free = true;
                }
            }
    
            return wrapper;
        };

        return new Promise((resolve) => {
            if (this.consumers === 0) {
                this.queue.push(() => resolve(exec()));
            } else {
                resolve(exec());
            }
        })
    }

    free() {
        this.queue.shift()?.();
        this.consumers += 1;
    }
}

const map = new Semaphore(new Map(), 2);

const user1 = map.getValue();
const user2 = map.getValue();

user1.data.set('foo', 1);
user1.free();
user2.data.set('bar', 2);
// user2.free();

// console.log(map.data);

const user3 = map.getAsyncValue()
    .then(({data}) => {
        console.log('Bam!');
        data.set('bla', 3);
        console.log(data);
    })

class Cow {
    constructor(data) {
        this.data = data;
    };

    get() {
        return this.readonly(() => {
            return new Proxy(this.data, {
                get(target, p, receiver) {
                    const value = Reflect.get(target, p, receiver);
    
                    if (value !== null && typeof value === 'object') {
                        //
                    }
                }
            })
        }) 
    };

    getMute() {
        return structuredClone(this.data);
    };

    readonly(cb) {
        //
    };
}

const data = new Cow({foo: 1})